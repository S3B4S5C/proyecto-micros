import express from 'express'
import {designarTurno, registrarMicro, eliminarMicro, eliminarTurno} from '../controllers/microsController';
import { validateSchema } from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/authRequired.js'
import { operadorValidation } from '../middlewares/roleValidation.js'

const router = express.Router();

router.post("/turno/crear",
   authRequired, operadorValidation, designarTurno);
router.post("/micros/crear",authRequired, operadorValidation,registrarMicro);

router.post("/micros/eliminar/:id", 
   authRequired, operadorValidation, eliminarMicro);
router.post("/turno/eliminar/:id", authRequired, operadorValidation, eliminarTurno)

export default router;