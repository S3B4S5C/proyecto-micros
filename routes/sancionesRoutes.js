import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js"; 
import {registrarSanciones, registrarFichaSancion, getSanciones, getFichaSancionPorLinea, actualizarEstadoFicha, getFichaSancionChofer} from "../controllers/sancionesController.js";

const router = express.Router();


router.post("/crear", authRequired, operadorValidation, registrarSanciones);
router.post("/crearFicha", authRequired, operadorValidation, registrarFichaSancion)
router.post("/", authRequired, operadorValidation, getSanciones)
router.post("/linea", authRequired, operadorValidation, getFichaSancionPorLinea)
router.post("/chofer", authRequired, operadorValidation, getFichaSancionChofer)
router.put("/updateEstado", authRequired, operadorValidation, actualizarEstadoFicha)

export default router;