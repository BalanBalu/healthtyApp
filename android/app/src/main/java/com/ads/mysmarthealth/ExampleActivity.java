package com.ads.mysmarthealth;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.SparseArray;
import android.view.View;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import androidx.annotation.CallSuper;
import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import android.view.WindowManager;
/**
 * Activity to start from React Native JavaScript, triggered via
 * {@link ActivityStarterModule#navigateToExample()}.
 */
public final class ExampleActivity extends ReactActivity implements Animation.AnimationListener {

    ImageView arrrowMark;
    Animation animSlideUp;
    public static final int REQUEST_CODE = 123;
    public static final int RESPONSE_CODE = 321;
    public static final int ACCEPT_CODE = 1;
    public static final int DECLINE_CODE = 0;
    public static final String HAS_ACCEPTED = "HAS_ACCEPTED";
    public static final String HAS_DECLINED = "HAS_DECLINED";
    public static final String DESCRIPTION = "DESCRIPTION";



    @Override
    @CallSuper
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        /* if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            KeyguardManager keyguardManager = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            if(keyguardManager!=null)
                keyguardManager.requestDismissKeyguard(this, null);
        } */
        Window window = this.getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);

        setContentView(R.layout.activity_example);

        // Display app and React Native versions:

      /*  findViewById(R.id.accept_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
            }
        }); */
        animSlideUp = AnimationUtils.loadAnimation(getApplicationContext(),
                R.anim.slide_up);
        animSlideUp.setAnimationListener(this);

        arrrowMark = findViewById(R.id.arrow);
        arrrowMark.setVisibility(View.VISIBLE);
        arrrowMark.startAnimation(animSlideUp);

        findViewById(R.id.accept_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // The target of this event does two things:
                // 1. It sets the "extra text" that shows up when you tap "Call JavaScript from Java"
                //    on the front page. This should always work.
                // 2. It calls "alert". This does note work unless this activity forwards lifecycle
                //    events to React Native. The easiest way to do that is to inherit ReactActivity
                //    instead of ReactActivity, but you can code it yourself if you want.
                // The iOS version does not suffer from this problem.
//                Intent intent = new Intent(ExampleActivity.this, MainActivity.class);
//                startActivity(intent);
                returnSuccessCallback(ACCEPT_CODE, "ACCEPTED");
                EventEmitterModule.emitEvent("accepted");

            }
        });
        findViewById(R.id.decline_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // The target of this event does two things:
                // 1. It sets the "extra text" that shows up when you tap "Call JavaScript from Java"
                //    on the front page. This should always work.
                // 2. It calls "alert". This does note work unless this activity forwards lifecycle
                //    events to React Native. The easiest way to do that is to inherit ReactActivity
                //    instead of ReactActivity, but you can code it yourself if you want.
                // The iOS version does not suffer from this problem.
                returnErrorCallback(DECLINE_CODE, "DECLINED");
                EventEmitterModule.emitEvent("declined");
            }
        });

       /* findViewById(R.id.call_javascript_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MainApplication application = (MainApplication) ExampleActivity.this.getApplication();
                ReactNativeHost reactNativeHost = application.getReactNativeHost();
                ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
                ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

                if (reactContext != null) {
                    CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                    WritableNativeArray params = new WritableNativeArray();
                    params.pushString("Set Extra Message was called!");

                    // AFAIK, this approach to communicate from Java to JavaScript is officially undocumented.
                    // Use at own risk; prefer events.

                    // Note: Here we call 'setMessage', which does not show UI. That means it is okay
                    // to call it from an activity that doesn't forward lifecycle events to React Native.
                    catalystInstance.callFunction("JavaScriptVisibleToJava", "setMessage", params);
                    Toast.makeText(ExampleActivity.this, "Extra message was changed", Toast.LENGTH_SHORT).show();

                    try {
                        // Need new params, as the old has been consumed and would cause an exception
                        params = new WritableNativeArray();
                        params.pushString("Hello, alert! From native side!");

                        // Note: Here we call 'alert', which does show UI. That means it does nothing if
                        // called from an activity that doesn't forward lifecycle events to React Native.
                        // See comments on EventEmitterModule.emitEvent above.
                        catalystInstance.callFunction("JavaScriptVisibleToJava", "alert", params);
                    } catch (Exception e) {
                        Toast.makeText(ExampleActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            }
        }); */
    }

    @Override
    public void onAnimationStart(Animation animation) {

    }

    @Override
    public void onAnimationEnd(Animation animation) {

    }

    @Override
    public void onAnimationRepeat(Animation animation) {

    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        super.onActivityResult(requestCode, resultCode, data);
    }

    private void returnErrorCallback(int errorCode, String errorDescription){
        Intent returnIntent = new Intent();
        returnIntent.putExtra(HAS_ACCEPTED, false);
        returnIntent.putExtra(HAS_DECLINED, true);
        this.setResult(errorCode, returnIntent);
        onActivityResult(REQUEST_CODE, RESPONSE_CODE, returnIntent);
        this.finish();
    }
    private void returnSuccessCallback(int errorCode, String errorDescription){
        Intent returnIntent = new Intent();
        returnIntent.putExtra(HAS_ACCEPTED, true);
        returnIntent.putExtra(HAS_DECLINED, false);
        returnIntent.putExtra(DESCRIPTION, errorDescription);
        this.setResult(errorCode, returnIntent);
        onActivityResult(REQUEST_CODE, RESPONSE_CODE, returnIntent);
        this.finish();
    }
}