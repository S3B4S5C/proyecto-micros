import express from "express";
import {  crearParada, crearParadaProvisional, crearRuta, deshabilitarParadaProvisional, eliminarParada, registrarLinea, registrarSindicato } from "../controllers/routesController.js";

const router = express.Router()

router.post('/sindicatos/crear', registrarSindicato)
router.post('/lineas/crear', registrarLinea)
router.post('/crear', crearRuta)
router.post('/paradas/crear', crearParada)
router.post('/paradas/provisionales/crear', crearParadaProvisional)
router.put('/paradas/provisionales/:id', deshabilitarParadaProvisional)
router.delete('/paradas/eliminar/:id', eliminarParada)

export default router