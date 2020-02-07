const PushService = require("node-pushnotifications");
const gcm = require("node-gcm");
const _ = require("lodash");

const PushNotification = require("../models/push-notification.model");
const pushInfo = require("../models/device-push-info.model");
const Driver = require("../models/driver.model");

// Init with push settings
const push = new PushService({
  gcm: {
    id: process.env.FCM_KEY
  },
  apn: {
    token: {
      key: process.env.APN_CERT,
      keyId: process.env.APN_KEY_ID,
      teamId: process.env.APN_TEAM_ID
    },
    production: process.env.NODE_ENV === "production",
    isAlwaysUseFCM: true
  }
});

const pushFCM = new gcm.Sender(process.env.FCM_KEY);

exports.sendNotification = (device_id, payload, res) => {
  // continue only if all keys are set
  if (
    !process.env.FCM_KEY ||
    !process.env.APN_CERT ||
    !process.env.APN_KEY_ID ||
    !process.env.APN_TEAM_ID
  ) {
    if (res) {
      res.status(500).send({
        message: `Push notifications are not configured on the backend`
      });
    }

    return;
  }

  // lookup device push first
  pushInfo.findOne({ device_id }).then(pushInfo => {
    if (pushInfo) {
      // set body and title based on status
      let body = "";
      let title = "";

      if (payload.status === "geofence_enter") {
        body = `You are close to ${payload.label} (#${payload.delivery_id}). Open and edit delivery details now.`;
        title = "Approaching pending delivery";
      }

      if (payload.status === "geofence_exit") {
        body = `Delviery ${payload.label} (#${payload.delivery_id}) was marked as visited`;
        title = "Visited pending delivery";
      }

      // store notification record
      PushNotification.create({ ids: device_id, payload })
        .then(() => {
          // send push notification
          // silent: with 'normal' priority and no sound, badge or alert
          if (pushInfo.platform === "android") {
            // Android cannot have notification and data at the same time, using GCM to overcome
            // more details: https://wajahatkarim.com/2018/05/firebase-notifications-in-background--foreground-in-android/
            const message = new gcm.Message({
              data: {
                priority: "high",
                contentAvailable: true,
                title,
                message: body,
                ...payload
              }
            });
            pushFCM.send(
              message,
              {
                registrationTokens: [pushInfo.push_token]
              },
              function(err, response) {
                res.status(201).send({ err, response });
              }
            );
          } else {
            push.setOptions({
              production: payload.production
                ? payload.production
                : process.env.NODE_ENV === "production"
            });

            push
              .send([pushInfo.push_token], {
                title, // REQUIRED for Android
                topic: pushInfo.app_name, // REQUIRED for iOS
                body,
                contentAvailable: true,
                custom: payload,
                category: payload.status,
                alert: {
                  title,
                  body
                },
                sound: "default"
              })
              .then(results => {
                if (res) {
                  res.status(201).send(results);
                }

                const util = require("util");
                console.log(
                  util.inspect(results, false, null, true /* enable colors */)
                );
              });
          }
        })
        .catch(err => {
          if (res) {
            return res.status(500).send({
              message: `Error creating push notification: ${err}`
            });
          }
          console.log(`Error creating push notification: ${err}`);
        });
    } else {
      return res.status(500).send({
        message: `Error: Couldn't find push information for device id`
      });
    }
  });
};

exports.addOne = (req, res) => {
  let device_id = req.body.ids;

  if (!device_id) {
    const { driver_id } = req.body;

    Driver.findOne({ driver_id })
      .then(async driver => {
        if (!driver) {
          return res.status(404).send({
            message: "Driver not found with id " + req.params.driver_id
          });
        }
        this.sendNotification(driver.device_id, req.body.payload, res);
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
  } else {
    this.sendNotification(device_id, req.body.payload, res);
  }
};
