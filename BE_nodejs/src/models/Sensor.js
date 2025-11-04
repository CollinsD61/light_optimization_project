module.exports = (sequelize, DataTypes) => {
  const Sensor = sequelize.define('Sensor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'sensors_sensor',
    timestamps: true,
    underscored: true
  });

  Sensor.associate = (models) => {
    Sensor.hasMany(models.SensorData, {
      foreignKey: 'sensorId',
      as: 'dataPoints'
    });
  };

  return Sensor;
};

