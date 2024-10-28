import express from 'express'
import {designarTurno, registrarMicro, eliminarMicro, eliminarTurno} from '../controllers/microsController';
import { validateSchema } from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/authRequired.js'
import { operadorValidation } from '../middlewares/roleValidation.js'
import {microSchema, horarioSchema} from '../schemas/micro.schema.js'

const router = express.Router();

router.post("/turno/crear", validateSchema(microSchema), authRequired, operadorValidation, designarTurno);
router.post("/micros/crear", validateSchema(horarioSchema),  authRequired, operadorValidation,registrarMicro);

router.post("/micros/eliminar/:id", 
   authRequired, operadorValidation, eliminarMicro);
router.post("/turno/eliminar/:id", authRequired, operadorValidation, eliminarTurno)

export default router;