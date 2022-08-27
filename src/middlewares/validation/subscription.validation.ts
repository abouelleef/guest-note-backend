
import { body } from "express-validator";
import { validator } from "./validator";


const v = {
    endpoint: 'https://wns2-par02p.notify.windows.com/w/?token=BQYAAAAxmpfriRrRw0I6KzV78KAN0rN3szeWFX599bLh3ZCJHWOh5XGkE4A5kJFi64wn6wrsIuV6LX2PJWCr7HFGGmCfg0C%2bMjoNHZFA7vpIugo7cnWWPJdDH16AhJ5vaeTIRFj0MkLARsOzipK9jxsMGUb30fc8859B1Qr4kVJx487Ws%2blifRPNZvQF6NWy2p7iMDNyh%2fGrgNqDP7pD4uKqegCDvYCbkSc1v4GLl62SZVtdrP2KDmoF7yYKofAyzTRVUqEZvkwqzQHs6U%2fztjXFzcyBLwN2HCTY0fjR5ezDZgGozbrslz%2bsiAxVBII7Lq0ZdIc%3d',
    expirationTime: null,
    keys: {
        p256dh: 'BF7AB6yUtj8Xn7_woOPhRNfq9xLlE0Pq0vnvB5ASV5xTsbpHxnlc827Dubeyk3_-h-OhqDzjAe25xeLltHqGZcA',
        auth: 'MJQ2z3uSOUEmicG6-74HYQ'
    }
}

export const subscriptionValidation = [

    body("endpoint")
        .isString()
        .withMessage("endpoint can not be empty"),

    body("expirationTime")
        .exists()
        .withMessage("expirationTime does not exist"),

    body("keys.p256dh")
        .isString()
        .withMessage("p256dh can not be empty"),

    body("keys.auth")
        .isString()
        .withMessage("auth can not be empty"),



    validator,
];


