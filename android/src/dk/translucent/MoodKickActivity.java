package dk.translucent;

import org.apache.cordova.DroidGap;

import android.os.Bundle;

import com.urbanairship.UAirship;

public class MoodKickActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		// call the super on create
		super.onCreate(savedInstanceState);
		// override the default timeout 
		setIntegerProperty("loadUrlTimeoutValue", 60000);
		// load phonegap web client
		super.loadUrl("file:///android_asset/www/index.html");
		// add websocket fix for android shortcomings ... This is broken on Android 2.3
		//WebSocketFactory wsFactory = new WebSocketFactory(appView);
		//appView.addJavascriptInterface(wsFactory, "WebSocketFactory");
	}
	
	@Override
	protected void onStart() {
		super.onStart();
		// Begin UrbanAirship analytics
		UAirship.shared().getAnalytics().activityStarted(this);
	}
	
	@Override
	public void onStop() {
		super.onStop();
		// End UrbanAirship analytics
		UAirship.shared().getAnalytics().activityStopped(this);
	}
}
