import webpush from "web-push"
import { WEB_PUSH_EMAIL, WEB_PUSH_PRAIVATE_KEY, WEB_PUSH_PUBLIC_KEY } from './config'

const vapidKeys = {
    publicKey: WEB_PUSH_PUBLIC_KEY,
    privateKey: WEB_PUSH_PRAIVATE_KEY,
}

webpush.setVapidDetails(
    `mailto:${WEB_PUSH_EMAIL}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export default webpush

// const pushSubscription = {
//     endpoint: "https://wns2-par02p.notify.windows.com/w/?token=BQYAAADSHrUO%2fZGtj3ty1lnDwDV87VhKMNVoS7%2bVWYaOiBej%2fewNCAq5CQwLPG98swmceT5VpC6vQphvFOj5vk2DDeN5ZhJP1YCUUkl0FKOPRxzCt8OjwTRNLzn2YMvtWihmJz9SHzl8koinALrnko07QETiYgh1GtUaYXJtaQsWTcU6EFWnOs5CjXOzS4EAE2SLB8GvbNK3lzWG7Kdf%2bd8zBhzzhY%2blceTHi6L39I9k%2bbzidp%2bDJvhxSmn2uLGhPfsW050vE2CzyAwFgiLLfYXLbPhUSbC%2bQ7pJWC1GY%2b3bxjaFZ%2bHVhVed4ApSv8wZwR20lUyfH3Ch63itIcBsoxy8aBvv",
//     expirationTime: null,
//     keys: {
//         p256dh: "BGhTczAFIVo7do495VsGemzW8G8WVyZqoqgRDeK3QLkmBX-ZfNijcNQeRmIpKYqcb1Wrpu5jnM1kLBcbjUFj6lw",
//         auth: "vGtStkgxBvqZnwfyGk3Leg"
//     }
// }

// webpush.sendNotification(pushSubscription, JSON.stringify({ message: 'Your Push Payload Text' }));