var NodeGeocoder = require("node-geocoder");

const Driver = require("../../models/logistics/driver.model");
const Delivery = require("../../models/logistics/delivery.model");

// Retrieve and return all drivers from the database.
exports.findAll = (req, res) => {
  Driver.find()
    .then(async drivers => {
      // Add deliveries to driver objects
      for (let i = 0; i < drivers.length; i++) {
        const { driver_id } = drivers[i];
        const resp = await Delivery.find({ driver_id });
        if (resp) {
          drivers[i].deliveries = resp;
        }
      }

      res.send(drivers);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving drivers."
      });
    });
};

// Add a new driver
exports.addOne = (req, res) => {
  Driver.create(req.body)
    .then(() => {
      res.status(201).send("Driver created successfully");
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error creating driver: " + err
      });
    });
};

// Find a single driver with a driver_id
exports.findOne = (req, res) => {
  Driver.findOne({ driver_id: req.params.driver_id })
    .then(async driver => {
      if (!driver) {
        return res.status(404).send({
          message: "Driver not found with id " + req.params.driver_id
        });
      }

      // Add deliveries to driver
      const resp = await Delivery.find({ driver_id: driver.driver_id });
      if (resp) {
        driver.deliveries = resp;
      }

      res.send(driver);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Driver not found with id " + req.params.driver_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving driver with id " + req.params.driver_id
      });
    });
};

// TODO: Find a single driver with a driver_id and check in
exports.findOneAndCheckin = (req, res) => {
  const { body } = req;
  // verify token
  if (!body.token) {
    res.status(400).send("Error: A token is required to checkin");
  }

  Driver.findOne({ driver_id: req.params.driver_id })
    .then(async driver => {
      if (!driver) {
        return res.status(404).send({
          message: "Driver not found with id " + req.params.driver_id
        });
      }

      // verify device_id
      if (!driver.device_id) {
        res
          .status(400)
          .send("Error: A driver device_id is required to checkin");
      }

      // Add deliveries to driver
      const resp = await Delivery.find({
        driver_id: driver.driver_id
      });
      if (resp) {
        driver.deliveries = resp;

        // convert address to lat/lng for each trip
        const geocoder = NodeGeocoder({
          provider: "google",
          apiKey: process.env.GMAPS_KEY,
          formatter: null
        });

        for (let i = 0; i < resp.length; i++) {
          const delivery = resp[i];

          const geoResp = await geocoder.geocode({
            address: delivery.address.street,
            country: delivery.address.country,
            zipcode: delivery.address.postalCode
          });

          if (geoResp.length > 0) {
            delivery.lat = geoResp[0].latitude;
            delivery.lng = geoResp[0].longitude;
          }
        }

        console.log(resp);
        // create trip
      }

      // update active_trip and token
      driver.token = body.token;

      res.send(driver);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Driver not found with id " + req.params.driver_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving driver with id " + req.params.driver_id
      });
    });
};

// Update a driver using driver_id
exports.findOneAndUpdate = (req, res) => {
  this.updateDriver(req.params.driver_id, req.body, (driver, error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(driver);
    }
  });
};

exports.updateDriver = (driver_id, body, callback) => {
  Driver.findOneAndUpdate({ driver_id }, body)
    .then(driver => {
      if (callback) {
        callback(driver);
      }
    })
    .catch(err => {
      if (callback) {
        callback(null, {
          message: `Some error occurred while updating driver with id ${req.params.delivery_id}. Reason: ${err.message}`
        });
      }
    });
};
