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
import revisionRouter from "./routes/revisionRoutes.js";
import sancionesRouter from "./routes/sancionesRoutes.js";
import mensajesRouter from "./routes/mensajesRoutes.js";
import incidentesRouter from "./routes/incidentesRoutes.js";
import notificacionesRouter from "./routes/notificacionesRoutes.js";
import { operadorValidation } from "./middlewares/roleValidation.js";
import { authRequired } from "./middlewares/authRequired.js";
import { validateSchema } from "./middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "./schemas/user.schema.js";
import { newMensaje } from "./controllers/mensajesController.js";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);
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
      "https://transportescz.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
app.use("/revisionesTecnicas", revisionRouter);
app.use("/chat", mensajesRouter);
app.use("/incidentes", incidentesRouter);
app.use("/notificaciones", notificacionesRouter);
app.use("/comentarios", comentariosRouter);
//Sockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://7q577mvq-5173.brs.devtunnels.ms",
      "https://microsfrontend.vercel.app",
      "https://transportescz.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on("join-line", (lineaId) => {
    socket.join(`linea-${lineaId}`);
    console.log(`Usuario unido a la línea ${lineaId}`);
  });

  socket.on("enviar-mensaje", (data) => {
    const { emisor, contenido, id_linea } = data;
    newMensaje(id_linea, contenido, emisor);
    io.to(`linea-${id_linea}`).emit("nuevo-mensaje", data);
    console.log(`Mensaje enviado: ${contenido}`);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
