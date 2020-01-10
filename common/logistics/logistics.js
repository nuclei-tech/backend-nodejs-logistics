require("dotenv").config();
const request = require("request");
const _ = require("lodash");
const sampleDrivers = require("./drivers.json");
const sampleDeliveries = require("./deliveries.json");

function initLogisticsSamples() {
  // set up all sample drivers
  // note: ensure the sample JSON file has drivers with the correct device_id
  for (let i = 0; i < sampleDrivers.length; i++) {
    request({
      url: "/drivers",
      method: "POST",
      json: sampleDrivers[i]
    });
  }

  // set up all sample deliveries
  for (let i = 0; i < sampleDeliveries.length; i++) {
    request({
      url: "/deliveries",
      method: "POST",
      json: sampleDeliveries[i]
    });
  }
}

module.exports = { initLogisticsSamples };
