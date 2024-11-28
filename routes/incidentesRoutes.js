import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { finalizarIncidente, getIncidentes, registrarIncidente, getAllIncidentes } from "../controllers/incidentesController.js";
import { operadorSchema } from "../schemas/user.schema.js";
import { operadorValidation } from "../middlewares/roleValidation.js";


const router = express.Router();

router.post("/registrar",authRequired, operadorValidation, registrarIncidente);
router.post("/",authRequired, operadorValidation, getIncidentes);
router.post("/todos",authRequired, operadorValidation, getAllIncidentes);
router.post("/finalizar",authRequired, operadorValidation, finalizarIncidente);
export default router;