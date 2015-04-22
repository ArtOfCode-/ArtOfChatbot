/***********************************
 * StackExchange Chat API version 1.0.0
 * author: ArtOfCode
 * repo: https://github.com/ArtOfCode-/ArtOfChatbot
 ***********************************/

window.chatAPI = {
	injectDependency: function(url, callback) {
		var validator = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
		var scriptElement = document.createElement("script");
		scriptElement.src = url.match(validator) ? url : "";
		scriptElement.setAttribute("type", "text/javascript");
		scriptElement.addEventListener("load", function() {
			callback();
		});
		document.body.appendChild(scriptElement);
	},

	runChatbot: function() {
		if(!chatbot) {
			throw new Error("Chatbot JS must be loaded first.");
		}
		else {
			chatbot.program.main();
		}
	},

	setChatbotName: function(newName) {
		chatbot.utils.name = newName;
	},

	getChatbotName: function() {
		return chatbot.utils.name;
	},

	getActiveRoomId: function() {
		return chatbot.utils.roomId;
	},

	addChatbotCommand: function(name, action) {
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
	},

	setCommandPrefix: function(newPrefix) {
		chatbot.utils.commandPrefix = newPrefix;
	},
	
	getCommandPrefix: function() {
		return chatbot.utils.commandPrefix;
	}

	sendMessage: function(messageText) {
		if(!chatbot || !chatbot.utils.isRunning) {
			throw new Error("Chatbot JS must be loaded and running first.");
		}
		else {
			chatbot.utils.sendMessage(messageText, chatbot.utils.roomId);
		}
	}
};

	chatAPI.injectDependency("http://jenkinsstuff.bl.ee/se.chat/api/bot.js", function() {
		console.log("Chatbot JS is loaded.");
	});
