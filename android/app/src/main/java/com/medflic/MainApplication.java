package com.medflic;

import android.app.Application;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import io.invertase.firebase.RNFirebasePackage;


import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import com.razorpay.rn.RazorpayPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
	
	

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerPackage(),
            new ReactNativePushNotificationPackage(),
          new RNFirebasePackage(),
          new RNAndroidLocationEnablerPackage(),
          new SvgPackage(),
		      new LinearGradientPackage(),
          new RNGestureHandlerPackage(),
          new VectorIconsPackage(),
          new RCTMGLPackage(),
          new RazorpayPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}





