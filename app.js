import express from "express";
import cookieParser from "cookie-parser";
import {
  login,
  logout,
  register,
  verifyToken,
} from "./controllers/sesionController.js";
import usuarioRouter from "./routes/usuarioRoutes.js";
import rutasRouter from "./routes/routesRoutes.js";
import turnosRouter from "./routes/turnosRoutes.js";
import microsRouter from "./routes/microsRoutes.js";
import mantenimientoRouter from "./routes/mantenimientoRoutes.js";
import sancionesRouter from "./routes/sancionesRoutes.js";
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
  res.send("Hi mom!");
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://7q577mvq-5173.brs.devtunnels.ms",
      "https://microsfrontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
``;

app.post("/login", validateSchema(loginSchema), login);
app.post("/register", validateSchema(registerSchema), register);
app.post("/logout", logout);
app.get("/verify", verifyToken);

app.use("/usuarios", usuarioRouter);

app.use("/rutas", rutasRouter);
app.use("/turnos", turnosRouter);
app.use("/micros", microsRouter);
app.use("/mantenimiento", mantenimientoRouter);
app.use("/sanciones", sancionesRouter);
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
