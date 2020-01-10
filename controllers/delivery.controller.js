const Delivery = require("../models/delivery.model");

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

// Update a delivery using delivery_id
exports.findOneAndUpdate = (req, res) => {
  updateDelviery(req.params.delivery_id, req.body, (delivery, error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(delivery);
    }
  });
};

// Mark a delivery as completed using delivery_id
exports.findOneAndComplete = (req, res) => {
  updateDelviery(
    req.params.delivery_id,
    { status: "completed" },
    (delivery, error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(delivery);
      }
    }
  );
};

// Mark a delivery as visited using delivery_id
exports.findOneAndComplete = (req, res) => {
  updateDelviery(
    req.params.delivery_id,
    { status: "visited" },
    (delivery, error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(delivery);
      }
    }
  );
};

exports.updateDelviery = (delivery_id, body, callback) => {
  Delivery.findOneAndUpdate({ delivery_id }, body)
    .then(delivery => {
      if (callback) {
        callback(delivery);
      }
    })
    .catch(err => {
      if (callback) {
        callback(null, {
          message: `Some error occurred while updating delivery with id ${req.params.delivery_id}. Reason: ${err.message}`
        });
      }
    });
};
