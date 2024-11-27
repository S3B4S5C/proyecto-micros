import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { registrarNotificacion, eliminarNotificacion, getNotificacionesLinea} from "../controllers/notificacionController.js";
import { operadorValidation } from "../middlewares/roleValidation.js";

const router = express.Router();

router.post("/crear", authRequired, operadorValidation,registrarNotificacion)

router.post("/eliminar", authRequired, operadorValidation, eliminarNotificacion)

router.post("/linea", authRequired, operadorValidation, getNotificacionesLinea)

export default router;