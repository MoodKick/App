package dk.translucent.phonegap.plugins;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.json.JSONArray;
import org.json.JSONException;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;

public class AudioPlayer extends Plugin {
    private static final String ASSETS = "file:///android_asset/";

    @Override
    public PluginResult execute(String action, JSONArray args, String callbackId) {
    	Log.d(getClass().toString(), "Executing plugin action");
        PluginResult.Status status = PluginResult.Status.OK;
        String result = "";

        try {
            if (action.equals("playAudio")) {
                playAudio(args.getString(0));
            }
            else {
                status = PluginResult.Status.INVALID_ACTION;
            }
            return new PluginResult(status, result);
        } catch (JSONException e) {
            return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
        } catch (IOException e) {
            return new PluginResult(PluginResult.Status.IO_EXCEPTION);
        }
    }

    private void playAudio(String url) throws IOException {
        // Create URI
        Uri uri = Uri.parse(url);

        Intent intent = null;
        
        if(url.contains(ASSETS)) {
            // get file path in assets folder
            String filepath = url.replace(ASSETS, "");
            // get actual filename from path as command to write to internal storage doesn't like folders
            String filename = filepath.substring(filepath.lastIndexOf("/")+1, filepath.length());

            // Don't copy the file if it already exists
            File fp = new File(this.cordova.getActivity().getFilesDir() + "/" + filename);
            if (!fp.exists()) {
                this.copy(filepath, filename);
            }

            // change uri to be to the new file in internal storage
            uri = Uri.parse("file://" + this.cordova.getActivity().getFilesDir() + "/" + filename);

            // Display video player
            intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "audio/*");
        } else {
            // Display video player
            intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "audio/*");
        }

        this.cordova.getActivity().startActivity(intent);
    }

    @SuppressLint("WorldReadableFiles")
	private void copy(String fileFrom, String fileTo) throws IOException {
        // get file to be copied from assets
        InputStream in = this.cordova.getActivity().getAssets().open(fileFrom);
        // get file where copied too, in internal storage.
        // must be MODE_WORLD_READABLE or Android can't play it
        FileOutputStream out = this.cordova.getActivity().openFileOutput(fileTo, Context.MODE_WORLD_READABLE);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) > 0)
            out.write(buf, 0, len);
        in.close();
        out.close();
    }
}

//package dk.translucent.phonegap.plugins;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.InputStream;
//
//import org.apache.cordova.api.Plugin;
//import org.apache.cordova.api.PluginResult;
//import org.json.JSONArray;
//import org.json.JSONException;
//
//import android.content.Context;
//import android.content.Intent;
//import android.net.Uri;
//import android.util.Log;
//
//
//public class AudioPlayer extends Plugin {
//    private static final String ASSETS = "file:///android_asset/";
//
//    @Override
//    public PluginResult execute(String action, JSONArray args, String callbackId) {
//        Log.i("AudioPlayerPlugin", "Executing action '" +  action + "'");
//        PluginResult.Status status = PluginResult.Status.OK;
//        String result = "";
//        try {
//            if (action.equals("playAudio")) {
//                playAudio(args.getString(0));
//            } else {
//                status = PluginResult.Status.INVALID_ACTION;
//            }
//            return new PluginResult(status, result);
//        } catch (JSONException e) {
//            return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
//        } catch (IOException e) {
//            return new PluginResult(PluginResult.Status.IO_EXCEPTION);
//        }
//    }
//
//    private void playAudio(String url) throws IOException {
//        Log.i("AudioPlayerPlugin", "playing audio at '" + url + "'");
//        // Create URI
//        Uri uri = Uri.parse(url);
//        Intent intent = null;
//        // Check to see if someone is trying to play a YouTube page.
//        if (url.contains(ASSETS)) {
//            // get file path in assets folder
//            String filepath = url.replace(ASSETS, "");
//            // get actual filename from path as command to write to internal
//            // storage doesn't like folders
//            String filename = filepath.substring(filepath.lastIndexOf("/") + 1,
//                    filepath.length());
//            // Don't copy the file if it already exists
//            File fp = new File(this.ctx.getContext().getFilesDir() + "/"
//                    + filename);
//            if (!fp.exists()) {
//                this.copy(filepath, filename);
//            }
//            // change uri to be to the new file in internal storage
//            uri = Uri.parse("file://" + this.ctx.getContext().getFilesDir()
//                    + "/" + filename);
//            // Display audio player
//            intent = new Intent(Intent.ACTION_VIEW);
//            intent.setDataAndType(uri, "audio/*");
//        } else {
//            // Display audio player
//            intent = new Intent(Intent.ACTION_VIEW);
//            intent.setDataAndType(uri, "audio/*");
//        }
//        this.ctx.startActivity(intent);
//    }
//
//    private void copy(String fileFrom, String fileTo) throws IOException {
//        // get file to be copied from assets
//        InputStream in = this.ctx.getAssets().open(fileFrom);
//        // get file where copied too, in internal storage.
//        // must be MODE_WORLD_READABLE or Android can't play it
//        FileOutputStream out = this.ctx.getContext().openFileOutput(fileTo,
//                Context.MODE_WORLD_READABLE);
//        // Transfer bytes from in to out
//        byte[] buf = new byte[1024];
//        int len;
//        while ((len = in.read(buf)) > 0)
//            out.write(buf, 0, len);
//        in.close();
//        out.close();
//    }
//}
