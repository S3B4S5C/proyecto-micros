import express from 'express'
import { updateUsuario, crearChofer, crearOperador, getChoferes, getChofer, getUsuario } from '../controllers/userController.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { registerSchema, loginSchema, choferSchema, operadorSchema, updateUsuarioSchema, } from '../schemas/user.schema.js'
const router = express.Router()

router.put('/update', validateSchema(updateUsuarioSchema), updateUsuario)
router.post('/crearChofer', validateSchema(choferSchema),crearChofer)
router.post('/crearOperador',validateSchema(operadorSchema), crearOperador)
router.get('/choferes', getChoferes)
router.get('/choferes:usuario', getChofer)
router.get('/:usuario', getUsuario)

export default router