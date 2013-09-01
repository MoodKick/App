package dk.translucent;

import android.app.Application;
import android.util.Log;

import com.urbanairship.AirshipConfigOptions;
import com.urbanairship.UAirship;

public class MoodKickApplication extends Application {

	public static String TAG = MoodKickApplication.class.getName();

	@Override
	public void onCreate() {
		super.onCreate();

		Log.d(TAG, "onCreate from MoodKickApplication");
		AirshipConfigOptions options = AirshipConfigOptions.loadDefaultOptions(this);

		Log.d(TAG, "Taking off");
		UAirship.takeOff(this, options);

	}

}
