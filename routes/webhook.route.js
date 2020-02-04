module.exports = app => {
  const webhook = require("../controllers/webhook.controller");
  const trip = require("../controllers/trip.controller");
  const pushNotification = require("../controllers/push-notification.controller");
  const {
    updateDelivery
  } = require("../controllers/logistics/delivery.controller");
  const _ = require("lodash");

  // Receive HyperTrack webhooks
  app.post("/hypertrack", async function(req, res) {
    /*
     * For Webhook verification, you should log the request body here
     * The reason is that the verification request is in XML, not JSON
     * You can comment this out after the verification is completed
     * Docs: https://docs.hypertrack.com/#guides-webhooks-setup-one-time-activation
     */
    // console.log(req.body);
    let webhookBody = JSON.parse(req.body);

    if (webhookBody) {
      for (let i = 0; i < webhookBody.length; i++) {
        let data = webhookBody[i];

        console.log(data);

        // ignore other versions for now
        if (data.version === "2.0.0") {
          res.io.emit(data.type, data);

          switch (data.type) {
            case "location":
              console.log("==== LOCATION UPDATE");
              webhook.addLocation(data);
              break;
            case "device_status":
              console.log("==== DEVICE UPDATE");
              webhook.addDeviceStatus(data);
              break;
            case "battery":
              console.log("==== BATTERY UPDATE");
              webhook.addBatteryStatus(data);
              break;
            case "trip":
              console.log("==== TRIP UPDATE");

              webhook.addTripStatus(data);

              if (_.get(data, "data.value", "") === "geofence_enter") {
                const delivery_id = _.get(
                  data,
                  "data.geofence_metadata.delivery_id",
                  ""
                );

                if (delivery_id) {
                  // add enteredAt timestamp to delivery
                  updateDelivery(delivery_id, {
                    enteredAt: _.get(data, "data.recorded_at", "")
                  });

                  // send delivery push notification to device
                  pushNotification.sendNotification(data.device_id, {
                    status: _.get(data, "data.value", ""),
                    enteredAt: _.get(data, "data.recorded_at", ""),
                    delivery_id,
                    label: _.get(data, "data.geofence_metadata.label", "")
                  });
                }
              }

              if (_.get(data, "data.value", "") === "geofence_exit") {
                const delivery_id = _.get(
                  data,
                  "data.geofence_metadata.delivery_id",
                  ""
                );

                if (delivery_id) {
                  // add exitedAt timestamp to delivery
                  updateDelivery(delivery_id, {
                    exitedAt: _.get(data, "data.recorded_at", "")
                  });

                  // send push notification to device
                  pushNotification.sendNotification(data.device_id, {
                    status: _.get(data, "data.value", ""),
                    exitedAt: _.get(data, "data.recorded_at", ""),
                    delivery_id,
                    label: _.get(data, "data.geofence_metadata.label", "")
                  });
                }
              }

              if (_.get(data, "data.value", "") === "created") {
                // get and store new trip
                trip.addWithId(data.data.trip_id);
              }

              if (_.get(data, "data.value", "") === "completed") {
                // update trip in MongoDB
                trip.updateTrip(data.data.trip_id, {
                  status: "completed",
                  summary: data.data.summary,
                  estimate: null,
                  completed_at: data.created_at
                });
              }
              break;
            default:
              break;
          }
        }
      }
    }

    res.sendStatus(200);
  });
};
