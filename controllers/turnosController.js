import { uuid } from "uuidv4";
import { getNow, getToday } from "../utils/dates.js";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
import model from "../models/index.js";
import { registrarBitacora } from "../services/bitacora.js";
const iniciarHorario = async (uuid, partida, date, time, operador) => {};

const eliminarHorario = async (uuid) => {
  await model.horario.destroy({ where: { id_horario: uuid } });
};

export const finalizarTurno = async (req, res) => {
  const { uuid } = req.body;
  const time = getNow();
  await model.horario.update(
    { hora_llegada: time },
    { where: { id_horario: uuid } },
  );
  res.status(200).json({ message: "Turno finalizado" });
};

export const designarTurno = async (req, res) => {
  const { interno, chofer, partida, token, } = req.body;
  let { date, time } = req.body;
  const horario = uuid();
  const id_turno = uuid();
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
      id_linea,
    );
    console.log("Hola4");
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
    ],
  });
  res.status(200).json(turnos);
};
