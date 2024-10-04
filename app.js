import express from 'express';
import { login, register } from './controllers/userController.js';
const app = express();
const port = 3000


app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
  });
  
app.post('/login', login)

app.post('/register', register)

  // Inicia el servidor
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });