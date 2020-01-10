const Driver = require("../../models/logistics/driver.model");

// TODO: Retrieve and return all drivers from the database.
exports.findAll = (req, res) => {
  Driver.find()
    .then(drivers => {
      //TODO: Add deliveries to driver objects
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

// TODO: Find a single driver with a driver_id
exports.findOne = (req, res) => {
  Driver.findOne({ driver_id: req.params.driver_id })
    .then(driver => {
      if (!driver) {
        return res.status(404).send({
          message: "Driver not found with id " + req.params.driver_id
        });
      }

      //TODO: Add deliveries to driver objects
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
  res.status(500).send("Not implemented");
};

// Update a driver using driver_id
exports.findOneAndUpdate = (req, res) => {
  updateDelviery(req.params.driver_id, req.body, (driver, error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(driver);
    }
  });
};
