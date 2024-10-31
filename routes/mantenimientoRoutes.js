import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js"; 
import { nuevoMantenimiento, getMantenimientosPorLinea, getMantenimientosPorMicros} from "../controllers/mantenimientoController.js";

const router = express.Router();

router.post("/crear", authRequired, operadorValidation, nuevoMantenimiento);

router.post("/linea", authRequired, operadorValidation, getMantenimientosPorLinea);
router.post("/micro", authRequired, operadorValidation, getMantenimientosPorMicros);
export default router;