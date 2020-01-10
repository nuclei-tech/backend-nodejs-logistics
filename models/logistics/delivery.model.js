var mongoose = require("mongoose");

// Delivery schema
const DeliverySchema = new mongoose.Schema(
  {
    delivery_id: {
      type: String,
      required: true
    },
    driver_id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: "pending"
    },
    label: {
      type: String,
      required: true
    },
    address: {
      street: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    customerNote: {
      type: String
    },
    deliveryNote: {
      type: String
    },
    deliveryPicture: {
      type: String
    },
    items: {
      type: [
        {
          item_id: {
            type: String,
            required: true
          },
          item_label: {
            type: String
          },
          item_sku: {
            type: String
          }
        }
      ],
      required: true
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
    collection: "Delivery"
  }
);

// index delivery_id
DeliverySchema.index(
  {
    delivery_id: 1
  },
  { unique: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
