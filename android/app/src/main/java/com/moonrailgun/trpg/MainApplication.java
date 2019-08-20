package com.moonrailgun.trpg;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import io.sentry.RNSentryPackage;
import com.microsoft.codepush.react.CodePush;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.soexample.invokenative.DplusReactPackage;
import com.umeng.soexample.invokenative.RNUMConfigure;
import com.umeng.message.PushAgent;
import com.umeng.message.IUmengRegisterCallback;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RNFSPackage(),
        new CameraRollPackage(),
        new ReactNativeConfigPackage(),
        new DplusReactPackage(),
        new PickerPackage(),
        new FastImageViewPackage(),
        new RNCWebViewPackage(),
        new RNSentryPackage(),
        new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG, getResources().getString(R.string.reactNativeCodePush_androidServerUrl)),
        new RNGestureHandlerPackage(),
        new ImagePickerPackage()
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
    RNUMConfigure.init(this, BuildConfig.UMENG_PUSH_APPKEY, BuildConfig.UMENG_PUSH_CHANNEL, UMConfigure.DEVICE_TYPE_PHONE,
            BuildConfig.UMENG_PUSH_MESSAGESECRET);

    // 注意: 必须在此处注册
    PushAgent.getInstance(this).register(new IUmengRegisterCallback(){
        @Override
        public void onSuccess(String s) {
            Log.i("walle", "--->>> onSuccess, s is " + s);
        }

        @Override
        public void onFailure(String s, String s1) {
            Log.i("walle", "--->>> onFailure, s is " + s + ", s1 is " + s1);
        }
    });
    SoLoader.init(this, /* native exopackage */ false);
  }
}
