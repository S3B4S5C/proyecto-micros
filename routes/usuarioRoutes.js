import express from 'express'
import { updateUsuario, crearChofer, crearOperador, getChoferes, getChofer, getUsuario, eliminarChofer, crearDueño, eliminarDueño } from '../controllers/userController.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/authRequired.js'
import { operadorValidation } from '../middlewares/roleValidation.js'
import { choferSchema, operadorSchema, updateUsuarioSchema, } from '../schemas/user.schema.js'
import { registrarTelefono, updateContraseña } from '../controllers/sesionController.js'
const router = express.Router()

router.put('/update', authRequired, validateSchema(updateUsuarioSchema), updateUsuario)
router.post('/crearChofer', authRequired, operadorValidation, validateSchema(choferSchema), crearChofer)
router.post('/crearOperador',validateSchema(operadorSchema), crearOperador)
router.post('/crearDueño', operadorValidation, authRequired, crearDueño)
router.post('/choferes', authRequired, operadorValidation, getChoferes)
//router.post('/choferes/:usuario', authRequired, operadorValidation, getChofer)

router.post('/dueños/eliminar/:usuario', authRequired, operadorValidation, eliminarDueño)
router.post('/choferes/eliminar/:usuario', authRequired, operadorValidation, eliminarChofer)
router.get('/:usuario', getUsuario)
router.put('/actualizarPass', authRequired, updateContraseña)
router.post('/registrarTelefono', authRequired, registrarTelefono)

export default router