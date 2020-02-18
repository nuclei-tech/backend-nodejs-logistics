<a href="https://www.hypertrack.com/">
    <img src="https://www.hypertrack.com/green.eeca143346e01b96d600.svg" alt="HyperTrack logo" title="HyperTrack" align="right" height="40" />
</a>

# Logistics Backend (NodeJS)

![](https://img.shields.io/circleci/build/gh/hypertrack/backend-nodejs-logistics?style=flat-square)
![](https://img.shields.io/david/hypertrack/backend-nodejs-logistics?style=flat-square)
![](https://img.shields.io/github/license/hypertrack/backend-nodejs-logistics?style=flat-square)

A sample NodeJS/ExpressJS server integration with the HyperTrack platform. It consumes the HyperTrack APIs and Webhooks and exposes them through REST API endpoints and push notifications specifically for Logistics sample mobile apps ([iOS](https://github.com/hypertrack/logistics-ios)/[Android](https://github.com/hypertrack/logistics-android)).

## Features

- Store drivers and deliveries in MongoDB with Mongoose
- Receive HyperTrack Webhooks and test locally with [Localtunnel](https://github.com/localtunnel/localtunnel)
- Send mobile device push notifications to Google's GCM and Apple's APN on webhook arrival

## How to begin

### 1. Get your keys

- HyperTrack: [Signup](https://dashboard.hypertrack.com/signup) to get your [HyperTrack Publishable Key](https://dashboard.hypertrack.com/setup)
- Google: For the Firebase project you created in [the app setup](https://github.com/hypertrack/logistics-android-hidden#3-set-up-firebase), enable [Google Geocoding API](https://console.cloud.google.com/marketplace/details/google/geocoding-backend.googleapis.com) and [get the API Key](https://developers.google.com/maps/documentation/geocoding/get-api-key).

### 2. Get MongoDB

You need a MongoDB database for this project. To get one, you can either:

- Install MongoDB [locally](https://docs.mongodb.com/manual/installation/)
- Set up [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Set up a [Heroku account](https://signup.heroku.com/) and enable a [MongoDB add-on](https://elements.heroku.com/addons/mongolab)

### 3. Set up project

```shell
# Clone this repository
$ git clone https://github.com/hypertrack/backend-nodejs-logistics.git

# cd into the project directory
$ cd backend-nodejs-logistics

# Install with npm
npm install

# or install with Yarn
yarn
```

Next, you need to set your environmental variables. The project uses [dotenv](https://github.com/motdotla/dotenv), so it's best to copy the contents of the `.env.default` file in the root folder to a new `.env` file. This file is listed in `.gitignore` and shall not be checked into public repositories. Ensure to replace the keys with your own:

```shell
# HyperTrack
HT_ACCOUNT_ID = <YOUR_ACCOUNT_ID>
HT_SECRET_KEY = <YOUR_SECRET_KEY>

# Google Mamps
GMAPS_KEY = <YOUR_GMAPS_KEY>

# MongoDB connection URL
MONGODB_URI = <YOUR_MONGODB_URL>
```

With the dependencies and configuration in place, you can start the server in development mode:

```shell
# with npm
npm run dev

# or with Yarn
yarn dev
```

On startup, Localtunnel is used to generate a publicly accessible URL for your local server (`https://<unqiue_id>.localtunnel.me`). A new browser window will open with your unique, temporary domain. If successful, the browser window should show:

```text
HyperTrack Logistics Backend is RUNNING
```

### 4. Set up webhooks

[Follow the steps](https://docs.hypertrack.com/#guides-track-devices-with-the-api-stream-events-via-webhooks) to verify HyperTrack Webhooks and receive them in this project. By default, the server prints all webhook content to the console using `console.log(req.body)`. You should look for the verification webhook and open the `SubscribeURL` printed in the console to enable webhooks to come in.

### 5. Set up push notifications

In order to send push notifications from the backend, you need to configure APN and FCM keys within your `.env` file:

```shell
# Push Notifications
APN_CERT="<YOUR_P8_CONTENT_WITH_REPLACED_NEWLINES>" # iOS
APN_KEY_ID=<YOUR_KEY_ID> # iOS
APN_TEAM_ID=<YOUR_TEAM_ID> # iOS
FCM_KEY=<YOUR_FCM_KEY> # Android
```

> _Note_: For `APN_CERT`, you have to use multiline variables (replace all newlines with `\n` and double quotes around the string). [Read more here](https://stackoverflow.com/a/46161404)

### 6. Set up S3 storage

You need an Amazon S3 bucket to enable storage of delivery pictures. To get an S3 bucket, you can either:

- Set up [Amazon S3](https://aws.amazon.com/s3/)
- Set up a [Heroku account](https://signup.heroku.com/) and enable an [S3 add-on](https://elements.heroku.com/addons/bucketeer)

Finally, you should set varibales in your `.env` file to configure S3 file storage appropriately:

```shell
# Bucketeer
BUCKETEER_BUCKET_NAME=<YOUR_BUCKET_NAME>
BUCKETEER_AWS_SECRET_ACCESS_KEY=<YOUR_BUCKET_ACCESS_KEY>
BUCKETEER_AWS_REGION=<YOUR_REGION>
BUCKETEER_AWS_ACCESS_KEY_ID=<YOUR_BUCKET_ACCESS_KEY_ID>
```

## Deploying on Heroku

This project is set up to be deployed to Heroku within seconds. Create or log in to your existing Heroku account and click on the one-click-deploy button below. It will provide the following services and add-ons:

- Web Dyno - to run the server on Heroku
- NodeJS buildpack - to run NodeJS/ExpressJS on Heroku
- MongoLab - hosted MongoDB database
- PaperTrail - hosted logging system
- Bucketeer - S3 file hosting

Similar to the local setup, you need to have your keys ready before the deployment. The Heroku page will ask you for all the keys stored in your `.env` file.

**Deploy this project now on Heroku:**

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hypertrack/backend-nodejs-logistics)

## Usage

The project exposes data through REST API endpoints and push notifications and consumes data through REST APIs and Webhooks. Below is an explanation of each interface, setup steps, and usage details.

### REST API Endpoints

ExpressJS exposes API endpoints based on the routes defined in the _/route_ folder. Here is a breakdown of available routes, methods, and use cases.

> _Note_: All the endpoints below respond with data from the MongoDB database, not directly from the HyperTrack API.

| Route                              | Methods     | Use Cases                                                                                          |
| ---------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| /                                  | GET         | Status checking endpoint, returns plain text message                                               |
|                                    |
| /devices                           | GET         | Get all tracked [devices](https://docs.hypertrack.com/#api-devices)                                |
| /devices/{device_id}               | GET, DELETE | Get/delete device by device ID                                                                     |
| /devices/{device_id}/trips         | GET         | Get all [trips](https://docs.hypertrack.com/#api-trips) for specific device                        |
| /trips                             | GET, POST   | Get all or create new trip                                                                         |
| /trips/{trip_id}                   | GET, POST   | Get/update a trip by trip ID                                                                       |
| /device-places                     | GET         | Get all places for all devices                                                                     |
| /device-places/{device_id}         | GET         | Get all places for specific device                                                                 |
| /device-places/{device_id}/{label} | GET, POST   | Get/set specific place (by label) for specific device                                              |
|                                    |
| /device-status                     | GET, POST   | Get all or save new [device status update](https://docs.hypertrack.com/#device-status-payload)     |
| /device-status/{device_id}         | GET         | Get all device status updates for specific device                                                  |
| /device-status/{device_id}/last    | GET         | Get last device status update for specific device                                                  |
| /battery-status                    | GET, POST   | Get all or save new [battery status update](https://docs.hypertrack.com/#battery-payload)          |
| /battery-status/{device_id}        | GET         | Get all battery status updates for specific device                                                 |
| /battery-status/{device_id}/last   | GET         | Get last battery status update for specific device                                                 |
| /locations                         | GET, POST   | Get all or save new [location update](https://docs.hypertrack.com/#location-payload)               |
| /locations/{device_id}             | GET         | Get all location updates for specific device                                                       |
| /locations/{device_id}/last        | GET         | Get last location update for specific device                                                       |
| /trip-status                       | GET, POST   | Get all or save new [trip status update](https://docs.hypertrack.com/#trip-payload)                |
| /trip-status/{device_id}           | GET         | Get all trip status updates for specific trip                                                      |
| /trip-status/{device_id}/last      | GET         | Get last trip status update for specific trip                                                      |
|                                    |
| /device-push-info                  | GET         | Get all device push information (including token, platform, package name)                          |
| /device-push-info/{device_id}      | GET, DELETE | Get/delete device push information by device ID                                                    |
| /push-notifications                | POST        | Create a new push notification record                                                              |
|                                    |
| /hypertrack                        | POST        | Endpoint to receive [HyperTrack Webhooks](https://docs.hypertrack.com/#webhooks). Read more below. |

### Webhooks

<p align="center">
  <img src="static/sample-webhook.png" />
</p>

With the deployment of this project, you will have an endpoint listening to incoming webhooks. Depending on the deployment (local/Heroku/etc), your domain will change, but the available Webhook endpoint will end with `/hypertrack`. Here are samples of the full webhook URL that you will have to enter on the HyperTrack Dashboard:

- Heroku: `https://<heroku_app_name>.herokuapp.com/hypertrack`
- Localtunnel: `https://<alias>.localtunnel.me/hypertrack` (alias can be configured in the package.json)

All webhooks will be processed and stored to the MongoDB. Some updates might update other database records (e.g. battery status update reflected in device records). It is important to note that `destination_arrival` [trip webhooks](https://docs.hypertrack.com/#trip-payload) will trigger [trip completion API calls](https://docs.hypertrack.com/#complete-trip) two minutes after the webhook arrival. You can change this behavior by modifying the `routes/webhook.route.js` file.

> _Note_: You can look into the console logs to review all received webhooks. This also allows you to run through the one-time verification for HyperTrack Webhooks.

### Push Notifications

<p align="center">
  <img src="static/sample-iphone-notification.png" />
</p>

The project is capable of sending mobile push notifications triggered by webhooks from HyperTrack. By default, notifications are pushed only for the trip updates: `destination_arrival` and `geofence_enter`.

> _Note_: Push attempts will only be made when required environment variables are defined. [Read more here](#installation-and-setup)

Keep in mind that for push notifications to work properly, you have to manage push notification information (token, platform, package name associated with device ID) in your systems. To obtain this information, your mobile application has to be enabled for push notifications, store the push information, and make it accessible to this project.

Whenever one of the two relevant updates are received, the device ID is used to look up required push notification information. With a successful lookup, a new database record for the push notification attempt is created. Finally, the push notification is sent to the device [through Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging).

The notification payload is generated by the package [node-pushnotifications](https://github.com/appfeel/node-pushnotifications) based on the platform it identifies for the devices. Below are payload previews for iOS and Android.

<details><summary>iOS - Destination arrival</summary><p>

```json
{
  "priority": 5,
  "topic": "<pushInfo.app_name>",
  "alert": {
    "title": "Trip arrival",
    "body": "🔥 You just entered the trip destination!"
  },
  "contentAvailable": true,
  "payload": {
    "placeline": {
      "status": "destination_arrival",
      "trip": {
        "id": "<trip_id>",
        "metadata": "<trip_metadata>"
      }
    }
  }
}
```

</p>
</details>

<details><summary>Android - Destination arrival</summary><p>

```json
{
  "priority": "normal",
  "notification": {
    "title": "Trip arrival",
    "body": "🔥 You just entered the trip destination!"
  },
  "contentAvailable": true,
  "data": {
    "title": "Trip arrival",
    "body": "🔥 You just entered the trip destination!",
    "placeline": {
      "status": "destination_arrival",
      "trip": {
        "id": "<trip_id>",
        "metadata": "<trip_metadata>"
      }
    }
  }
}
```

</p>
</details>

<details><summary>iOS - Geofence enter</summary><p>

```json
{
  "priority": 5,
  "topic": "<pushInfo.app_name>",
  "alert": {
    "title": "Trip geofence enter",
    "body": "🔥 You just entered the trip geofence for <place_name>"
  },
  "contentAvailable": true,
  "payload": {
    "placeline": {
      "status": "geofence_enter",
      "trip": {
        "id": "<trip_id>",
        "metadata": "<trip_metadata>"
      },
      "geofence": {
        "metadata": "<geofence_metadata>"
      }
    }
  }
}
```

</p>
</details>

<details><summary>Android - Geofence enter</summary><p>

```json
{
  "priority": "normal",
  "notification": {
    "title": "Trip geofence enter",
    "body": "🔥 You just entered the trip geofence for <place_name>"
  },
  "contentAvailable": true,
  "data": {
    "title": "Trip geofence enter",
    "body": "🔥 You just entered the trip geofence for <place_name>",
    "placeline": {
      "status": "geofence_enter",
      "trip": {
        "id": "<trip_id>",
        "metadata": "<trip_metadata>"
      },
      "geofence": {
        "metadata": "<geofence_metadata>"
      }
    }
  }
}
```

</p>
</details>

## Documentation

For detailed documentation of the APIs, customizations and what all you can build using HyperTrack, please visit the official [docs](https://docs.hypertrack.com).

## Contribute

Feel free to clone, use, and contribute back via [pull requests](https://help.github.com/articles/about-pull-requests/). We'd love to see your pull requests - send them in! Please use the [issues tracker](https://github.com/hypertrack/backend-nodejs-logistics/issues) to raise bug reports and feature requests.

We are excited to see what live location feature you build in your app using this project. Do ping us at help@hypertrack.com once you build one, and we would love to feature your app on our blog!

## Support

Join our [Slack community](https://join.slack.com/t/hypertracksupport/shared_invite/enQtNDA0MDYxMzY1MDMxLTdmNDQ1ZDA1MTQxOTU2NTgwZTNiMzUyZDk0OThlMmJkNmE0ZGI2NGY2ZGRhYjY0Yzc0NTJlZWY2ZmE5ZTA2NjI) for instant responses. You can also email us at help@hypertrack.com.

## Credits

This project uses the following open-source packages:

- [body-parser](https://github.com/expressjs/body-parser): Node.js body parsing middleware
- [cors](https://expressjs.com/en/resources/middleware/cors.html): Node.js CORS middleware
- [dotenv](https://github.com/motdotla/dotenv): Load environment variables from .env files
- [express](https://expressjs.com/): Web framework for Node.js
- [localtunnel](https://github.com/localtunnel/localtunnel): Expose your localhost to the world for testing and sharing
- [mongoose](https://mongoosejs.com/): Mongodb object modeling for node.js
- [node-pushnotifications](https://github.com/appfeel/node-pushnotifications): Push notifications for GCM, APNS, MPNS, AMZ
- [nodemon](https://github.com/remy/nodemon): Monitor for any changes in your node.js application and automatically restart the server
- [request](https://github.com/request/request): Simplified HTTP client
- [socket.io](https://github.com/socketio/socket.io): Realtime application framework
