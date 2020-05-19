# Polaris Bank

An example application showcasing "The Next generation internet banking solution". This example application is used to show customers an example of how React Native, and React can be combined to create highly cross compatible applications over multiple channels.

## Demo

A demo of Polaris can be found at [polarisbank.nearform.com][polaris-nearform]

## Quick Start Guide

Polaris is easy to install and run. We encourage developers to install Polaris locally themselves - it is easy to navigate, start and stop. Before starting, let's ensure you have all the prerequisites installed.

### Clone the Source Repository

Fork Polaris on GitHub. It is easier to maintain your own fork as we have designed Polaris to diverge. It is unlikely you will need to pull from the source repository again.

After you have your fork, clone a copy of it locally using the command:

    git clone https://github.com/<your-fork>/polaris.git

### Install Dependencies

Change directory to the root folder of the project. Run the following command to install the dependencies for the frontend application:

    npm install

To install server dependencies, run the command:

    cd server && npm install

### Configure the Environment

Polaris uses `.env` files to configure Polaris packages. There are `.sample.env` files for each Polaris package documenting sample values that you can use in each `.env` file.

To generate a default set of .env files for all packages, run the following command in the root directory of the project:

    npm run create:env

### Register for Open Banking

Polaris implements the [Open Banking][openbanking] standard.

To enable Polaris to fetch bank account details from your bank, you need to register with a bank and identity platform that supports open banking.

The easiest way to set this up for demonstration purposes is to contact us for some IBM credentials. These need entering into the `server.env` for IBM_CLIENT_ID, IBM_CLIENT_SECRET, IBM_CONNECTION_URL and IBM_OB_URL

### Register for the Watson Assistant Chatbot

Polaris also includes a chatbot called [Watson Assistant][watson] to show how a conversation with your bank might look.

This step is optional - if you skip this step, the assistant does not respond, but Polaris still works.

After you sign up for a [free account][ibmdashboard] you will be on the assistant page. However, we need the base watson url, so go to the [IBM cloud dashboard][ibmdashboard] then click on the services link in the 'Resource summary' section and then click on the 'Assistant' link under the Services section.

You should be presented with the url and key, copy them into the `/server/.env` file (WATSON_ASSISTANT_URL & WATSON_API_KEY)

Now, click on 'Launch Assistant' and you should be returned to the assistant page you started on.

Next click the three dot menu icon to the far left of the 'My first assistant' section. click 'Settings' on the menu. On the Assistant settings page, select 'API details' on the left hand menu.

Copy the Assistant ID into WATSON_ASSISTANT_ID in the `/server/.env`

Watson is now setup, however it will only respond with 'I didn't understand. You can try rephrasing' In order to build responses you will need to edit the Skill section on the assistant overview page.

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

To run Polaris on native devices, install the Expo app (Expo Client on the App Store or Expo on Play Store) and use that to scan the QR code displayed in the left panel of the [Expo] console.

## Exploring the app

The home page utilises mock data for demonstration purposes.

Connection to a real open bank account is [demonstrated in this video](https://www.youtube.com/watch?v=5Dj_zaKmbVM)

To enable Polaris to run locally whilst connecting to a real Open Banking app follow the following steps:

### Environment

Before running the application you'll need to ensure your environment variables are in order.

For the frontend use the defaults in the sample file other than `REACT_APP_UI_BASE`, change that to `http://polarisbank.com:3000`. This is an alias to your local machine that is used in the backend config as a callback url. Add the following entry to your host file `127.0.0.1 polarisbank.com`.

For the backend environment variables you'll need to source the appropriate open banking and IBM credentials.

Restart the server and the client as per the instructions above.

Once you have both applications running there's a final step to allow the service worker to run on an unsecured domain (the polarisbank.com alias). In Chrome open the page [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure), add an entry for `http://polarisbank.com:3000`, toggle the flag from disabled to enabled and restart Chrome.

![insecure-origins]

If you are using Firefox, open [settings](about:options). Then set both `dom.webnotifications.allowinsecure` and `dom.serviceWorkers.testing.enabled` to `true`. This way you'll be allowed to see notification on an http domain.

At this point you can open the application in Chrome [http://polarisbank.com:3000](http://polarisbank.com:3000). You should receive a message to enable notification, allowing this will enable a web push notification flow further in the user journey.
Don't forget to allow notifications when your browser will ask for your consent!

### Setup ForgeRock Bank integration

This process is difficult and error prone. Please follow the steps carefully.

#### Create ForgeRock Directory account

1. Browse to [ForgeRock Directory][forgerock-directory] and make yourself an account.
   **Caution** don't forget your _username_, as authentication will not work with your _email_.

1. Once on the dashboard, click on "Create a new software statement" button.

1. Select "Transport/Signing/Encryption keys" tab, and scroll down to "Keys" section.

1. Click on the download (cloud) button of your _Transport_ key:

   1. Save the Public certificate (.pem) as your `server/crt.crt` file.
   1. Save the Private key (.key) as your `server/key.key` file.

1. Now, **Log out**. If you forget to, you'll have trouble for the next step

#### Create ForgeRock Bank account

1. Browse to [ForgeRock Bank][forgerock-bank] and make yourself an account.
   **Caution** don't forget your _username_, as authentication will not work with your _email_.
   We recommend using a different username from the Directory, to avoid confusion.

1. Now, **Log out**

#### Register your TPP with Postman

1. You'll need first to download [Postman][postman]. Don't use web-extension: install the desktop app on your laptop.

1. Then open it, and import their collection and environment:

   1. Use the "Import" button for collection.
   1. Open "Link" tab to import content from https://raw.githubusercontent.com/ForgeRock/obri-postman/master/ForgeRock%20OBRI%20Sample%20(Generated).postman_collection.json (here is the ForgeRock [github account][collection-github], in case the link becomes invalid).
   1. Once done, download the enrironment file from https://raw.githubusercontent.com/ForgeRock/obri-postman/master/Environment/OBRI%20ob%20(Generated).postman_environment.json and save it locally.
   1. In Postman, import their environment by clicking on the cog icon to Manage Environments.
   1. Use the "Import" button for environment, and select the file you downloaded.
   1. Close the "Manage Environments" modal.
   1. Select "ORBI ob (Generated)" environment in the env dropdown.

1. Configure certificate in Postman:

   1. In `File/Settings` menu (or spanner top-right icon on Mac).
   1. Select `Certificates` tab.
   1. Click on "Add Certificate" link.
   1. Set host to `*.ob.forgerock.financial`.
   1. Select your `server/crt.crt` as Cert file.
   1. Select your `server/key.key` as Key file.
   1. No need of any passphrase nor PFX file: just save it as is.

1. Using the collections tab on the left and side, Open the `ForgeRock ORBI Sample (Generated)` folder.

1. Now setup your Postman variables by running queries from the following sub-folders:

   1. `Setup your environment/Test MALTS`: run them all in order. They should all succeed.
   1. `Setup your environment/Discovery`: run them all in order. They should all succeed, and will set global variables.

1. Onboard your TPP:

   1. Edit the request body of `Dynamic Registration/Onboarding your TPP/Generate registration JWT - FR Tool API` query: **carefully setup your redirect_uris**.
   1. Then run all queries of `Dynamic Registration/Onboarding your TPP` folder in order. They should all succeed.

1) Your TPP is ready to use!

#### Add your ForgeRock account to PolarisBank app

1. Open http://polarisbank.com:3000/overview

1. Tap "Current Account" link

1. Tab "Add Open Banking Account" button

1. Select "ForgeRock Bank"

1. Once redirected to `https://bank.ob.forgerock.financial/login`, log with the same _username_ and _password_ you used on [ForgeRock Bank][forgerock-bank].

#### Additional notes

_Caution:_ the imported account is hardcoded as a Santander account with no transactions

The ForgeRock certificate and private key shipped for developpement were created with Directory account `damien`/`Password`.
The corresponding Bank account is `damien-customer`/`Password`.

Reference documentation is available [here][forgerock-doc].

### Invite user journey

Tap on the 'Current Account' link on the overview page.

![step-1]

Tap on 'Add Open Banking Account'.

![step-2]

Tap on 'Invite Open Banking Account'.

![step-3]

This link will bring you to the invite page where you can fill in a name and invitation message. For simplicity's sake we'll share with a QR code which will generate a URL that the invitee can use. Once you've entered the required details tap on 'Share with QR code' and a code will be generated.

![step-4]

We now need to run through the invitee flow to connect the accounts. In the Chrome dev tools console paste the following code to access the connection ID, `JSON.parse(localStorage.getItem("@PolarisBank:state")).connection.connections.pop().id`.

You could also scan the QR code, and browse to the encoded URL.

![step-5]

Once you have this ID open a new tab and navigate to [`http://polarisbank.com:3000/connect/<id>`](http://polarisbank.com:3000/connect/<id>) where `<id>` is the ID from the previous step. This will bring you to the invitation page to allow invitees to connect their Open Banking account, tap 'Add Open Baking Account'.

![step-6]

Tap 'Cumberland Building Society Sandbox'.

![step-7]

You now need to confirm the connection by ticking the checkboxes and tapping the 'Connect with...' button.

![step-8]

Doing this will navigate you to the Cumberland Open Banking Sandbox website where you can login with one of their test accounts, details of which can be found at [https://www.cumberland.co.uk/developers/neon/download/file/PDFs/sandbox-instructions.pdf](https://www.cumberland.co.uk/developers/neon/download/file/PDFs/sandbox-instructions.pdf).

Once logged in select an account to connect and tap 'Continue'.

![step-9]

Once this process is complete you'll be redirected back to our application and will see a success screen.

![step-10]

When you now visit the 'Current Account' section of the Polaris app, you will see the connected open banking app below the mock current account, with active 'Transfer' and 'Actions' buttons.

<!-- External Links -->

[polaris-nearform]: https://polarisbank.nearform.com/
[expo]: https://expo.io/
[openbanking]: https://www.openbanking.org.uk/
[watson]: https://www.ibm.com/cloud/watson-assistant/
[ibmdashboard]: https://cloud.ibm.com/
[insecure-origins]: ../img/insecure-origins.png
[step-1]: ./docs/img/step-1.png ':size=400'
[step-2]: ./docs/img/step-2.png ':size=400'
[step-3]: ./docs/img/step-3.png ':size=400'
[step-4]: ./docs/img/step-4.png ':size=400'
[step-5]: ./docs/img/step-5.png
[step-6]: ./docs/img/step-6.png ':size=400'
[step-7]: ./docs/img/step-7.png ':size=400'
[step-8]: ./docs/img/step-8.png ':size=400'
[step-9]: ./docs/img/step-9.png ':size=400'
[step-10]: ./docs/img/step-10.png ':size=400'
[forgerock-doc]: https://docs.ob.forgerock.financial/
[postman]: https://www.postman.com/downloads/
[collection-github]: https://github.com/ForgeRock/obri-postman
[forgerock-directory]: https://directory.ob.forgerock.financial/dashboard
[forgerock-bank]: https://bank.ob.forgerock.financial/register
