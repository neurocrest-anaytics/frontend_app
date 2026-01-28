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
<<<<<<< HEAD
                String host = "paper-trading-backend-sqllite.onrender.com";
=======

                String host = "paper-trading-backend-sqllite.onrender.com";

                String host = "paper-trading-backend-sqllite.onrender.com";

>>>>>>> 6c42a83969e64dded0190e1fc5cbd41fda1a4d53
                String ip = java.net.InetAddress.getByName(host).getHostAddress();
                Log.d(TAG, "Resolved " + host + " -> " + ip);
            } catch (Exception e) {
                Log.e(TAG, "DNS resolve failed", e);
            }
        }).start();
    }
}
