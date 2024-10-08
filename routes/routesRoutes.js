import express from "express";
import {
  crearParada,
  crearParadaProvisional,
  crearRuta,
  deshabilitarParadaProvisional,
  eliminarParada,
  getLineas,
  getParadas,
  getParadasProvisionales,
  getRuta,
  getRutas,
  registrarLinea,
  registrarSindicato,
} from "../controllers/routesController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { operadorValidation } from "../middlewares/roleValidation.js";

const router = express.Router();

router.post("/sindicatos/crear", registrarSindicato);
router.post("/lineas/crear", registrarLinea);
router.get("/lineas", getLineas);

router.post("/crear", authRequired, operadorValidation, crearRuta);
router.post("/paradas/crear", crearParada);
router.post(
  "/paradas/provisionales/crear",
  authRequired,
  operadorValidation,
  crearParadaProvisional,
);
router.put(
  "/paradas/provisionales/:id",
  authRequired,
  operadorValidation,
  deshabilitarParadaProvisional,
);
router.delete(
  "/paradas/eliminar/:id",
  authRequired,
  operadorValidation,
  eliminarParada,
);

router.get("", getRutas);
router.get("/:id_ruta", getRuta);
router.get("/paradas/:id_ruta", getParadas);
router.get("/paradas/provisionales/:id_parada", getParadasProvisionales);

export default router;
