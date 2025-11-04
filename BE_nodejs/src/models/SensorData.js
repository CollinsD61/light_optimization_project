module.exports = (sequelize, DataTypes) => {
  const SensorData = sequelize.define('SensorData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sensorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sensor_id',
      references: {
        model: 'sensors_sensor',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    lightValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'light_value',
      // Add getter for frontend compatibility (snake_case)
      get() {
        return this.getDataValue('lightValue');
      }
    },
    // Virtual field for frontend compatibility
    light_value: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('lightValue');
      }
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'sensor_data_sensordata',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['sensor_id']
      },
      {
        fields: ['timestamp']
      }
    ]
  });

  SensorData.associate = (models) => {
    SensorData.belongsTo(models.Sensor, {
      foreignKey: 'sensorId',
      as: 'sensor'
    });
  };

  return SensorData;
};

