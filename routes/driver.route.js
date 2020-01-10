module.exports = app => {
  const drivers = require("../controllers/driver.controller");

  // Retrieve all drivers
  app.get("/logistics/drivers", drivers.findAll);

  // Retrieve a single driver with driver_id
  app.get("/logistics/drivers/:driver_id", drivers.findOne);

  // Check in a single driver using driver_id
  app.get("/logistics/drivers/:driver_id/checkin", drivers.findOneAndCheckin);
};
