# Testing IBM end-to-end user journeys locally

There are various steps required to test the full end to end IBM integrated user journeys locally. These steps are aimed to make development & local testing easier when making changes.

The user journey is demonstrated in the below video (tap to open the video);

[![Polaris IBM video demonstration](http://i3.ytimg.com/vi/5Dj_zaKmbVM/maxresdefault.jpg)](https://www.youtube.com/watch?v=5Dj_zaKmbVM)

## Setup

Before running the application you'll need to ensure your environment variables are in order.

For the frontend use the defaults in the sample file other than `REACT_APP_UI_BASE`, change that to `http://polarisbank.com:3000`. This is an alias to your local machine that is used in the backend config as a callback url. Add the following entry to your host file `127.0.0.1 polarisbank.com`.

For the backend environment variables you'll need to source the appropriate open banking and IBM credentials.

Next you need to run both the applications, the backend can be run with `cd server && npm run build && npm start`. For the frontend we need to build the application and serve the static built files to allow the service worker to be used. The application can be built with `npm run build:web` and then served statically with `npx serve web-build -l 3000 -s`. This build & serve workflow isn't necessarily required at all times but is required for a full end to end test, the alternative `npm run start:web` will be more useful for incremental changes and focused development & testing.

Once you have both applications running there's a final step to allow the service worker to run on an unsecured domain (the polarisbank.com alias). In Chrome open the page [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure), add an entry for `http://polarisbank.com:3000`, toggle the flag from disabled to enabled and restart Chrome.

![insecure-origins]

At this point you can open the application in Chrome [http://polarisbank.com:3000](http://polarisbank.com:3000). You should receive a message to enable notification, allowing this will enable a web push notification flow futher in the user journey. To double check the service worker is running as expected open Chrome dev tools, click on the Application tab and click on the Service Workers section, you should see the status with a green icon saying 'activated and is running'.

![service-worker]

This setup will allow end to end testing of the IBM journeys below.

## Invite user journey

Tap on the 'Current Account' link on the overview page.

![step-1]

Tap on 'Add Open Banking Account'.

![step-2]

Tap on 'Invite Open Banking Account'.

![step-3]

This link will bring you to the invite page where you can fill in a name and invitiation message. For simplicity's sake we'll share with a QR code which will generate a URL that the invitee can use. Once you've entered the required details tap on 'Share with QR code' and a code will be generated.

![step-4]

We now need to run through the invitee flow to connect the accounts. In the Chrome dev tools console paste the following code to access the connection ID, `JSON.parse(localStorage.getItem("@PolarisBank:state")).connection`. From there you can dig into the connection state and grab the ID from the connection in the `connections` array.

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

That concludes the invite user journey, once a user has been invited and has accepted actions and transfers can be done.

## Action setup journey

Return to the original tab you opened and you will see a screen letting you know your invitation has been accepted, from here you can set up a payment by tapping on the 'Set up payment' button.

![step-11]

You'll then be brought to an action setup screen, tap 'Conditional transfer' here.

![step-12]

Create an action with a name, amount and balance condition of £1,000,000 (this is required as we don't have control of the invitee's account balance so we want to ensure the condition is triggered straight away) then tap 'Create action'.

![step-13]

Once created you'll see a success screen.

![step-14]

At this point you should also receive a web push notification alerting you that the action condition has been met, tap on the notification and you'll be brought to the balance transfer screen. On this screen again choose the 'Cumberland Building Society Sandbox'.

![step-15]

This will bring you to a pre-filled transfer screen, tap 'Continue' to be taken to the Cumberland Sandbox once again.

![step-16]

You can once again log in to the Cumberland Sandbox with the same account details. Once logged in you'll be brought to a screen to action the payment. Choose an account, ensuring it isn't the same account used as the one previously or the transation will fail, and tap 'Continue'.

![step-17]

Once the transaction has been processed you'll be redirected back to the application and a success screen will be displayed.

![step-18]

## Action edits & removals

You can edit and remove actions by tapping 'Current Account' on the overview page then tapping the 'Actions' button on the Jane account.

![step-19]

Here you'll see a list of created actions, tapping one of them allows you to view the action details.

![step-20]

From the action details screen you can edit or remove an action.

![step-21]

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
