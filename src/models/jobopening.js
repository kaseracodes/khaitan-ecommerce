const Sequelize = require('sequelize');
const db = require('../config/db_config');

const JobOpening = db.define('job_openings', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    location: {
      type: Sequelize.STRING,
      defaultValue: "Remote"
    },
    employmentType: {
      type: Sequelize.ENUM("Full-Time", "Part-Time", "Internship", "Contract", "Apprenticeship"),
      allowNull: false
    },
    department: {
      type: Sequelize.STRING,
      allowNull: true
    },
    salaryRange: {
      type: Sequelize.STRING,
      allowNull: true
    },
    openings: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  });

module.exports = JobOpening;