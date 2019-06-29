# Medflic-Native-app

How to Build Android APP
    1. Change the Config File URL
    2. Run cd android && ./gradlew assembleRelease

Issues ON IOS
   while Running Pod Install, if you face below error
      "Remote branch not found in upstream origin"
   then, open
     nodemodules/react-native-image-crop-picker/RNImageCropPicker.podspec      
   Search for (ctlr+F)
       "'v#{version}'" change to "'v' + version"