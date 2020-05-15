package com.ads.medflic;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.Application;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.ads.medflic.ExampleActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;

/**
 * Expose Java to JavaScript. Methods annotated with {@link ReactMethod} are exposed.
 * https://github.com/petterh/react-native-android-activity/tree/master/android/app/src/main/java/com/demo/activity
 */
final class ActivityStarterModule extends ReactContextBaseJavaModule {
    private Context context;
    private SparseArray<Promise> mPromises;


    ActivityStarterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mPromises = new SparseArray<>();
    }
    ActivityStarterModule(Activity context) {
        this.context = context;
    }



    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from JavaScript.
     */
    @Override
    public String getName() {
        return "ActivityStarter";
    }

    @ReactMethod
    void navigateToExample() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, ExampleActivity.class);
            activity.startActivityForResult(intent, ExampleActivity.ACCEPT_CODE);
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    void hasAlreadyPermissionGrantedToShowVideoScreen(@NonNull Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            if (Settings.canDrawOverlays(activity)) {
                promise.resolve(true);
            }
            else {
                promise.resolve(false);
            }
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    void getPermissionForOverLay() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Log.d("getPermissionForOverLay", "inside  Not Null of Activity Condition");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Log.d("getPermissionForOverLay", "inside  Version Condition");

                if (!Settings.canDrawOverlays(activity)) {
                  //  Log.d("getPermissionForOverLay", "inside getPermissionForOverLay Setting Can Draw Overlay");
                  //  Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                  ///          Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                   // activity.startActivityForResult(intent, 0 );


                    Intent rIntent = getReactApplicationContext().getPackageManager()
                            .getLaunchIntentForPackage(getReactApplicationContext().getPackageName() );
                    PendingIntent intent = PendingIntent.getActivity(
                            activity, 0,
                            rIntent, PendingIntent.FLAG_CANCEL_CURRENT);
                    AlarmManager manager = (AlarmManager) activity.getSystemService(Context.ALARM_SERVICE);
                    manager.set(AlarmManager.RTC, System.currentTimeMillis(), intent);
                    System.exit(2);
                }
            }
        }
    }

    @ReactMethod
    void showIncomingCallNotification() {
        Context activity = getCurrentActivity();
        if (activity != null) {
            Log.d("NotificationBuilder", "Notification is Building...");
            // Intent intent = new Intent(activity, ExampleActivity.class);
           // activity.startActivityForResult(intent, ExampleActivity.ACCEPT_CODE);
            Intent fullScreenIntent = new Intent(activity, ExampleActivity.class);


            PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(activity, 0,
                    fullScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            NotificationCompat.Builder notificationBuilder =
                    new NotificationCompat.Builder(context, "123")
                            .setSmallIcon(R.drawable.video_accept1)
                            .setContentTitle("Incoming call")
                            .setContentText("(919) 555-1234")
                            .setPriority(NotificationCompat.PRIORITY_HIGH)
                            .setCategory(NotificationCompat.CATEGORY_CALL)

                            // Use a full-screen intent only for the highest-priority alerts where you
                            // have an associated activity that you would like to launch after the user
                            // interacts with the notification. Also, if your app targets Android 10
                            // or higher, you need to request the USE_FULL_SCREEN_INTENT permission in
                            // order for the platform to invoke this notification.
                            .setFullScreenIntent(fullScreenPendingIntent, true);

            Notification incomingCallNotification = notificationBuilder.build();

            Log.d("NotificationBuilder", "Notification has been Build");
        }
    }
    @ReactMethod
    void endVideoCallScreen() {
        Activity activity = getCurrentActivity();
        Log.d("endVideCall", activity.getClass().getSimpleName());
        if (activity != null) {
            if(activity.getClass().getSimpleName().equals(ExampleActivity.class.getSimpleName())) {
                activity.finish();
            }
        }
    }

    @ReactMethod
    void dialNumber(@NonNull String number) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + number));
            activity.startActivity(intent);
        }
    }

    @ReactMethod
    void getActivityName(@NonNull Callback callback) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            callback.invoke(activity.getClass().getSimpleName());
        } else {
            callback.invoke("No current activity");
        }
    }

    @ReactMethod
    void getActivityNameAsPromise(@NonNull Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            promise.resolve(activity.getClass().getSimpleName());
        } else {
            promise.reject("NO_ACTIVITY", "No current activity");
        }
    }
/*
    @ReactMethod
    void callJavaScript() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            MainApplication application = (MainApplication) activity.getApplication();
            ReactNativeHost reactNativeHost = application.getReactNativeHost();
            ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

            if (reactContext != null) {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                WritableNativeArray params = new WritableNativeArray();
                params.pushString("Hello, JavaScript!");

                // AFAIK, this approach to communicate from Java to JavaScript is officially undocumented.
                // Use at own risk; prefer events.
                // Note: Here we call 'alert', which shows UI. If this is done from an activity that
                // doesn't forward lifecycle events to React Native, it wouldn't work.
                catalystInstance.callFunction("JavaScriptVisibleToJava", "alert", params);
            }
        }
    }
 */

    @ReactMethod
    public void startActivityForResult(Intent data, int requestCode ) {
        System.out.println("Request Code " + requestCode);
        Log.d("startActivityForResult", "Result Code" +requestCode);
        Log.d("startActivityForResult", "" +data.getExtras());
    }
    @ReactMethod
    public void startActivityForResult(int requestCode, String action, Intent data) {
        System.out.println("Request Code " + requestCode);
        Log.d("Action ", action);
        Log.d("Request Code  ", ""+requestCode);
        Log.d("Intent ", ""+data.getExtras());
    }

    @ReactMethod
    public void startActivityForResult(int requestCode, String action, ReadableMap data, Promise promise) {
        Log.d("Action On Over", action);
        Log.d("Action On Over ", ""+requestCode);
        Activity activity = getReactApplicationContext().getCurrentActivity();

        Intent intent = new Intent(action);
        intent.putExtras(Arguments.toBundle(data));
        activity.startActivityForResult(intent, requestCode);
        mPromises.put(requestCode, promise);
    }
}