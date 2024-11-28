import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { crearComentario, eliminarComentario, getComentarios } from "../controllers/comentariosController.js"
import { operadorValidation } from "../middlewares/roleValidation.js";

const router = express.Router();

router.post("/crear",authRequired, operadorValidation, crearComentario )

router.post("/eliminar",authRequired, operadorValidation, eliminarComentario )

router.post("/linea" ,authRequired, operadorValidation, getComentarios)

export default router;