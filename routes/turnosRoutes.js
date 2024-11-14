import express from "express";

const router = express.Router();

import {
  designarTurno,
  finalizarTurno,
  getTurnosActivos,
  getCargaHorariaChofer,
  frecuenciaMicro,
  crearHorario,
  eliminarHora, 
  getHorarios
} from "../controllers/turnosController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js";
//import { microSchema } from '../schemas/turnos.schema.js'

router.post("/iniciar", authRequired, operadorValidation, designarTurno);
router.post("/finalizar", authRequired, operadorValidation, finalizarTurno);
router.post("/", authRequired, operadorValidation, getTurnosActivos);
router.post(
  "/cargaChofer",
  authRequired,
  operadorValidation,
  getCargaHorariaChofer
);
router.post("/frecuencia", authRequired, operadorValidation, frecuenciaMicro);
router.post("/crearHorario", authRequired, operadorValidation, crearHorario)
router.post("/eliminarHorario", authRequired, operadorValidation, eliminarHora)
router.post("/horarios", authRequired, operadorValidation, getHorarios )
export default router;
