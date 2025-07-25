'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // yahan message column ko remove karenge
    await queryInterface.removeColumn('users', 'message');
  },

  async down (queryInterface, Sequelize) {
    // agar migration ko rollback karoge to column dobara add ho jaye
    await queryInterface.addColumn('users', 'message', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
