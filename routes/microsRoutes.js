import express from 'express'
import { registrarMicro, eliminarMicro, setEstado, getMicrosPorLineaConEstado} from '../controllers/microsController.js';
import { validateSchema } from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/authRequired.js'
import { operadorValidation } from '../middlewares/roleValidation.js'
import {microSchema, horarioSchema} from '../schemas/micro.schema.js'

const router = express.Router();

router.post("/crear",  authRequired, operadorValidation,registrarMicro);

router.post("/eliminar/:id", 
   authRequired, operadorValidation, eliminarMicro);

router.post("/agregarEstado", authRequired, operadorValidation, setEstado)
router.post("/", authRequired, operadorValidation, getMicrosPorLineaConEstado)
export default router;