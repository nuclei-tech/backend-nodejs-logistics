const uuidv4 = require("uuid/v4");
var mime = require("mime-types");
const fs = require("fs");
const { completeTrip } = require("../../common/trips");
const Driver = require("../../models/logistics/driver.model");
const Delivery = require("../../models/logistics/delivery.model");
const pushNotification = require("../../controllers/push-notification.controller");

// Retrieve and return all deliveries from the database.
exports.findAll = (req, res) => {
  Delivery.find()
    .then(deliveries => {
      res.send(deliveries);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deliveries."
      });
    });
};

// Add a new delivery
exports.addOne = (req, res) => {
  Delivery.create(req.body)
    .then(() => {
      res.status(201).send("Delivery created successfully");
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error creating delivery: " + err
      });
    });
};

// Find a single delivery with a delivery_id
exports.findOne = (req, res) => {
  Delivery.findOne({ delivery_id: req.params.delivery_id })
    .then(delivery => {
      if (!delivery) {
        return res.status(404).send({
          message: "Delivery not found with id " + req.params.delivery_id
        });
      }
      res.send(delivery);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Delivery not found with id " + req.params.delivery_id
        });
      }
      return res.status(500).send({
        message: "Error retrieving delivery with id " + req.params.delivery_id
      });
    });
};

// Enter delivery location using delivery_id
exports.findOneAndEnter = (req, res) => {
  const enteredAt = new Date();
  // update DB record
  this.updateDelivery(
    req.params.delivery_id,
    {
      status: "visited",
      enteredAt,
      exitededAt: null
    },
    (delivery, error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        // send push notification
        pushNotification.addOne(
          {
            body: {
              driver_id: delivery.driver_id,
              payload: {
                status: "geofence_enter",
                enteredAt,
                delivery_id: req.params.delivery_id,
                label: "Test"
              }
            }
          },
          null
        );
        res.send(delivery);
      }
    }
  );
};

// Exit delivery location using delivery_id
exports.findOneAndExit = (req, res) => {
  const exitedAt = new Date();
  // update DB record
  this.updateDelivery(
    req.params.delivery_id,
    {
      exitedAt
    },
    (delivery, error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        // send push notification
        pushNotification.addOne(
          {
            body: {
              driver_id: delivery.driver_id,
              payload: {
                status: "geofence_exit",
                exitedAt,
                delivery_id: req.params.delivery_id,
                label: "Test"
              }
            }
          },
          null
        );
        res.send(delivery);
      }
    }
  );
};

// Update a delivery using delivery_id
exports.findOneAndUpdate = (req, res) => {
  this.updateDelivery(req.params.delivery_id, req.body, (delivery, error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(delivery);
    }
  });
};

exports.findOneAndUploadImage = (req, res) => {
  const baseURL = req.protocol + "://" + req.get("host");
  const fileName = `${__dirname}/public/${uuidv4()}.${mime.extension(
    req.headers["content-type"]
  )}`;

  var data = new Buffer(req.body);

  fs.writeFile(fileName, data, err => {
    if (err) {
      console.log("Error uploading file: ", err);
    } else {
      // update delivery
      this.updateDelivery(
        req.params.delivery_id,
        { deliveryPicture: `${baseURL}/${fileName}` },
        (delivery, error) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(delivery);
          }
        }
      );
    }
  });
};

// Mark a delivery as completed using delivery_id
exports.findOneAndComplete = (req, res) => {
  Delivery.findOneAndUpdate(
    { delivery_id: req.params.delivery_id },
    { status: "completed", completedAt: new Date() },
    { new: true }
  )
    .then(delivery => {
      // Uncomment to enable automcompletion of the trip on HyperTrack
      // this.checkTripCompletion(delivery.driver_id);
      res.send(delivery);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

exports.checkTripCompletion = driver_id => {
  // find all deliveries for driver
  Delivery.find({ driver_id })
    .then(async deliveries => {
      // check for incomplete delivery
      for (let i = 0; i < deliveries.length; i++) {
        const delivery = deliveries[i];
        if (delivery.status !== "completed") {
          // finish check, not all deliveries are completed
          return;
        }
      }

      // finished without exit, all trips are completed
      // lookup driver to find trip_id
      Driver.findOne({ driver_id })
        .then(async driver => {
          // complete trip
          await completeTrip(driver.active_trip);

          // update driver object, remove active trip
          await Driver.findOneAndUpdate(
            { driver_id },
            {
              active_trip: ""
            },
            {
              new: true
            }
          );
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
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deliveries."
      });
    });
};

exports.updateDelivery = (delivery_id, body, callback) => {
  Delivery.findOneAndUpdate({ delivery_id }, body, { new: true })
    .then(delivery => {
      if (callback) {
        callback(delivery);
      }
    })
    .catch(err => {
      if (callback) {
        callback(null, {
          message: `Some error occurred while updating delivery with id ${delivery_id}. Reason: ${err.message}`
        });
      }
    });
};
