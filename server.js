const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos
app.use(express.static('public'));
app.use(express.static('views'));

// Conexión a MongoDB
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

// ===============================
//      TAREAS CRON PARA RESETEOS
// ===============================
const Agent = require('./models/Agent');

// 1) Reset diario: Cada día a las 00:00 se reinicia sales.daily a 0.
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando reset diario: Reiniciando ventas diarias...');
  try {
    await Agent.updateMany({}, { $set: { 'sales.daily': 0 } });
    console.log('Ventas diarias reseteadas con éxito');
  } catch (error) {
    console.error('Error en reset diario:', error);
  }
});

// 2) Reset semanal: Cada domingo a las 00:00 se reinicia sales.weekly a 0.
cron.schedule('0 0 * * 0', async () => {
  console.log('Ejecutando reset semanal: Reiniciando ventas semanales...');
  try {
    await Agent.updateMany({}, { $set: { 'sales.weekly': 0 } });
    console.log('Ventas semanales reseteadas con éxito');
  } catch (error) {
    console.error('Error en reset semanal:', error);
  }
});

// 3) Reset mensual: Cada primer día del mes a las 00:00 se reinician sales.monthly, moneyMonthly y target a 0.
cron.schedule('0 0 1 * *', async () => {
  console.log('Ejecutando reset mensual: Reiniciando ventas mensuales, moneyMonthly y target...');
  try {
    await Agent.updateMany({}, { 
      $set: { 
        'sales.monthly': 0,
        moneyMonthly: 0,
        target: 0
      }
    });
    console.log('Reset mensual completado con éxito');
  } catch (error) {
    console.error('Error en reset mensual:', error);
  }
});

// ===============================
//   Fin de TAREAS CRON
// ===============================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
