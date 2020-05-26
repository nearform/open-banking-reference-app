# Tips and Limitations
This section includes some tips and useful information to help you understand some decisions we made when developing Polaris.

As with any application, Polaris has its drawbacks. This is the result of the underlying technologies used, in particular, React Native. We discuss these limitations below and describe the workarounds we use in each case. 

## Tips

- To prevent flickering of static assets in a native environment, add your assets to the preloader in `App.js`.
- Components are mostly divided into _containers_ and _presentational_ components, so try to keep this convention.
- We based the app on React Native, using Flexbox as a basis for the layout. Keep in mind the default `flexDirection: 'column'`. Refer to [Layout with Flexbox](https://facebook.github.io/react-native/docs/flexbox) for more details.
- We used React Native's `StyleSheet` utility for styling. Refer to [React Native Style](https://facebook.github.io/react-native/docs/style) for more details.

## Limitations

### Expo Web Port

Expo Web runs on a non-configurable port which isn't the same as the normal Create-React-App(CRA). We have included `patch-package` and `expo-cli` in the package file to temporarily force the port to 3000. You can remove this when it is possible to either (a) use the default `expo-web` port 19006 _or_ (b) manually configure the port.

### Graphics

Scalable Vector Graphics (SVGs) are not reused between platforms. React Native doesn't provide an out-of-the-box solution to display SVGs. To use SVG icons in Polaris, we use `react-native-svg` and transform the actual SVGs to React components for each platform.

### Images

React Native supports multiple resolutions of the same image. Add `@2x.png` or `@3x.png` to an image's name to make React Native choose the most suitable image for a device based on the screen pixel density of the device.

This does not apply with `react-native-web`. It always loads the image with the lowest resolution. To make images look good on mobile devices with higher pixel density screens, we kept only images with the highest resolution and removed any suffixes as described above. We are aware this has a negative effect on bandwidth and is not suitable for production.

### Shadows

Box shadows are not present on the Android platform. You can use the `elevation: <number>` style rule for the view that is missing a shadow, but this does not give you options to configure the shadow. Another option is to use [react-native-shadow](https://www.npmjs.com/package/react-native-shadow). However, with this library, you must provide the exact _width_ and _height_ to the view with shadow as its children. This is often difficult in fluid design.

### Animations

There is a known issue in React Native on an Android platform when animating `scale` using the Animated API. Usually the view you are trying to scale is already scaled to 1 without running animation. Instead of animating to/from **0**, animate to/from **0.01**.

### TypeScript

We include `typescript`, `@types/googlemaps`, `@types/markerclustererplus` and `@types/react` to meet Expo's package dependencies. This means you need to keep them in sync, but you _can use TypeScript_ if you like!
