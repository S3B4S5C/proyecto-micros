import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { finalizarIncidente, getIncidentes, registrarIncidente, getAllIncidentes } from "../controllers/incidentesController.js";


const router = express.Router();

router.post("/registrar", registrarIncidente);
router.post("/", getIncidentes);
router.post("/todos", getAllIncidentes);
router.post("/finalizar", finalizarIncidente);
export default router;