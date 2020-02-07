module.exports = app => {
  const deliveries = require("../../controllers/logistics/delivery.controller");

  // Retrieve all deliveries
  app.get("/logistics/deliveries", deliveries.findAll);

  // Add a new delivery
  app.post("/logistics/deliveries", deliveries.addOne);

  // Retrieve a single delivery with delivery_id
  app.get("/logistics/deliveries/:delivery_id", deliveries.findOne);

  // Update a single delivery with delivery_id
  app.patch("/logistics/deliveries/:delivery_id", deliveries.findOneAndUpdate);

  // Upload an image with delivery_id
  app.post(
    "/logistics/deliveries/:delivery_id/image",
    deliveries.findOneAndUploadImage
  );

  // Mark a single delivery as complete with delivery_id
  app.get(
    "/logistics/deliveries/:delivery_id/complete",
    deliveries.findOneAndComplete
  );
};
