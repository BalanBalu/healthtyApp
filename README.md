# Medflic-Native-app

How to Build Android APP
    1. Change the Config File URL
    2. Run cd android && ./gradlew assembleRelease
    

 Issues 
    Bable Error
       Goto --> nodemodules/@babel/types/library/constants --> remove last 4 lines of code.


    1. If you get following Error   Task :react-native-razorpay:compileDebugJavaWithJavac FAILED then 

goto 
    nodemodules/reactnative-razropay/android/src/main/java/com/razorpay/rn/RazorPayPackage.java
    On Line No 19 --> remove the @OverRide 

Change this 
    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }
   to  
    
    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }


    IOS 
      if the Node BUndler is not working, then goto on terminal
        
         nodemodules/reactnative-razropay/ios
         Run sh SelectDefaultXcode.sh
       
    See the Video https://www.youtube.com/watch?v=hE-F0QqTwnI



React native not getting the user Location on IOS
    Can confirm my RN 0.54.0 build was accepted in iTunes Connect with the following temporary change to node_modules/react-native/Libraries/Geolocation/RCTLocationObserver.m:

Before:

if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationAlwaysUsageDescription"] &&
    [_locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
    [_locationManager requestAlwaysAuthorization];

    // On iOS 9+ we also need to enable background updates
    NSArray *backgroundModes  = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIBackgroundModes"];
    if (backgroundModes && [backgroundModes containsObject:@"location"]) {
      if ([_locationManager respondsToSelector:@selector(setAllowsBackgroundLocationUpdates:)]) {
        [_locationManager setAllowsBackgroundLocationUpdates:YES];
      }
    }
  } else if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"] &&
    [_locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
    [_locationManager requestWhenInUseAuthorization];
  }
After:

// Request location access permission
  /*if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationAlwaysUsageDescription"] &&
    [_locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
    [_locationManager requestAlwaysAuthorization];

    // On iOS 9+ we also need to enable background updates
    NSArray *backgroundModes  = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIBackgroundModes"];
    if (backgroundModes && [backgroundModes containsObject:@"location"]) {
      if ([_locationManager respondsToSelector:@selector(setAllowsBackgroundLocationUpdates:)]) {
        [_locationManager setAllowsBackgroundLocationUpdates:YES];
      }
    }
  } else */if ([[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"] &&
    [_locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
    [_locationManager requestWhenInUseAuthorization];
  }

  https://stackoverflow.com/questions/45610448/socket-io-opening-multiple-connections-with-react-native