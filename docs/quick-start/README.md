![quick-start-quote]

# Quick Start Guide

Polaris is easy to install and run. We encourage developers to install Polaris locally themselves - it is easy to navigate, start and stop. Before starting, let's ensure you have all the prerequisites installed.

You need the latest stable version of [Node]. If you are running macOS, you also need [Watchman]. Both are straightforward to install and do not need any special setup.

## Clone the Source Repository

Fork [Polaris] on GitHub. It is easier to maintain your own fork as we have designed Polaris to diverge. It is unlikely you will need to pull from the source repository again.

After you have your fork, clone a copy of it locally using the command:

```sh
git clone https://github.com/<your-fork>/polaris.git
```

## Install Dependencies

Change directory to the root folder of the project. Run the following command to install the dependencies for the frontend application:

```sh
npm install
```

To install server dependencies, run the command:

```sh
cd server && npm install
```

## Configure the Environment

Polaris uses `.env` files to configure Polaris packages. There are `.sample.env` files for each Polaris package documenting sample values that you can use in each `.env` file.

To generate a default set of `.env` files for all packages, run the following command in the root directory of the project:

```sh
npm run create:env
```

You can read more about configuring the environment in the [Developers] section of our documentation.

## Register for Open Banking

Polaris implements the [Open Banking][openbanking] standard.

To enable Polaris to fetch bank account details from your bank, you need to register with a bank and identity platform that supports open banking.

We recommend [ForgeRock]. After you register for a free trial, a certificate and a client ID is displayed. Enter these details into the `server/.env` file. Remember to also copy the certificate files into the `server` directory.

## Register for the Watson Assistant Chatbot

Polaris also includes a chatbot called [Watson Assistant][watson] to show how a conversation with your bank might look.

This step is optional - if you skip this step, the assistant does not respond, but Polaris still works.

After you sign up for a free account you will be on the assistant page. However, we need the base watson url, so go to the [IBM cloud dashboard][ibmdashboard] then click on the services link in the 'Resource summary' section and then click on the 'Assistant' link under the Services section.

You should be presented with the url and key, copy them into the `/server/.env` file (WATSON_ASSISTANT_URL & WATSON_API_KEY)

Now, click on 'Launch Assistant' and you should be returned to the assistant page you started on.

Next click the three dot menu icon to the far left of the 'My first assistant' section. click 'Settings' on the menu. On the Assistant settings page, select 'API details' on the left hand menu.

Copy the Assistant ID into WATSON_ASSISTANT_ID in the `/server/.env`

Watson is now setup, however it will only respond with 'I didn't understand. You can try rephrasing' In order
to build responses you will need to edit the Skill section on the assistant overview page.

## Run the Stack

You are now all set to run Polaris.

To start the server, run:

```sh
cd server && npm run build && npm start
```

To start the web version, open another terminal and from the project root directory run the command:

```sh
npm run start:web
```

This automatically opens an [Expo] console in your browser that displays the phase of the Polaris build process. When Expo finishes building Polaris, it automatically opens another tab running Polaris.

Congratulations! You are now running Polaris locally.

### Run Polaris on Native Devices

To run Polaris on native devices, scan the QR code displayed in the left panel of the [Expo] console.

### Run Polaris in Simulators

To run Polaris in simulators, install [XCode] and [Android Studio][androidstudio]. Then press the corresponding button in the left panel of the [Expo] console.

## Next Steps

- Deep dive into our documentation for [Developers].
- See our detailed [DevOps] documentation.

<!-- External Links -->

[expo]: https://expo.io/
[watchman]: https://facebook.github.io/watchman/docs/install
[polaris]: https://github.com/nearform/polaris
[node]: https://nodejs.org/en/
[forgerock]: https://www.forgerock.com/
[openbanking]: https://www.openbanking.org.uk/
[watson]: https://www.ibm.com/cloud/watson-assistant/
[ibmdashboard]: https://cloud.ibm.com/
[xcode]: https://docs.expo.io/versions/v33.0.0/introduction/installation/#ios-simulator
[androidstudio]: https://docs.expo.io/versions/v33.0.0/introduction/installation/#android-emulator

<!-- Internal Links -->

[devops]: devops/
[developers]: developers/

<!-- Images -->

[quick-start-quote]: ../img/quick-start-quote.svg
