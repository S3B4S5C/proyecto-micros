import express from 'express'
import { updateUsuario, crearChofer, crearOperador } from '../controllers/userController.js'

const router = express.Router()

router.put('/update', updateUsuario)
router.post('/crearChofer', crearChofer)
router.post('/crearOperador', crearOperador)

export default router