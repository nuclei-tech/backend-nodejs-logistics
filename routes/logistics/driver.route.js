module.exports = app => {
  const drivers = require("../../controllers/logistics/driver.controller");

  // Retrieve all drivers
  app.get("/logistics/drivers", drivers.findAll);

  // Add a new driver
  app.post("/logistics/drivers", drivers.addOne);

  // Update an existing driver
  app.patch("/logistics/drivers", drivers.findOneAndUpdate);

  // Retrieve a single driver with driver_id
  app.get("/logistics/drivers/:driver_id", drivers.findOne);

  // Check in a single driver using driver_id
  app.post("/logistics/drivers/:driver_id/checkin", drivers.findOneAndCheckin);
};
