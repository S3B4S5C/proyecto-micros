import express from 'express';
import cookieParser from 'cookie-parser';
import { login, logout, register } from './controllers/userController.js';
import usuarioRouter from './routes/usuarioRoutes.js';
import { authRequired } from './middlewares/authRequired.js';
const app = express();
const port = 3000


app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
  });

  
app.post('/login', login)
app.post('/register', register)
app.post('/logout', logout)
app.use('/usuarios', usuarioRouter)

app.get('/chilito', authRequired, (req, res) => {
  res.status(201).json({message: 'ruta protegida'})
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});