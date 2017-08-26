This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/driftyco/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/driftyco/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myBlank blank
```

Then, to run it, cd into `myBlank` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

### Install Native Audio

```
$ cordova plugin add cordova-plugin-console
$ cordova plugin add cordova-custom-config
$ cordova plugin add cordova-plugin-device
$ cordova plugin add cordova-plugin-iosrtc
$ cordova plugin add cordova-plugin-media
$ cordova plugin add android-camera-permission
$ cordova plugin add cordova-plugin-android-permissions@0.10.0$
$ cordova plugin add https://github.com/alongubkin/audiotoggle.git
$ cordova plugin add cordova-plugin-audioinput
```

**For iOS only:**
```
$ cordova plugin add cordova-plugin-iosrtc
```
**For Android only:**
```
$ cordova plugin add cordova-plugin-crosswalk-webview
$ cordova plugin add android-camera-permission
$ cordova plugin add cordova-plugin-android-permissions@0.10.0
$ cordova plugin add https://github.com/alongubkin/audiotoggle.git
$ cordova plugin add cordova-plugin-audioinput
```
### Run App ###
```
$ ionic cordova run android
```
