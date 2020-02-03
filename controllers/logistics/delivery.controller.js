const aws = require("aws-sdk");
const uuidv4 = require("uuid/v4");
var mime = require("mime-types");
const Delivery = require("../../models/logistics/delivery.model");

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

// Update a delivery using delivery_id
exports.findOneAndUpdate = (req, res) => {
  this.updateDelviery(req.params.delivery_id, req.body, (delivery, error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(delivery);
    }
  });
};

exports.findOneAndUploadImage = (req, res) => {
  // upload to s3
  const s3 = new aws.S3({
    accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
    region: process.env.BUCKETEER_AWS_REGION
  });

  const s3Params = {
    Bucket: process.env.BUCKETEER_BUCKET_NAME,
    ContentType: req.headers["content-type"],
    ACL: "public-read",
    Body: req.body,
    Key: `${uuidv4()}.${mime.extension(req.headers["content-type"])}`
  };

  s3.upload(s3Params, function(s3Err, data) {
    if (s3Err) {
      console.log(`File uploaded failed: ${s3Err}`);

      res.status(500).send({
        status: "failed",
        reason: s3Err
      });
    } else {
      console.log(`File uploaded successfully at ${data.Location}`);

      res.status(201).send({
        status: "success",
        url: data.Location
      });
    }
  });

  // update delivery
};

// Mark a delivery as completed using delivery_id
exports.findOneAndComplete = (req, res) => {
  this.updateDelviery(
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
exports.findOneAndVisit = (req, res) => {
  this.updateDelviery(
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
  Delivery.findOneAndUpdate({ delivery_id }, body, { new: true })
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
