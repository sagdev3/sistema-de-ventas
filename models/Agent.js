const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  active: { type: Boolean, default: true },
  sales: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 }
  },
  target: { type: Number, default: 0 },         // Número de ventas mensuales esperadas
  moneyMonthly: { type: Number, default: 0 }      // Total de dinero acumulado en el mes
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);
