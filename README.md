# ArtOfChatbot
Simple in-browser JavaScript StackExchange chatting

ArtOfChatbot is a two-part creation. The chat API is an easy way to create and run your own bots with custom commands (and soon to be custom-a-lot-of-other-things too). The bot is the code that the chatbot itself runs off.

## ChatAPI
The API can be found in the `chatapi.js` file. It's easy to use: copy the code into your browser's console and hit Enter when in a StackExchange chatroom. The API will load the necessary code for you to run your own bot. There are a few JS statements you will want to run to use your chatbot. These are listed in API Commands, below. I suggest you try out combinations of these, then save them all in one file when you've got a chatbot you're happy with, so you can just copy-paste them into the console.

## API Commands

**`chatAPI.addChatbotCommand(name, action)`** - this is the statement that will add a command to the chatbot. `name` is the command name. No need to include a forward slash as this is automatically added. `action` is a function that will be run when the command is found in chat. You can use `chatAPI.sendMessage(messageText)` to send messages within this function. It will be passed two parameters: `arguments` and `user`, where `arguments` is an array giving the arguments added to the command, and `user` is the username of the user who ran the command. Here's an example that pings back the argument of the command:

    chatAPI.addChatbotCommand("echo", function(arguments, user) {
        // arguments[0] is the command name. Arguments start at arguments[1].
	    if(arguments[1]) {
            chatAPI.sendMessage("@" + user + ": " + arguments[1]);
        }
    });
    
**`chatAPI.setChatbotName(newName)`** - sets the chatbot's name to `newName`. This name will be displayed on all chatbot messages.

**`chatAPI.getChatbotName()`** - returns the current name of the chatbot.

**`chatAPI.getActiveRoomId()`** - returns the ID of the chatroom the bot is posting to.

**`chatAPI.setCommandPrefix(newPrefix)`** - sets the string that all commands must be preceded by to be recognised.

**`chatAPI.getCommandPrefix()`** - returns the current command prefix.

**`chatAPI.sendMessage(messageText)`** - posts a message to the chatroom with the text of `messageText`.

**`chatAPI.runChatbot()`** - fairly self-explanatory. Runs the chatbot, i.e. starts it accepting commands and responding.

## Bot and License
The bot is not intended to be used directly, instead it is intended to be run in conjunction with the chat API. However, this work is under the [GNU GPL v3](https://www.gnu.org/copyleft/gpl.html) license; you are free to copy, modify, redistribute, sell on and share the work, under the condition that you credit me. **I ALSO IMPOSE** a Share-Alike type condition: any redistribution you make including this work MUST be licensed under the same license.
