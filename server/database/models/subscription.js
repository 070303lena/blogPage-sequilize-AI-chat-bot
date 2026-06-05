module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      stripeSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },

      priceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      currentPeriodStart: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      currentPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      cancelAtPeriodEnd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Subscriptions",
      timestamps: true,
    }
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Subscription;
};