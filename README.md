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