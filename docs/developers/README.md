![developers-quote]

# Developers
This section describes Polaris features for developers.

## The Technology Stack

We used the following libraries and tools to create the Polaris technology stack:
- [React](https://reactjs.org/)
- [React Native](https://facebook.github.io/react-native/)
- [react-native-web](https://github.com/necolas/react-native-web)
- [react-router](https://reacttraining.com/react-router/)
- [react-router-navigation](https://github.com/winoteam/react-router-navigation)
- [react-i18next](https://react.i18next.com/)
- [Redux](https://redux.js.org/)
- [react-spring](https://www.react-spring.io/)
- [Expo](https://expo.io/)
- [Workbox](https://developers.google.com/web/tools/workbox/)

We wrote the majority of the codebase using React Native to create the native application. We use `react-native-web` to seamlessly port the application to the web platform and reach maximum code reuse between platforms. This is possible thanks to [Expo] tooling.

We use:
 - Redux for state management 
 - React Router for routing 
 - react-i18next for translations.

We use the Animated API from React Native for complex animations. This also seamlessly translates to the web platform. For simple declarative animations, we use `react-spring`.

To use a custom service worker instead of the one provided by `create-react-app`, we use `react-app-rewired`. This alters the predefined Webpack configuration of Create-React-App(CRA) without needing to eject. With this we can define our own service worker, and yet still use Google's [Workbox] library.

## TypeScript

We migrated the codebase to [TypeScript]. This means you can use its powerful type system and static checks.

Expo uses [Babel] to transpile your code. So you can still mix plain JavaScript with TypeScript. This enabled us to gradually migrate the frontend codebase.

Babel enables you to use TypeScript. However, it only enables transpilation of TypeScript and not type checking. For that reason, we provide `tsconfig.json`. To both compile and type check, run the command:

```sh
npm run typecheck
```

Or, during development, use the command:

```sh
npm run typecheck:watch
```

You must compile the server code using the TypeScript compiler before running in production. Use the following commands inside the `server` directory:

```sh
npm run build && npm start
```

To start the server in development mode, run the following command:

```sh
npm run start:dev
```

## Linting and Formatting

To ensure the best code quality and style, we use the powerful [ESLint] to lint your code. With pluggable configurations like [standard] and React you are all set to start writing your React code. Also, with `@typescript-eslint/parser` it's possible to lint TypeScript code.

On top of all this there is [Prettier], the defacto industry standard, to handle code formatting.

To ensure you don't commit unlinted and unformatted code to the repository, we set up the `lint-staged` package to automatically run linting and formatting on committed files.

If you want to lint and format manually, run:

```sh
npm run lint
```

To automatically fix the issues, run the command:

```sh
npm run lint:fix
```

<!-- Images -->

[developers-quote]: ../img/developers-quote.svg

<!-- External Links -->

[Babel]: https://babeljs.io/
[typescript]: https://www.typescriptlang.org/
[eslint]: https://eslint.org/
[Expo]: https://expo.io/
[prettier]: https://prettier.io/
[standard]: https://standardjs.com/
[Workbox]: https://developers.google.com/web/tools/workbox/