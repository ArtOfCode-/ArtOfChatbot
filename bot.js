window.chatbot = {};

chatbot.utils = {};
chatbot.program = {};
chatbot.commands = {};

// ================= COMMANDS ==================

chatbot.commands.help = function(arguments, user) {
	var commandList = "";
	var commandKeys = Object.keys(chatbot.commands.commandList);
	for(var i = 0; i < commandKeys.length; i++) {
		commandList += ", " + commandKeys[i];
	}
	chatbot.utils.sendUserMessage(user, "Commands: " + commandList, chatbot.utils.roomId);
}

chatbot.commands.running = function(arguments, user) {
	chatbot.utils.sendUserMessage(user, "Alive and kicking!", chatbot.utils.roomId);
}

chatbot.commands.lowQuality = function(arguments, user) {
	if(!arguments[1]) {
		chatbot.utils.sendUserMessage(user, "Correct usage is /low-quality <sitename>", chatbot.utils.roomId);
	}
	else {
		var url = "http://data.stackexchange.com/" + arguments[1].toLowerCase() + "/query/300384/possible-downvote-worthy-answers#resultSets";
		chatbot.utils.sendUserMessage(user, "Low Quality posts data can be found [here](" + url + ").", chatbot.utils.roomId);
	}
}

chatbot.commands.findUser = function(arguments, user) {
	chatbot.utils.sendUserMessage(user, "This feature has yet to be implemented.", chatbot.utils.roomId);
}

chatbot.commands.stop = function(arguments, user) {
	if(user !== "ArtOfCode" && user !== chatbot.utils.initiatingUser) {
		chatbot.utils.sendMessage("I'm sorry, @" + user + ". I can't let you do that.", chatbot.utils.roomId);
		chatbot.utils.sendMessage("If you want to shut me down, ping " + chatbot.utils.initiatingUser + " to do it.", chatbot.utils.roomId);
	}
	else {
		$("body").off("DOMNodeInserted");
		chatbot.utils.sendUserMessage(user, "ArtOfChatbot shut down. To restart, run `chatbot.program.main()` from your console.", chatbot.utils.roomId);
		chatbot.utils.isRunning = false;
	}
}

chatbot.commands.champagne = function(arguments, user) {
	chatbot.utils.sendUserMessage(user, "Woooooo! *corks pop* Party!", chatbot.utils.roomId);
}

// NOTE: Must come AFTER the command declarations
chatbot.commands.commandList = {
	"help": chatbot.commands.help,
	"stop": chatbot.commands.stop,
	"low-quality": chatbot.commands.lowQuality,
	"find-user": chatbot.commands.findUser,
	"champagne": chatbot.commands.champagne,
	"running?": chatbot.commands.running
};

// ================= UTILITIES =================

chatbot.utils.roomId = "17213";
chatbot.utils.initiatingUser = "";
chatbot.utils.isRunning = false;

chatbot.utils.debug = function(str) {
    var date = new Date().toTimeString().substring(0, 8);
    console.log("[" + date + " CHATBOT] " + str);
}

chatbot.utils.sendMessage = function(text, id) {
	text = "[" + chatbot.utils.name + "] " + text;
	function send() {
		$.ajax({
			"type": "POST",
			"url": "http://chat.stackexchange.com/chats/" + id + "/messages/new",
			"data": fkey({
				"text": text
			}),
			"dataType": "json",
			"error": error
		});
	}
	function error() {
		chatbot.utils.debug("Could not send, waiting 1500.");
		window.setTimeout(send, 1500);
	}
	send();
}

chatbot.utils.sendUserMessage = function(user, text, id) {
	text = "@" + user + ": " + text;
	chatbot.utils.sendMessage(text, id);
}

// ================== PROGRAM ==================

chatbot.program.main = function() {
	chatbot.utils.isRunning = true;
	
	var url = location.href;
	url = url.split("/");
	chatbot.utils.roomId = isNaN(url[4]) ? "-1" : url[4];
	if(chatbot.utils.roomId === "-1") {
		chatbot.utils.debug("This URL doesn't appear to represent a valid StackExchange chatroom. Chatbot cannot run here.");
		return;
	}
	
	chatbot.utils.initiatingUser = $(".user-container > .avatar > img").attr("alt");
	chatbot.utils.debug(chatbot.utils.name + " running, initiated by " + chatbot.utils.initiatingUser);
	
	chatbot.utils.sendMessage("**" + chatbot.utils.name + " has been started!** Run 'help' for a list of commands.", chatbot.utils.roomId);
	
	$("body").on("DOMNodeInserted", function(event) {
		if($(event.target).hasClass("message") && $(event.target).hasClass("neworedit")) {
			var signature = $(event.target).parent().siblings(".signature");
			var user = signature.children(".username").text();
			var message = $(event.target).children(".content").text();
			chatbot.program.handleNewMessage(message, user);
		}
	});
}

chatbot.program.handleNewMessage = function(message, user) {
	chatbot.utils.debug("Recieved message '" + message + "' from " + user);
	if(message.startsWith("/")) {
		var commandName = message.split(" ")[0].substring(1);
		chatbot.utils.debug("Starts with /, interpreting as command '" + commandName + "'.");
		try {
			chatbot.commands.commandList[commandName](message.split(" "), user);
		}
		catch(e) {
			chatbot.utils.sendUserMessage(user, "Invalid command - run 'help' for a list.", chatbot.utils.roomId);
		}
	}
}
