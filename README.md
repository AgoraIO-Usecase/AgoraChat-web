# Agora chat demo (WEB)

This repository contains the sample project using the Agora Chat Web UI KIT.

With this sample project, you can:

1. Log in to the chat server.
2. Start a chat conversation.
3. Manage the conversation list.
4. Add friends.
5. Join group chats.
6. Add your friends to your blacklist.
7. Send various types of messages, Such as: text, expression, picture, voice, file and so on.
8. Recall a message.
9. Log out of the chat server.

## Update Note
In chat page add third-party emoji support.
## Useage
Demo use two third-party services.
1. [Stipop Doc:](https://docs.stipop.io/en).
2. [Giphy Doc:](https://developers.giphy.com/).

````javascript
// src/utils/config.js
const giphyAppKey =  '*****' // ***** youself AppKey
const stipopAppKey = '*****'

export {
  giphyAppKey,
  stipopAppKey
}
````
## Running the App
``` bash
# Install dependency.
npm install
# Run in dev mode.
HTTPS=true npm start
# generate dist
npm run build
```

## Contact Us
- You can find the complete API document at [Document Center](https://hyphenateinc.github.io/web_product_overview.html).
- You can file bugs about this demo a[issue](https://github.com/AgoraIO-Usecase/AgoraChat-web/issues).

## License
The MIT License (MIT).


