var mongoose = require("mongoose");

// Driver schema
const DriverSchema = new mongoose.Schema(
  {
    driver_id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    device_id: {
      type: String,
      required: true
    },
    active_trip: {
      type: String
    },
    token: {
      type: String
    },
    deliveries: {
      type: [Object]
    },
    updatedAt: {
      type: Date
    },
    createdAt: {
      type: Date
    }
  },
  {
    // enable timestamps
    timestamps: true,
    // set collection name
    collection: "Driver"
  }
);

// index driver_id
DriverSchema.index(
  {
    driver_id: 1
  },
  { unique: true }
);

module.exports = mongoose.model("Driver", DriverSchema);
