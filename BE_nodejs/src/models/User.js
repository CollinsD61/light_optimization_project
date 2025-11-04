const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Có thể null cho Google OAuth users
    },
    // name field doesn't exist in current Django schema
    // name: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    isStaff: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_staff'
    },
    isSuperuser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_superuser'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    }
  }, {
    tableName: 'users_customuser',
    timestamps: false, // Django model doesn't have created_at/updated_at
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.prototype.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.PasswordResetToken, {
      foreignKey: 'userId',
      as: 'resetTokens'
    });
  };

  return User;
};

