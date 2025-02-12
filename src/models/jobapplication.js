const Sequelize = require('sequelize');
const db = require('../config/db_config');

const JobApplication = db.define('job_applications', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicantName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    applicantEmail: {
      type: Sequelize.STRING,
      allowNull: false
    },
    resumeURL: {
      type: Sequelize.STRING,
      allowNull: true
    },
    applicationStatus: {
      type: Sequelize.ENUM("Pending", "Under Review", "Accepted", "Rejected", "Withdrawn"),
      defaultValue: "Pending"
    },
    appliedDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    jobOpeningId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "job_openings",
        key: "id"
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

module.exports = JobApplication;