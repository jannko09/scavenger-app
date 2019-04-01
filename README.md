# scavenger-app

Native Android app for team building exercises.
Requires some configuration for Redis in Heroku. 
Architecture below: 

![Image of architecture](https://github.com/jannko09/scavenger-app/blob/master/architecture.PNG?raw=true)

- AdminClient is react based "control console" website for APP users. Admin Starts game from website. Console includes score, playercount, and state of groups using app. 
- NativeClient is react-native based android app. Logic is to create group. Find QR codes. And initialize minigames from QR codes. Generate text based QR codes from f.ex: https://fi.qr-code-generator.com/ . QR codes should read: "C-1", "C-2", "C-3", "C-4", "C-5" to advance in game. Has two minigames coded in. One Facerecognition minigame, one color game. 

1) Add REDISCLOUD_URL="URLHERE" to .env file. 
2) Install modules and start
