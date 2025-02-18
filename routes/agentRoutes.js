const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Obtener todos los agentes activos
router.get('/', agentController.getAgents);

// Crear un nuevo agente (se esperan los campos: name, email y target)
router.post('/', agentController.createAgent);

// Actualizar un agente (editar nombre, email y target)
router.put('/:id', agentController.updateAgent);

// Eliminar (marcar como inactivo) un agente
router.delete('/:id', agentController.deleteAgent);

module.exports = router;
