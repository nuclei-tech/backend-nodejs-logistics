<a href="https://www.hypertrack.com/">
    <img src="https://hypertrack-blog-img.s3-us-west-2.amazonaws.com/Green0svg.svg" alt="HyperTrack logo" title="HyperTrack" align="right" height="40" />
</a>

# Logistics Backend (NodeJS)

![](https://img.shields.io/circleci/build/gh/hypertrack/backend-nodejs-logistics?style=flat-square)
![](https://img.shields.io/david/hypertrack/backend-nodejs-logistics?style=flat-square)
![](https://img.shields.io/github/license/hypertrack/backend-nodejs-logistics?style=flat-square)

A sample NodeJS/ExpressJS server integration with the HyperTrack platform. It consumes HyperTrack APIs and Webhooks and exposes them through REST API endpoints and push notifications specifically for Logistics sample mobile apps ([iOS](https://github.com/hypertrack/logistics-ios)/[Android](https://github.com/hypertrack/logistics-android)).

## Features

- Store drivers and deliveries in MongoDB
- Receive HyperTrack Webhooks
- Send mobile device push notifications on webhook arrival

# How to deploy on Heroku

### 1. Get your keys

- HyperTrack: [Signup](https://dashboard.hypertrack.com/signup) to get your [HyperTrack Publishable Key](https://dashboard.hypertrack.com/setup)
- For iOS push notifications, [Apple Push Notification service keys](https://github.com/hypertrack/quickstart-ios#setup-silent-push-notifications)
- For Android push notifications, [Firebase Cloud Messaging keys](https://github.com/hypertrack/quickstart-android#set-up-silent-push-notifications)

### 2. Use Heroku One-Click Deploy

This project is set up to be deployed to Heroku within seconds. Create or log in to your existing Heroku account and click on the one-click-deploy button below. It will provide the following services and add-ons:

- Web Dyno - to run the server on Heroku
- NodeJS buildpack - to run NodeJS/ExpressJS on Heroku
- MongoLab - hosted MongoDB database
- PaperTrail - hosted logging system

You need to have your keys ready for the deployment. The Heroku page will ask you for all these keys:
- HyperTrack:
    - HT_ACCOUNT_ID = HyperTrack Account ID
    - HT_SECRET_KEY = HyperTrack Secret Key
- Push Notifications:
    - APN_CERT: (iOS) APN certification (p9 file content)
    - APN_KEY_ID: (iOS) APN Key ID
    - APN_TEAM_ID: (iOS) APN Team ID
    - FCM_KEY: (Android) FCN Key

**Deploy this project now on Heroku:**

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hypertrack/backend-nodejs-logistics)

As soon as the deployment is completed, you can view the app and within a new browser window you should see a confirmation to indicate that your backend is up and running successfully:
```text
HyperTrack Logistics Backend is RUNNING
```

### 3. Set up webhooks

[Follow the steps](https://docs.hypertrack.com/#guides-track-devices-with-the-api-stream-events-via-webhooks) to verify HyperTrack Webhooks and receive them in this project. The webhook receiver endpoint is `/hypertrack`, so your Webhook URL should be:

```shell
# app name you entered on the deployment screen
https://<your_heroku_app_name>.herokuapp.com/hypertrack
```

By default, the server prints all webhook content to the console using `console.log(req.body)`. You should look for the verification webhook and open the `SubscribeURL` printed in the console to enable webhooks to come in.

## Documentation

For detailed documentation of the APIs, customizations and what all you can build using HyperTrack, please visit the official [docs](https://docs.hypertrack.com).

## Contribute

Feel free to clone, use, and contribute back via [pull requests](https://help.github.com/articles/about-pull-requests/). We'd love to see your pull requests - send them in! Please use the [issues tracker](https://github.com/hypertrack/backend-nodejs-logistics/issues) to raise bug reports and feature requests.

We are excited to see what live location feature you build in your app using this project. Do ping us at help@hypertrack.com once you build one, and we would love to feature your app on our blog!

## Support

Join our [Slack community](https://join.slack.com/t/hypertracksupport/shared_invite/enQtNDA0MDYxMzY1MDMxLTdmNDQ1ZDA1MTQxOTU2NTgwZTNiMzUyZDk0OThlMmJkNmE0ZGI2NGY2ZGRhYjY0Yzc0NTJlZWY2ZmE5ZTA2NjI) for instant responses. You can also email us at help@hypertrack.com.
