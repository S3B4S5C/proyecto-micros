import { uuid } from "uuidv4";
import { getNow, getToday } from "../utils/dates.js";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
import model from "../models/index.js";
import Sequelize from "sequelize";
import { registrarBitacora } from "../services/bitacora.js";

const MAX_CARGA_HORARIA = 7 + 20 / 60;

const convertDecimalToHM = (decimal) => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const eliminarHorario = async (uuid) => {
  await model.horario.destroy({ where: { id_horario: uuid } });
};

export const finalizarTurno = async (req, res) => {
  const { uuid } = req.body;
  const time = getNow();
  await model.horario.update(
    { hora_llegada: time },
    { where: { id_horario: uuid } }
  );
  res.status(200).json({ message: "Turno finalizado" });
};

export const designarTurno = async (req, res) => {
  const { interno, chofer, partida, token } = req.body;
  let { date, time } = req.body;
  const horario = uuid();
  const id_turno = uuid();
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress;
  try {
    const operador = userFromToken(token);
    const id_linea = idLineaFromToken(token);

    if (!date || !time) {
      date = getToday();
      time = getNow();
    }
    await model.horario.create({
      id_horario: horario,
      hora_salida: time,
      punto_de_salida: partida,
      fecha_horario: date,
      usuario_operador: operador,
    });
    const micro = await model.micro.findOne({
      where: { interno },
      include: [
        {
          model: model.linea,
          required: true,
          where: { id_linea },
        },
      ],
    });
    const turnoDesignado = await model.turno.create({
      id_turno,
      usuario_chofer: chofer,
      id_horario: horario,
      id_micro: micro.dataValues.id_micro,
    });
    registrarBitacora(
      operador,
      "CREACION",
      `El chofer ${chofer} ha iniciado un turno en el interno ${interno}`,
      ip,
      id_linea
    );
    res
      .status(201)
      .json({ message: "Turno registrado con éxito", turno: turnoDesignado });
  } catch (error) {
    await eliminarHorario(horario);
    res
      .status(500)
      .json({ message: "Error al registrar el turno", error: error.message });
  }
};

export const eliminarTurno = async (res, req) => {
  const { token } = req.body;
  const { id } = req.params;
  const id_linea = idLineaFromToken(req.body.token);
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress;
  try {
    const turno = await model.turno.findByPk(id);
    if (!turno) {
      return res.status(400).json({ message: "Turno no encontrado" });
    }
    const horario = await model.horario.findByPK(turno.id_horario);
    await turno.destroy();
    if (horario) {
      await horario.destroy();
    }
    registrarBitacora(
      token.id,
      "ELIMINACION",
      `Turno ${turno} se ha eliminado con éxito`,
      ip,
      id_linea
    );
    res.status(200).json({ message: "Turno eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el turno", error: error.message });
  }
};

export const getTurnosActivos = async (req, res) => {
  const linea = req.body.id_linea;
  const turnos = await model.turno.findAll({
    include: [
      {
        model: model.horario,
        where: {
          hora_llegada: null,
        },
        required: true,
        include: [
          {
            model: model.operadores,
            required: true,
            include: [
              {
                model: model.linea,
                required: true,
                where: { id_linea: linea },
              },
            ],
          },
        ],
      },
      {
        model: model.micro,
        attributes: ["interno", "placa"],
      },
    ],
  });
  let turnosActivos = [];
  for (const turno of turnos) {
    const turnoInfo = {
      id_turno: turno.id_turno,
      chofer: turno.usuario_chofer,
      interno: turno.micro.interno,
      placa: turno.micro.placa,
      id_horario: turno.horario.id_horario,
      fecha_horario: turno.horario.fecha_horario,
      hora_salida: turno.horario.hora_salida,
      hora_llegada: turno.horario.hora_llegada,
      punto_de_salida: turno.horario.punto_de_salida,
    };
    turnosActivos.push(turnoInfo);
  }
  res.status(200).json(turnosActivos);
};

export const getCargaHorariaChofer = async (req, res) => {
  const { token, chofer } = req.body;
  const linea = idLineaFromToken(token);
  let { fecha } = req.body || getToday();
  try {
    if (!fecha) {
      fecha = getToday();
    }
    const turnos = await model.turno.findAll({
      include: [
        {
          model: model.horario,
          as: "horario",
          attributes: [
            "hora_llegada",
            "hora_salida",
            [
              Sequelize.literal(`
                CASE

                  WHEN hora_llegada >= hora_salida
                  THEN EXTRACT(EPOCH FROM (('2023-01-01' || ' ' || hora_llegada)::timestamp - ('2023-01-01' || ' ' || hora_salida)::timestamp)) / 3600

                  ELSE EXTRACT(EPOCH FROM (('2023-01-02' || ' ' || hora_llegada)::timestamp - ('2023-01-01' || ' ' || hora_salida)::timestamp)) / 3600
                END
              `),
              "horas_turno",
            ],
          ],
          where: {
            hora_llegada: { [Sequelize.Op.ne]: null },
          },
          include: [
            {
              model: model.operadores,
              required: true,
              include: [
                {
                  model: model.linea,
                  required: true,
                  where: { id_linea: linea },
                },
              ],
            },
          ],
        },
        {
          model: model.choferes,
          required: true,
          where: { usuario_chofer: chofer },
        },
      ],
    });
    if (!turnos.length) {
      return res
        .status(404)
        .json({ message: "No se encontrarons turnos para este chofer" });
    }

    const totalHoras = turnos.reduce((sum, turno) => {
      const horasTurno = turno.horario
        ? parseFloat(turno.horario.getDataValue("horas_turno"))
        : 0;
      return sum + horasTurno;
    }, 0);
    const totalHorasFormateadas = convertDecimalToHM(totalHoras);
    res.status(200).json({ turnos, totalHoras: totalHorasFormateadas });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los turnos del chofer",
      error: error.message,
    });
  }
};

const getHorasTrabajadas = async (chofer, date) => {
  const turnos = await model.turno.findAll({
    include: [
      {
        model: model.horario,
        as: "horario",
        attributes: [
          "hora_llegada",
          "hora_salida",
          [
            Sequelize.literal(`
            CASE
              WHEN hora_llegada >= hora_salida
              THEN EXTRACT(EPOCH FROM (('2023-01-01' || ' ' || hora_llegada)::timestamp - ('2023-01-01' || ' ' || hora_salida)::timestamp)) / 3600
              ELSE EXTRACT(EPOCH FROM (('2023-01-02' || ' ' || hora_llegada)::timestamp - ('2023-01-01' || ' ' || hora_salida)::timestamp)) / 3600
            END
          `),
            "horas_turno",
          ],
        ],
        where: {
          hora_llegada: { [Sequelize.Op.ne]: null },
          fecha_horario: date,
        },
      },
      {
        model: model.choferes,
        required: true,
        where: { usuario_chofer: chofer },
      },
    ],
  });
  const totalHoras = turnos.reduce((sum, turno) => {
    const horasTurno = turno.horario
      ? parseFloat(turno.horario.getDataValue("horas_turno"))
      : 0;
    return sum + horasTurno;
  }, 0);

  return totalHoras;
};

const getChoferDisponible = async (id_linea) => {
  const date = getToday();
  const choferes = await model.choferes.findAll({
    where: { estado: "Disponible" },
    include: [
      {
        model: model.turno,
        required: true,
        include: [
          {
            model: model.micro,
            required: true,
            include: [
              {
                model: model.linea,
                required: true,
                where: { id_linea: id_linea },
              },
            ],
          },
        ],
      },
    ],
  });
  const choferesDisponibles = [];
  for (let chofer of choferes) {
    const horasTrabajadas = await getHorasTrabajadas(
      chofer.usuario_chofer,
      date
    );
    const horasRestantes = MAX_CARGA_HORARIA - horasTrabajadas;
    if (horasRestantes > 0) {
      choferesDisponibles.push(chofer);
    }
  }
  return choferesDisponibles;
};

const getUltimoTurno = async (chofer) => {
  try {
    const turnoAnterior = await model.turno.findOne({
      where: { usuario_chofer: chofer },
      order: [["id_turno", "DESC"]],
      limit: 1,
    });

    if (!turnoAnterior) {
      return null;
    }

    return turnoAnterior;
  } catch (error) {
    console.error("Error al obtener el último turno:", error);
    throw error;
  }
};

export const frecuenciaMicro = async (req, res) => {
  const { frecuencia, partida, token } = req.body;
  const date = getToday();
  const id_linea = idLineaFromToken(token);
  const frecuenciaMs = frecuencia * 60 * 1000;
  try {
    const choferesDisponibles = await getChoferDisponible(id_linea);
    if (!choferesDisponibles.length) {
      return res.status(404).json({ message: "No hay choferes disponibles" });
    }
    let indexChofer = 0;

    const intervalo = setInterval(async () => {
      const chofer = choferesDisponibles[indexChofer];
      if (!chofer) {
        clearInterval(intervalo);
        return res
          .status(200)
          .json({ message: "Todos los turnos fueron asignados" });
      }

      const cargaHorariaChofer = await getHorasTrabajadas(
        chofer.dataValues.usuario_chofer,
        date
      );
      if (cargaHorariaChofer >= MAX_CARGA_HORARIA) {
        indexChofer++;
        return;
      }

      const horario = uuid();
      const id_turno = uuid();
      const operador = userFromToken(token);

      const turnoAnterior = await getUltimoTurno(chofer.usuario_chofer);

      if (!turnoAnterior) {
        indexChofer++;
        return res.status(404).json({
          message: `El chofer ${chofer.usuario_chofer} no tiene un turno anterior registrado`,
        });
      }

      const id_micro = turnoAnterior.id_micro;
      await model.horario.create({
        id_horario: horario,
        hora_salida: getNow(),
        punto_de_salida: partida,
        fecha_horario: getToday(),
        usuario_operador: operador,
      });

      const nuevoTurno = await model.turno.create({
        id_turno,
        usuario_chofer: chofer.usuario_chofer,
        id_horario: horario,
        id_micro,
      });

      registrarBitacora(
        operador,
        "CREACION",
        `El chofer ${chofer.usuario_chofer} ha iniciado un turno en el micro ${id_micro}`,
        req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.connection.remoteAddress,
        id_linea
      );

      indexChofer++;
      if (indexChofer >= choferesDisponibles.length) {
        clearInterval(intervalo);
        return res.status(200).json({
          message: "Turnos asignados correctamente",
          ultimoTurno: nuevoTurno,
        });
      }
    }, frecuenciaMs);
  } catch (error) {
    res.status(500).json({
      message: "Error al asignar la frecuencia de turnos",
      error: error.message,
    });
  }
};
