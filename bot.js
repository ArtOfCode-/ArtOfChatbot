/***********************************
 * StackExchange Chatbot version 1.1.2
 * author: ArtOfCode
 * repo: https://github.com/ArtOfCode-/ArtOfChatbot
 ***********************************/

window.chatbot = {};

chatbot.utils = {};
chatbot.program = {};
chatbot.commands = {};

var utils = chatbot.utils;
var program = chatbot.program;
var commands = chatbot.commands;

// ================= COMMANDS ==================

commands.help = function(arguments, user) {
	var commandList = "";
	var commandKeys = Object.keys(commands.commandList);
	for(var i = 0; i < commandKeys.length; i++) {
		if(i == 0) {
			commandList += commandKeys[i];
		}
		else {
			commandList += ", " + commandKeys[i];
		}
	}
	utils.sendUserMessage(user, "Commands: " + commandList, utils.roomId);
}

commands.running = function(arguments, user) {
	utils.sendUserMessage(user, "Alive and kicking!", utils.roomId);
}

commands.lowQuality = function(arguments, user) {
	if(!arguments[1]) {
		utils.sendUserMessage(user, "Correct usage is /low-quality <sitename>", utils.roomId);
	}
	else {
		var url = "http://data.stackexchange.com/" + arguments[1].toLowerCase() + "/query/300384/possible-downvote-worthy-answers#resultSets";
		utils.sendUserMessage(user, "Low Quality posts data can be found [here](" + url + ").", utils.roomId);
	}
}

commands.findUser = function(arguments, user) {
	if(!arguments[1]) {
		utils.sendUserMessage(user, "Correct usage is '/find-user <id>'.", utils.roomId);
		return;
	}
	if(isNaN(arguments[1])) {
		utils.sendUserMessage(user, "Correct usage is '/find-user <id>'.", utils.roomId);
		return;
	}
	else {
		utils.sendUserMessage(user, "[User " + arguments[1] + "](http://worldbuilding.stackexchange.com/users/" + arguments[1] + ")", utils.roomId);
	}
}

commands.stop = function(arguments, user) {
	if(user !== "ArtOfCode" && user !== utils.initiatingUser) {
		utils.sendMessage("I'm sorry, @" + user + ". I can't let you do that.", utils.roomId);
		utils.sendMessage("If you want to shut me down, ping " + utils.initiatingUser + " to do it.", utils.roomId);
	}
	else {
		$("body").off("DOMNodeInserted");
		utils.sendUserMessage(user, utils.name + " shut down. To restart, run `chatbot.program.main()` from your console.", utils.roomId);
		utils.isRunning = false;
	}
}

commands.champagne = function(arguments, user) {
	utils.sendUserMessage(user, "Woooooo! *corks pop* Party!", utils.roomId);
}

commands.ban = function(arguments, user) {
	if(user !== "ArtOfCode" && user !== utils.initiatingUser) {
		utils.sendMessage("I'm sorry, @" + user + ". I can't let you do that.", utils.roomId);
		utils.sendMessage("Only " + utils.initiatingUser + " can ban users.", utils.roomId);
	}
	else {
		if(!arguments[1]) {
			utils.sendUserMessage(user, "Correct usage is '/ban <username>'.", utils.roomId);
			return;
		}
		utils.bannedUsers[arguments[1]] = true;
		utils.sendUserMessage(user, "Successfully revoked access for " + arguments[1] + ".", utils.roomId);
	}
}

commands.unban = function(arguments, user) {
	if(user !== "ArtOfCode" && user !== utils.initiatingUser) {
		utils.sendMessage("I'm sorry, @" + user + ". I can't let you do that.", utils.roomId);
		utils.sendMessage("Only " + utils.initiatingUser + " can unban users.", utils.roomId);
	}
	else {
		if(!arguments[1]) {
			utils.sendUserMessage(user, "Correct usage is '/unban <username>'.", utils.roomId);
			return;
		}
		utils.bannedUsers[arguments[1]] = false;
		utils.sendUserMessage(user, "Successfully granted access to " + arguments[1] + ".", utils.roomId);
	}
}

// NOTE: Must come AFTER the command declarations
commands.commandList = {
	"help": commands.help,
	"stop": commands.stop,
	"low-quality": commands.lowQuality,
	"find-user": commands.findUser,
	"champagne": commands.champagne,
	"running?": commands.running,
	"ban": commands.ban,
	"unban": commands.unban
};

// ================= UTILITIES =================

utils.roomId = "17213";
utils.initiatingUser = "";
utils.isRunning = false;
utils.name = "ArtOfChatbot";
utils.commandPrefix = "/";
utils.bannedUsers = {};

utils.debug = function(str) {
    var date = new Date().toTimeString().substring(0, 8);
    console.log("[" + date + "  " + str);
}

utils.sendMessage = function(text, id) {
	text = "[" + utils.name + "] " + text;
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
		utils.debug("Could not send, waiting 1500.");
		window.setTimeout(send, 1500);
	}
	send();
}

utils.sendUserMessage = function(user, text, id) {
	text = "@" + user + ": " + text;
	utils.sendMessage(text, id);
}

// ================== PROGRAM ==================

program.main = function() {
	utils.isRunning = true;
	
	var url = location.href;
	url = url.split("/");
	utils.roomId = isNaN(url[4]) ? "-1" : url[4];
	if(utils.roomId === "-1") {
		utils.debug("This URL doesn't appear to represent a valid StackExchange chatroom. Cannot run here.");
		return;
	}
	
	utils.initiatingUser = $(".user-container > .avatar > img").attr("alt");
	utils.debug(utils.name + " running, initiated by " + utils.initiatingUser);
	
	utils.sendMessage("**" + utils.name + " has been started!** Run 'help' for a list of commands.", utils.roomId);
	
	$("body").on("DOMNodeInserted", function(event) {
		if($(event.target).hasClass("message") && $(event.target).hasClass("neworedit")) {
			var signature = $(event.target).parent().siblings(".signature");
			var user = signature.children(".username").text();
			var message = $(event.target).children(".content").text();
			var messageId = $(event.target).attr("id").split("-")[1];
			program.handleNewMessage(message, user, messageId);
		}
	});
}

program.handleNewMessage = function(message, user, id) {
	utils.debug("Received message '" + message + "' from " + user);
	if(utils.bannedUsers[user]) {
		return;
	}
	if(message.startsWith(utils.commandPrefix)) {
		var commandName = message.split(" ")[0].substring(1);
		utils.debug("Starts with /, interpreting as command '" + commandName + "'.");
		try {
			commands.commandList[commandName](message.split(" "), user);
		}
		catch(e) {
			utils.sendUserMessage(user, "Invalid command - run 'help' for a list.", utils.roomId);
		}
	}
	if(message.indexOf("@Mods") > -1) {
		utils.sendMessage("@TimB/@MonicaCellio/@MichaelKjörling [you've been mod-pinged!](http://chat.stackexchange.com/transcript/message/" + id + "#" + id + ")", utils.roomId);
	}
}
