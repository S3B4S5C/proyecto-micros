import express from 'express';

const app = express();
const port = 3000

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
  });
  
  // Inicia el servidor
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });