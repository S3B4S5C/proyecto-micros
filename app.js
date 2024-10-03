import express from 'express';
import { login } from './controllers/login.js';
const app = express();
const port = 3000


app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
  });
  
app.post('/login', login)

  // Inicia el servidor
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });