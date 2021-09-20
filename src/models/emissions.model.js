module.exports = function (sequelize, Sequelize) {
    const Emission = sequelize.define("emission", {
      country_or_area: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      value: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      ids: {
        type: Sequelize.STRING,
        primaryKey: true,
      }
    },
    {
        timestamps: false,

        createdAt: false,
      
        updatedAt: false,
  
    });
  
    return Emission;
  };