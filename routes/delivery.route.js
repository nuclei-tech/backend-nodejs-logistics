module.exports = app => {
  const deliveries = require("../controllers/delivery.controller");

  // Retrieve all devices
  app.get("/logistics/deliveries", deliveries.findAll);

  // Retrieve a single delivery with delivery_id
  app.get("/logistics/deliveries/:delivery_id", deliveries.findOne);

  // Update a single delivery with delivery_id
  app.patch("/logistics/deliveries/:delivery_id", deliveries.findOneAndUpdate);

  // Mark a single delivery as complete with delivery_id
  app.get(
    "/logistics/deliveries/:delivery_id/complete",
    deliveries.findOneAndComplete
  );

  // Mark a single delivery as visited with delivery_id
  app.get(
    "/logistics/deliveries/:delivery_id/visit",
    deliveries.findOneAndVisit
  );
};
