const Sale = require('../models/Sale');
const Agent = require('../models/Agent');

// Registrar una venta con monto
exports.registerSale = async (req, res) => {
  try {
    const { agentId, amount } = req.body;
    if (!agentId || amount == null) {
      return res.status(400).json({ message: "agentId y amount son requeridos" });
    }
    const sale = new Sale({ agent: agentId, amount });
    await sale.save();

    const agent = await Agent.findById(agentId);
    if (agent) {
      agent.sales.daily += 1;
      agent.sales.weekly += 1;
      agent.sales.monthly += 1;
      agent.moneyMonthly = (agent.moneyMonthly || 0) + amount;
      await agent.save();
    }
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener las ventas de un agente para un mes específico
exports.getAgentSalesForMonth = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { month, year } = req.query;
    if (!agentId || !month || !year) {
      return res.status(400).json({ message: "agentId, month y year son requeridos" });
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const sales = await Sale.find({
      agent: agentId,
      date: { $gte: startDate, $lt: endDate }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restar una venta: se elimina la venta y se actualizan los contadores y dinero acumulado
exports.subtractSale = async (req, res) => {
  try {
    const { saleId } = req.body;
    if (!saleId) {
      return res.status(400).json({ message: "saleId es requerido" });
    }
    const sale = await Sale.findById(saleId);
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada' });
    const agentId = sale.agent;
    
    // Usamos deleteOne() en lugar de remove()
    await sale.deleteOne();

    const agent = await Agent.findById(agentId);
    if (!agent) return res.status(404).json({ message: 'Agente no encontrado' });
    agent.sales.daily = Math.max(0, agent.sales.daily - 1);
    agent.sales.weekly = Math.max(0, agent.sales.weekly - 1);
    agent.sales.monthly = Math.max(0, agent.sales.monthly - 1);
    agent.moneyMonthly = Math.max(0, (agent.moneyMonthly || 0) - sale.amount);
    await agent.save();
    res.status(200).json({ message: 'Venta restada exitosamente', agent });
  } catch (error) {
    console.error("Error en subtractSale:", error);
    res.status(500).json({ error: error.message });
  }
};



// Reiniciar contadores (si es monthly, también reinicia moneyMonthly)
exports.cleanCounters = async (req, res) => {
  try {
    const { period } = req.body;
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return res.status(400).json({ message: 'Periodo inválido' });
    }
    await Agent.updateMany({}, { $set: { [`sales.${period}`]: 0 } });
    if (period === 'monthly') {
      await Agent.updateMany({}, { $set: { moneyMonthly: 0 } });
    }
    res.json({ message: `Contadores ${period} reiniciados para todos los agentes.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
