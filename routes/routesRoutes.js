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
import { validateSchema } from '../middlewares/validator.middleware.js'
import { paradaSchema, paradaProvisionalSchema } from '../schemas/route.schema.js';


const router = express.Router();

router.post("/sindicatos/crear", registrarSindicato);
router.post("/lineas/crear", registrarLinea);
router.post("/lineas", getLineas);

router.post("/crear", authRequired, operadorValidation, crearRuta);
router.post("/paradas/crear", validateSchema(paradaSchema),crearParada);
router.post(
  "/paradas/provisionales/crear",
  authRequired,
  operadorValidation,validateSchema(paradaProvisionalSchema),
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

router.post("", getRutas);
router.get("/:id_ruta", getRuta);
router.get("/paradas/:id_ruta", getParadas);
router.get("/paradas/provisionales/:id_parada", getParadasProvisionales);

export default router;
