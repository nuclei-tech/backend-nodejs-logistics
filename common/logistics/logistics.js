require("dotenv").config();
const request = require("request");
const _ = require("lodash");
const sampleDrivers = require("./drivers.json");
const sampleDeliveries = require("./deliveries.json");

const API_URL = `${process.env.BASE_URL || "http://localhost"}:${process.env
  .PORT || 8080}`;

function initLogisticsSamples() {
  // set up all sample drivers
  // note: ensure the sample JSON file has drivers with the correct device_id
  for (let i = 0; i < sampleDrivers.length; i++) {
    console.log(`Add sample driver "${sampleDrivers[i].driver_id}"...`);
    request({
      url: `${API_URL}/logistics/drivers`,
      method: "POST",
      json: sampleDrivers[i]
    });
  }

  // set up all sample deliveries
  for (let i = 0; i < sampleDeliveries.length; i++) {
    console.log(`Add sample delivery "${sampleDeliveries[i].delivery_id}"...`);
    request({
      url: `${API_URL}/logistics/deliveries`,
      method: "POST",
      json: sampleDeliveries[i]
    });
  }
}

module.exports = { initLogisticsSamples };
