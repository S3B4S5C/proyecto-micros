import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js"; 
import { registrarRevision} from "../controllers/revisionTecnicaController.js";

const router = express.Router();

router.post("/crear", authRequired, operadorValidation, registrarRevision);

export default router;