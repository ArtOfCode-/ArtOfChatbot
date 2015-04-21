/* StackExchange Chat API version 1.0.0
 * author: ArtOfCode */

window.chatAPI = {};

chatAPI.injectDependency = function(url, callback) {
    var validator = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    var scriptElement = document.createElement("script");
    scriptElement.src = url.match(validator) ? url : "";
    scriptElement.addEventListener("load", function() {
        callback();
    });
    document.body.appendChild(scriptElement);
}

chatAPI.runChatbot = function() {
	if(!chatbot) {
		throw new Error("Chatbot JS must be loaded first.");
	}
	else {
		chatbot.program.main();
	}
}

chatAPI.setChatbotName = function(newName) {
	chatbot.utils.name = newName;
}

chatAPI.getChatbotName = function() {
	return chatbot.utils.name;
}

chatAPI.getActiveRoomId = function() {
	return chatbot.utils.roomId;
}

chatAPI.addChatbotCommand = function(name, action) {
	if(!chatbot) {
		throw new Error("Chatbot JS must be loaded first.");
	}
	else {
		if(typeof(action) === "function") {
			chatbot.commands.commandList[name] = action;
		}
		else {
			throw new TypeError("action must be an invocable function!");
		}
	}
}

chatAPI.sendMessage = function(messageText) {
	if(!chatbot || !chatbot.utils.isRunning) {
		throw new Error("Chatbot JS must be loaded and running first.");
	}
	else {
		chatbot.utils.sendMessage(messageText, chatbot.utils.roomId);
	}
}

chatAPI.injectDependency("https://raw.githubusercontent.com/ArtOfCode-/ArtOfChatbot/master/bot.js", function() {
	console.log("Chatbot JS is loaded.");
});
