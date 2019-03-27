# aShoppingList
Ionic Live Shopping List App

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
    - Android: `ionic cordova build android`
    - iOS: `ionic cordova build ios`
    - to run with live reload append at the end: `--livereload`  
2.  To build resources for app run `ionic cordova resources`
3. Building and deploying app to your phone:
    - Android: `ionic cordova build android --device`
    - iOS: `ionic cordova build ios --device`

An alternative is to emulate the app on a device or upload it to the ionic cloud. From here you can download the ionic view app and use the app on all devices.

## Here will come a section about testing!

## Bugs and Issues

Have a bug or an issue with this template? [Open a new issue](https://github.com/onero/aShoppingList/issues) here on Github.

## Creator

The template was created by and is maintained by **[Adam Hansen](https://adamino.dk)**
