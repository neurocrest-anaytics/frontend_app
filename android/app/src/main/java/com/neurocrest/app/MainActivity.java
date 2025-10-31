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

        // Enable Chrome DevTools for the WebView (so you can see JS fetch/XHR requests)
        WebView.setWebContentsDebuggingEnabled(true);

        // Optional: quick native DNS test to confirm the emulator can resolve your backend host
        new Thread(() -> {
            try {
                String host = "https://paper-trading-backend-sqllite.onrender.com";
                String ip = java.net.InetAddress.getByName(host).getHostAddress();
                Log.d(TAG, "Resolved " + host + " -> " + ip);
            } catch (Exception e) {
                Log.e(TAG, "DNS resolve failed", e);
            }
        }).start();
    }
}
