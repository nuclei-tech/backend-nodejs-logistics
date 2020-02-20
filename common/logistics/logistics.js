require("dotenv").config();
const sampleDrivers = require("./drivers.json");
const sampleDeliveries = require("./deliveries.json");

const Driver = require("../../models/logistics/driver.model");
const Delivery = require("../../models/logistics/delivery.model");

function initLogisticsSamples() {
  // set up all sample drivers
  // note: ensure the sample JSON file has drivers with the correct device_id
  for (let i = 0; i < sampleDrivers.length; i++) {
    console.log(`Add sample driver "${sampleDrivers[i].driver_id}"...`);
    Driver.create(sampleDrivers[i]);
  }

  // set up all sample deliveries
  for (let i = 0; i < sampleDeliveries.length; i++) {
    console.log(`Add sample delivery "${sampleDeliveries[i].delivery_id}"...`);
    Delivery.create(sampleDeliveries[i]);
  }
}

module.exports = { initLogisticsSamples };
