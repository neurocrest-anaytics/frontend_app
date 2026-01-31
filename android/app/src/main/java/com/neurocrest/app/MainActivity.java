package com.neurocrest.app;

import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "NEUROCREST";

    @Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WebView.setWebContentsDebuggingEnabled(true);

    new Thread(() -> {
        try {
            String host = "backend-app-k52v.onrender.com";
            String ip = java.net.InetAddress.getByName(host).getHostAddress();
            Log.d(TAG, "Resolved " + host + " -> " + ip);
        } catch (Exception e) {
            Log.e(TAG, "DNS resolve failed", e);
        }
    }).start();
}

}
