if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const app = express();
  
  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Servir archivos estáticos de 'public' y 'views'
  app.use(express.static('public'));
  app.use(express.static('views'));
  
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_ventas';
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));
  
  // Importar rutas
  const authRoutes = require('./routes/authRoutes');
  const agentRoutes = require('./routes/agentRoutes');
  const saleRoutes = require('./routes/saleRoutes');
  
  app.use('/auth', authRoutes);
  app.use('/agents', agentRoutes);
  app.use('/sales', saleRoutes);
  
  app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Ventas');
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  