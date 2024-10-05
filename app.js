import express from 'express';
import cookieParser from 'cookie-parser';
import { login, logout, register } from './controllers/userController.js';
import usuarioRouter from './routes/usuarioRoutes.js';
import rutasRouter from './routes/routesRoutes.js'
import { operadorValidation } from './middlewares/roleValidation.js';
import { authRequired } from './middlewares/authRequired.js';
import { validateSchema } from './middlewares/validator.middleware.js';
import { loginSchema, registerSchema } from './schemas/user.schema.js';


const app = express();

const port = 3000


app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
  });

  
app.post('/login', validateSchema(loginSchema), login)
app.post('/register', validateSchema(registerSchema), register)
app.post('/logout', logout)

app.use('/usuarios', usuarioRouter)
app.use('/rutas', rutasRouter)

app.get('/chilito', authRequired, operadorValidation, (req, res) => {
  res.status(201).json({message: 'ruta protegida'})
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});