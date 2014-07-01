MoodKick App
======

The Moodkick App is an app that users use on their smartphones to interact with the MoodKick Server Backend.

The app is written in HTML5, using Angular.JS as the MVC framework and wrapped with PhoneGap to make it run natively on iOS and Android smartphones (and in the future also on other platforms).

## AngularJS

1. `cd angular`
2. `npm install`
3. `npm install -g brunch@1.4 -g`
  ignore message `The package generator-karma does not satisfy its siblings' peerDependencies requirements!`
4. `npm start`
5. Either run app on the same domain as server app or run Chrome with disabled web security: `open /Applications/Google\ Chrome.app --args --disable-web-security`
6. Go to Config and update path to app app
7. Get user credentials from seed file in server app

## iOS

Sources are copied from angular/public to www folder. Thus sources should be already be compiled before starting iOS app.

1. Compile AngularJS sources by running 1-4
2. Run iOS/MoodKick.xcodeproj
3. Product/Run
4. Configure server app to be on the domain accessible from iOS (localhost will not work)

## Android

Sources are simlinked to angular/public folders. Thus sources should be already compiled before starting Android app.

1. Compile AngularJS sources by running 1-4
2. Download and install Eclipse ADT
3. Import android folder to eclipse workspace
4. Install Android SDK API 8 from Android SDK Manager
5. Create Android Virtual Device
6. Run as Android Application

