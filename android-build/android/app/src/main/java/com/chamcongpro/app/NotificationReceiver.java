package com.chamcongpro.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;

/**
 * NotificationReceiver — nhận alarm và hiển thị notification lên thanh thông báo.
 * Được AlarmManager gọi đúng giờ đã lên lịch.
 */
public class NotificationReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String title     = intent.getStringExtra("title");
        String body      = intent.getStringExtra("body");
        int    id        = intent.getIntExtra("id", 1);
        String channelId = intent.getStringExtra("channelId");
        if (channelId == null) channelId = "chamcongpro_main";

        // Đảm bảo channel tồn tại
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                channelId,
                "Chấm Công Pro",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Thông báo chấm công và nhắc ca làm việc");
            channel.enableVibration(true);
            channel.setShowBadge(true);
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }

        // Tạo notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title != null ? title : "Chấm Công Pro")
            .setContentText(body != null ? body : "")
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body != null ? body : ""))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setDefaults(NotificationCompat.DEFAULT_ALL);

        // Tap → mở app
        Intent launchIntent = context.getPackageManager()
            .getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
            PendingIntent pi = PendingIntent.getActivity(context, id, launchIntent, flags);
            builder.setContentIntent(pi);
        }

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(id, builder.build());

        // Xóa id khỏi SharedPreferences (đã fire rồi)
        try {
            android.content.SharedPreferences prefs = context.getSharedPreferences("cc_pending_notifs", Context.MODE_PRIVATE);
            java.util.Set<String> raw = new java.util.HashSet<>(prefs.getStringSet("pending_ids", new java.util.HashSet<>()));
            final int notifId = id;
            raw.removeIf(s -> {
                try { return new org.json.JSONObject(s).getInt("id") == notifId; }
                catch (Exception e) { return false; }
            });
            prefs.edit().putStringSet("pending_ids", raw).apply();
        } catch (Exception ignored) {}
    }
}
