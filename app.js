import express from "express";
import cookieParser from "cookie-parser";
import {
  login,
  logout,
  register,
  registrarTelefono,
  verifyToken,
} from "./controllers/sesionController.js";
import usuarioRouter from "./routes/usuarioRoutes.js";
import rutasRouter from "./routes/routesRoutes.js";
import { operadorValidation } from "./middlewares/roleValidation.js";
import { authRequired } from "./middlewares/authRequired.js";
import { validateSchema } from "./middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "./schemas/user.schema.js";
import cors from "cors";

const app = express();

const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/login", validateSchema(loginSchema), login);
app.post("/register", validateSchema(registerSchema), register);
app.post("/logout", logout);

app.use("/usuarios", usuarioRouter);
app.get("/verify", verifyToken);

app.use("/rutas", rutasRouter);

app.get("/chilito", authRequired, operadorValidation, (req, res) => {
  res.status(201).json({ message: "ruta protegida" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
