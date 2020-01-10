module.exports = app => {
  const drivers = require("../../controllers/logistics/driver.controller");

  // Retrieve all drivers
  app.get("/logistics/drivers", drivers.findAll);

  // Add a new device status update
  app.post("/logistics/drivers", drivers.addOne);

  // Retrieve a single driver with driver_id
  app.get("/logistics/drivers/:driver_id", drivers.findOne);

  // Check in a single driver using driver_id
  app.get("/logistics/drivers/:driver_id/checkin", drivers.findOneAndCheckin);
};
