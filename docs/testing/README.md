# Explore and Test the App

There are various steps required to test user journeys locally. Follow these steps to make development and local testing easier.
The home page uses mock data for demonstration purposes. Connection to a real open bank account is demonstrated in the video below (tap to open the video).

[![Polaris IBM video demonstration](http://i3.ytimg.com/vi/5Dj_zaKmbVM/maxresdefault.jpg)](https://www.youtube.com/watch?v=5Dj_zaKmbVM)

This section contains the following:  
- [Explore and Test Setup](#explore-and-test-setup): Describes the steps required to enable Polaris to run locally while connecting to a real open banking app.  To connect Polaris to a real open bank account consists of the following steps, which are in detail described below:
    1. [Configure the Environment](#Configure-the-envirmonment).
    1. [Set up ForgeRock Bank Integration](#Set-up-ForgeRock-bank-integration).
- [User Journeys](#user-journeys): Describes the user journeys you can use to test the app after you configure the [Explore and Test Setup](#explore-and-test-setup).

## Explore and Test Setup

### 1. Configure the Environment

Before running the application, configure your environment variables as described below.

1. For the frontend, in the `.env` file set `REACT_APP_UI_BASE` to `http://polarisbank.com:3000`. This is an alias to your local machine that is used in the backend configuration as a callback URL. Use the default values provided in the sample file for all other variables. 
1. Add the following entry to your host file: `127.0.0.1 polarisbank.com`.
1. For the backend environment variables you need to source the appropriate open banking and IBM credentials.
1. Run both applications.   
    - Run the backend with the command: `cd server && npm run build && npm start`. 
    - For the frontend, build the application and serve the static built files to allow the service worker to be used. Build with the command: `npm run build:web`. Serve it statically with: `npx serve web-build -l 3000 -s`. This build and serve workflow isn't always necessary, but it is required for a complete end-to-end test.  You can use the alternative command: `npm run start:web`. This is more useful for incremental changes and focused development and testing.

Once you have both applications running, allow the service worker to run on an unsecured domain (the polarisbank.com alias) as follows: 
1. In Chrome open the page [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure). Add an entry for `http://polarisbank.com:3000`, toggle the flag from disabled to enabled and restart Chrome, as shown below.

    ![insecure-origins]

    **Note:** If you are using Firefox, open [Settings](about:config). Set both `dom.webnotifications.allowinsecure` and `dom.serviceWorkers.testing.enabled` to true. This way, you'll be allowed to see notifications on a HTTP domain.

1. Open the application in Chrome [http://polarisbank.com:3000](http://polarisbank.com:3000). A message to enable notification is displayed. Click **Allow** to enable a web push notification flow further in the user journey. 

1. To verify the service worker is running, open Chrome Developer Tools, click **Application** on the menu bar and select **Service Workers**. The status icon is green and shows as 'activated and is running', as in the diagram below:

    ![service-worker]

### 2. Set up ForgeRock Bank Integration

This process is difficult and error prone. It consists of the steps below. Please follow each step carefully.
- [Create a ForgeRock Directory Account](#create-a-ForgeRock-Directory-Account).
- [Create a ForgeRock Bank Account](#create-a-ForgeRock-Bank-Account).
- [Register your Third Party Provider (TPP) with Postman](#Register-your-third-party-provider-(TPP)-with-postman).
- [Add your ForgeRock account to the Polaris Bank App](#Add-your-ForgeRock-account-to-the-polaris-bank-app).

#### Create a ForgeRock Directory Account

1. Browse to [ForgeRock Directory][forgerock-directory] and create an account.
   **Caution:** Don't forget your _username_, as authentication doesn't work with your _email_.

1. On the dashboard, click **Create a new software statement**.

1. Select the **Transport/Signing/Encryption keys** tab and scroll to **Keys** section.

1. Click the download (cloud) button of your _Transport_ key:

   1. Save the Public certificate (.pem) as your `server/crt.crt` file.
   1. Save the Private key (.key) as your `server/key.key` file.

1. **Log out**. If you forget to log out, you'll have trouble completing the next step.

#### Create a ForgeRock Bank Account

1. Browse to [ForgeRock Bank][forgerock-bank] and create an account.
   **Caution:** Don't forget your _username_, as authentication doesn't work with your _email_.
   We recommend using a different username from the Directory account above, to avoid confusion.

1. **Log out**.

#### Register your Third Party Provider (TPP) with Postman

1. Download [Postman][postman]. Don't use the web extension; install the desktop app on your laptop.

1. Open the Postman app and import their collection and environment as follows:

   1. Select **Import** on the menu bar for collection.
   1. Select the **Link** tab and enter the following URL in the field provided: https://raw.githubusercontent.com/ForgeRock/obri-postman/master/ForgeRock%20OBRI%20Sample%20(Generated).postman_collection.json. Select **Import**. (**Note:** Use the ForgeRock [github account][collection-github], if the link is invalid).
   1. Download the environment file from: https://raw.githubusercontent.com/ForgeRock/obri-postman/master/Environment/OBRI%20ob%20(Generated).postman_environment.json and save it locally.
   1. In the Postman app, click the cog icon. The Manage Environments modal is displayed. Select **Import** and select the environment file you downloaded in the previous step.
   1. Close the Manage Environments modal.
   1. Select the **ORBI ob (Generated)** environment in the environment dropdown box on the Postman app homepage.

1. Configure a certificate in Postman:

   1. In the **Settings** menu (spanner icon on the menu bar), select the **Certificates** tab.
   1. Click **Add Certificate**.
   1. Enter `*.ob.forgerock.financial` in the Host field.
   1. Select your file `server/crt.crt` as the CRT file.
   1. Select your file `server/key.key` as the KEY file.
   1. No passphrase nor PFX file is required. Click **Add** to save the certificate.

1. Using the Collections tab on the left pane, open the `ForgeRock ORBI Sample (Generated)` folder.

1. Set up your Postman variables by running queries from the following subfolders:

   1. `Setup your environment/Test MATLS`: run all queries in order. They should all succeed.
   1. `Setup your environment/Discovery`: run all queries in order. They should all succeed and set the global variables.

1. Onboard your TPP:

   1. Edit the request body of the `Dynamic Registration/Onboarding your TPP/Generate registration JWT - FR Tool API` query. **Carefully set up your redirect_uris**.
   1. Run all queries in the `Dynamic Registration/Onboarding your TPP` folder in order. They should all succeed.

1. Your TPP is ready to use!

#### Add your ForgeRock account to the Polaris Bank App

1. Open http://polarisbank.com:3000/overview.

1. Tap **Current Account**.

1. Tap **Add Open Banking Account**.

1. Select **ForgeRock Bank**.

1. When redirected to `https://bank.ob.forgerock.financial/login`, log in with the same _username_ and _password_ you used on [ForgeRock Bank][forgerock-bank].

#### Additional Notes

_Caution:_ The imported account is hardcoded as a Santander account with no transactions.

The ForgeRock certificate and private key shipped for development were created with the directory account `damien`/`Password`.
The corresponding bank account is `damien-customer`/`Password`.

Refer to the [ForgeRock Documentation][forgerock-doc] for more details.

You are now set up!

## User Journeys

The setup described above allows end-to-end testing of the following user journeys, which are described below:
- [Invite Journey](#Invite-journey)
- [Action Setup Journey ](#action-setup-journey)
- [Action Edit and Remove Journey](#action-edit-and-remove-journey)

### Invite Journey
This section describes a user journey where a user invites someone to connect their account. It consists of both the [inviter journey](#inviter-journey) and [invitee journey](#invitee-journey).
#### Inviter Journey
 1. Tap the **Current Account** link on the overview page.

     ![step-1]

 1. Tap **Add Open Banking Account**.

  ![step-2]

 1. Tap **Invite Open Banking Account**.

  ![step-3]

 1. The invite page is displayed. Enter a name and invitation message in the fields provided. For simplicity, we share with a QR code which generates a URL that the invitee can use. When you've entered the required details tap **Share with QR code** to generate a code.

  ![step-4]
#### Invitee Journey
This section describes the invitee journey to connect the accounts after they receive a connect invitation.

1. In the Chrome Developer Tools console, paste the following code to access the connection ID: `JSON.parse(localStorage.getItem("@PolarisBank:state")).connection`. 
 
 In the Connection state get the ID from the connection in the `connections` array as shown below.

    ![step-5]

1. Open a new tab and navigate to [`http://polarisbank.com:3000/connect/<id>`](http://polarisbank.com:3000/connect/<id>) where `<id>` is the ID from the previous step. This displays the invitation page to allow invitees to connect their Open Banking account. 

1. Tap **Add Open Banking Account**.

    ![step-6]

1. Tap **Cumberland Building Society Sandbox**.

  ![step-7]

1. Confirm the connection by ticking the checkboxes and tap **Cumberland Building Society Sandbox**.

  ![step-8]

1. The Cumberland Open Banking Sandbox website is displayed. Log in using one of their test accounts. You can find details at: [https://www.cumberland.co.uk/developers/neon/download/file/PDFs/sandbox-instructions.pdf](https://www.cumberland.co.uk/developers/neon/download/file/PDFs/sandbox-instructions.pdf).

1. When logged in, select an account to connect and tap **Continue**.

 ![step-9]

1. When this process is complete you are redirected back to the Polaris Bank application indicating the invitee account connected successfully.

 ![step-10]

This concludes the invite user journey. After an invitee received and accepted the connect invitation, users can now perform **Actions** and **Transfers**.

### Action Setup Journey

This section describes how to create an action that is triggered under certain conditions. In this example, a payment transfer from the inviters account is triggered if the invitee's balance is below £1,000,000.

1. Return to the original tab you opened. A screen indicating that your invitation was accepted is displayed. Tap **Set up payment**.

    ![step-11]

1. The action setup screen is displayed. Tap **Conditional transfer**.

 ![step-12]

1. Create an action with a name, amount and balance condition of £1,000,000 (this is required as we don't have control of the invitee's account balance so we want to ensure the condition is triggered immediately). Tap **Create action**.

    ![step-13]

1. A screen displays that the action saved successfully.

 ![step-14]

1. You now receive a web push notification alerting you that the action condition has been met. Tap the notification. The transfer screen is displayed. Select **Cumberland Building Society Sandbox** from the provider list.

 ![step-15]

1. A prefilled transfer screen is displayed. Tap **Continue** . The Cumberland Sandbox is displayed again.

 ![step-16]

1. Log in to the Cumberland Sandbox with the same account details. A screen to action the payment is displayed. Choose an account. Ensure it's a different account to the one used previously or the transaction will fail. Tap **Continue**.

 ![step-17]

1. When the transaction has been processed, you are redirected back to the Polaris Bank application and a payment success screen is displayed.

 ![step-18]

### Action Edit and Remove Journey

1. You can edit and remove actions by tapping **Current Account** on the overview page. Then tap **Actions** on the account called 'Jane'.

 ![step-19]

1. A list of created actions is displayed. Tap a listed action to view the action details.

 ![step-20]

1. You can edit or remove an action. Click either **Update action** or **Delete action** as appropriate.

 ![step-21]

<!-- Images -->
[insecure-origins]: ../img/insecure-origins.png
[service-worker]: ../img/service-worker.png
[step-1]: ../img/step-1.png ':size=400'
[step-2]: ../img/step-2.png ':size=400'
[step-3]: ../img/step-3.png ':size=400'
[step-4]: ../img/step-4.png ':size=400'
[step-5]: ../img/step-5.png
[step-6]: ../img/step-6.png ':size=400'
[step-7]: ../img/step-7.png ':size=400'
[step-8]: ../img/step-8.png ':size=400'
[step-9]: ../img/step-9.png ':size=400'
[step-10]: ../img/step-10.png ':size=400'
[step-11]: ../img/step-11.png ':size=400'
[step-12]: ../img/step-12.png ':size=400'
[step-13]: ../img/step-13.png ':size=400'
[step-14]: ../img/step-14.png ':size=400'
[step-15]: ../img/step-15.png ':size=400'
[step-16]: ../img/step-16.png ':size=400'
[step-17]: ../img/step-17.png ':size=400'
[step-18]: ../img/step-18.png ':size=400'
[step-19]: ../img/step-19.png ':size=400'
[step-20]: ../img/step-20.png ':size=400'
[step-21]: ../img/step-21.png ':size=400'

<!-- External Links -->
[postman]: https://www.postman.com/downloads/
[forgerock-doc]: https://docs.ob.forgerock.financial/
[forgerock-directory]: https://directory.ob.forgerock.financial/dashboard
[forgerock-bank]: https://bank.ob.forgerock.financial/register
