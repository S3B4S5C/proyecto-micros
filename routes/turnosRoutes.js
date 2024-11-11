import express from 'express'

const router = express.Router();

import {designarTurno, finalizarTurno, getTurnosActivos, getCargaHorariaChofer} from '../controllers/turnosController.js';
import { validateSchema } from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/authRequired.js'
import { operadorValidation } from '../middlewares/roleValidation.js'
//import { microSchema } from '../schemas/turnos.schema.js'

router.post("/iniciar", authRequired, operadorValidation, designarTurno);
router.post("/finalizar", authRequired, operadorValidation, finalizarTurno);
router.post("/", authRequired, operadorValidation, getTurnosActivos);
router.post("/cargaChofer", authRequired, operadorValidation, getCargaHorariaChofer)
export default router;