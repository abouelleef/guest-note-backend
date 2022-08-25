const webpush = require("web-push")

const WEB_PUSH_EMAIL = "user@example.com"
const WEB_PUSH_PRIVATE_KEY = "lxy4usUIWUspQP5NpiD4FbyxqkxK1REJbRjNIZ3MvyE"
const WEB_PUSH_PUBLIC_KEY = "BFeeDO0coCh44w6d_XWtm-JmqfdPWMf2M1hW1c9T0bXlG7OydMF1Zt_hyFLmwGX4uq_7ylAkx5262zVcDLLez2E"


const vapidKeys = {
    publicKey: WEB_PUSH_PUBLIC_KEY,
    privateKey: WEB_PUSH_PRIVATE_KEY,
}

webpush.setVapidDetails(
    `mailto:${WEB_PUSH_EMAIL}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const pushSubscription =
{
    endpoint: "https://fcm.googleapis.com/fcm/send/d0kZJ8bWalU:APA91bGnsRmhkqyC2de1JJE0mO4aRLsVpwjwAbFSXHGrJn005J1d5kw4XDgIi4TIl_bN89STWOPNV-kmO8QwUl3kmZCLM-9rconWAbK6S19x3xAs6TZgYnElqv1yJHKWkPNvwfAAEF8J",
    expirationTime: null,
    keys: {
        p256dh: "BL2gIM2Z274IvnJo4n4LJnUGuRPpQU3qmwiOZWojhip8Ig1f9pACZOzM5wMEL_Znm5LWXlufuaxRNucrFlEWoDY",
        auth: "83Uvne7Eyl9U9j3W212aMA"
    }
}
webpush.sendNotification(pushSubscription, JSON.stringify({ message: 'Your Push Payload Text' }));