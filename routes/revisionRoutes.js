import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js"; 
import { registrarRevision, actualizarFechaProxima, getRevisionesLinea, getRevisionesMicro} from "../controllers/revisionTecnicaController.js";

const router = express.Router();

router.post("/crear", authRequired, operadorValidation, registrarRevision);
router.post("/actualizarEstado", authRequired, operadorValidation, actualizarFechaProxima)
router.post("/linea", authRequired, operadorValidation, getRevisionesLinea);
router.post("/micros", authRequired, operadorValidation, getRevisionesMicro)
export default router;