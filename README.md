# aShoppingList
Ionic Live Shopping List App

The app is live deployed [Here](https://adamino-shoppinglist.firebaseapp.com/shopping)

## Before starting the project
The project is configured to use [Google Firebase](https://firebase.google.com/).

To use this app, you have to setup your own firebase backend and override the configuration file in this project.

You can find the firebase configuration under `src/app/app.module.ts`

## Running the project
The project is started with the regular [Ionic Commands](https://ionicframework.com/docs/cli/commands.html).

1. Run `npm install` to install all dependencies.

## Developing in browser
2. Running the app in your browser:
    - Browser: `ionic serve`
    - Browser with lab: `ionic serve --lab`
    - To enable console logging append at end: `-c`
    - To avoid opening browser append at end: `--no-open`
## Developing on mobile
1. Running the app on your phone: (In order for you to build an iOS app, you need to run on MacOS.)
    - Android: `ionic cordova run android -l`
    - iOS: `ionic cordova run ios -l`
2.  To build resources for app run `ionic cordova resources`
3. Building and deploying app to app store:
     - Build for release: `npm run release`
     - Release for Android: Open Android Studio and sign APK, then release on Play Console
     - Release for iOS: Not available yet!

## Here will come a section about testing!

## Bugs and Issues

Have a bug or an issue with this template? [Open a new issue](https://github.com/onero/aShoppingList/issues) here on Github.

## Creator

The template was created by and is maintained by **[Adam Hansen](https://adamino.dk)**
