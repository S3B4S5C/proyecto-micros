import express from "express";

const router = express.Router();

import { getMensajes, GetLastMensajes } from "../controllers/mensajesController.js";

router.post("/", getMensajes);
router.post("/last", GetLastMensajes);

export default router;