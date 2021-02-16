# SQLister
## Get ionic
1. install latest node version (npm comes with it)
2. npm install @ionic/cli
3. npm install @angular/cli

## Set up and run apps from Xcode and Android studio
- Make sure to download Xcode and Android studio or you can run the app from Chrome

Proceed by either
- Running "npm run full-start" if Xcode and Android studio are installed already
OR
1. npm install
2. ionic build
3. brew install cocoapods
4. sudo xcode-select -switch /Applications/Xcode.app/Contents/Develope
5. ionic cap add ios
6. ionic cap add android
7. ionic cap open ios
8. ionic cap open android
    - need to install versions of android and set up virtual device

## changes to code

- run "npm run update-builds"
OR
1. ionic build
2. ionic cap copy
3. ionic cap sync

