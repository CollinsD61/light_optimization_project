const db = require('../models');
const { Op } = require('sequelize');

// Get all sensors with pagination
const getSensors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Sensor.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      count,
      results: rows,
      next: page * limit < count ? page + 1 : null,
      previous: page > 1 ? page - 1 : null
    });
  } catch (error) {
    next(error);
  }
};

// Get single sensor
const getSensor = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const sensor = await db.Sensor.findByPk(id);
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    res.json(sensor);
  } catch (error) {
    next(error);
  }
};

// Create new sensor
const createSensor = async (req, res, next) => {
  try {
    const { name, description, location } = req.body;

    const sensor = await db.Sensor.create({
      name,
      description,
      location
    });

    res.status(201).json(sensor);
  } catch (error) {
    next(error);
  }
};

// Update sensor
const updateSensor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, location } = req.body;

    const sensor = await db.Sensor.findByPk(id);
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    await sensor.update({
      name: name !== undefined ? name : sensor.name,
      description: description !== undefined ? description : sensor.description,
      location: location !== undefined ? location : sensor.location
    });

    res.json(sensor);
  } catch (error) {
    next(error);
  }
};

// Delete sensor
const deleteSensor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sensor = await db.Sensor.findByPk(id);
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    await sensor.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSensors,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor
};

