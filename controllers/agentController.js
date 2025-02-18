const Agent = require('../models/Agent');

// Crear agente (se esperan los campos: name, email y target)
exports.createAgent = async (req, res) => {
  try {
    const agent = new Agent(req.body);
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar agentes activos
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ active: true });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar agente (editar nombre, email y target)
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!agent) return res.status(404).json({ message: 'Agente no encontrado' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar agente (marcar como inactivo)
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!agent) return res.status(404).json({ message: 'Agente no encontrado' });
    res.json({ message: 'Agente marcado como inactivo', agent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
