<a href="https://www.hypertrack.com/">
    <img src="https://hypertrack-blog-img.s3-us-west-2.amazonaws.com/Green0svg.svg" alt="HyperTrack logo" title="HyperTrack" align="right" height="40" />
</a>

# Logistics Backend (NodeJS)

![](https://img.shields.io/circleci/build/gh/hypertrack/backend-nodejs-logistics?style=flat-square)
![](https://img.shields.io/david/hypertrack/backend-nodejs-logistics?style=flat-square)
![](https://img.shields.io/github/license/hypertrack/backend-nodejs-logistics?style=flat-square)

A sample NodeJS/ExpressJS server integration with the HyperTrack platform. It consumes HyperTrack APIs and Webhooks and exposes them through REST API endpoints and push notifications specifically for Logistics sample mobile apps ([iOS](https://github.com/hypertrack/logistics-ios)/[Android](https://github.com/hypertrack/logistics-android)).

## Features

- Store drivers and deliveries in MongoDB with Mongoose
- Receive HyperTrack Webhooks and test locally with [Localtunnel](https://github.com/localtunnel/localtunnel)
- Send mobile device push notifications to Google's GCM and Apple's APN on webhook arrival

## How to begin

### 1. Get your keys

- HyperTrack: [Signup](https://dashboard.hypertrack.com/signup) to get your [HyperTrack Publishable Key](https://dashboard.hypertrack.com/setup)

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

[Follow the steps](https://docs.hypertrack.com/#guides-track-devices-with-the-api-stream-events-via-webhooks) to verify HyperTrack Webhooks and receive them in this project.. The webhook receiver endpoint is `/hypertrack`, so your Webhook URL should be:

```shell
# unique id can be configured in the package.json
https://<unqiue_id>.localtunnel.me/hypertrack
```

By default, the server prints all webhook content to the console using `console.log(req.body)`. You should look for the verification webhook and open the `SubscribeURL` printed in the console to enable webhooks to come in.

### 5. Set up push notifications

The project is capable of sending mobile push notifications triggered by webhooks from HyperTrack. In order to send push notifications from the backend, you need to configure APN and FCM keys within your `.env` file:

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

## How to deploy on Heroku

This project is set up to be deployed to Heroku within seconds. Create or log in to your existing Heroku account and click on the one-click-deploy button below. It will provide the following services and add-ons:

- Web Dyno - to run the server on Heroku
- NodeJS buildpack - to run NodeJS/ExpressJS on Heroku
- MongoLab - hosted MongoDB database
- PaperTrail - hosted logging system
- Bucketeer - S3 file hosting

Similar to the local setup, you need to have your keys ready before the deployment. The Heroku page will ask you for all the keys stored in your `.env` file.

**Deploy this project now on Heroku:**

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hypertrack/backend-nodejs-logistics)

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
