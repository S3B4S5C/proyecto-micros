import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js"; 
import { nuevoMantenimiento} from "../controllers/mantenimientoController.js";

const router = express.Router();

router.post("/crear", authRequired, operadorValidation, nuevoMantenimiento);

export default router;