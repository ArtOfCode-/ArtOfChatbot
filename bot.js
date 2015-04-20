var chatbot = {};

chatbot.utils = {};
chatbot.program = {};
chatbot.commands = {};

// ================= COMMANDS ==================

chatbot.commands.help = function(arguments, user) {
	chatbot.utils.sendUserMessage(user, "Commands: help, low-quality, find-user", chatbot.utils.roomId);
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
	chatbot.utils.sendUserMessage(user, "This command is on the way - wait for ArtOfCode to implement it.", chatbot.utils.roomId);
}

chatbot.commands.stop = function(arguments, user) {
	if(user !== "ArtOfCode") {
		chatbot.utils.sendMessage("I'm sorry, @" + user + ". I can't let you do that.", chatbot.utils.roomId);
		chatbot.utils.sendMessage("If you want to shut me down, ping ArtOfCode to do it.", chatbot.utils.roomId);
	}
	else {
		$("body").off("DOMNodeInserted");
		chatbot.utils.sendUserMessage(user, "ArtOfChatbot shut down. To restart, run `chatbot.program.main()` from your console.", chatbot.utils.roomId);
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
	"champagne": chatbot.commands.champagne
};

// ================= UTILITIES =================

chatbot.utils.roomId = "17213";

chatbot.utils.injectDependency = function(url, callback) {
    var validator = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    var scriptElement = document.createElement("script");
    scriptElement.src = url.match(validator) ? url : "";
    scriptElement.addEventListener("load", function() {
        callback();
    });
    document.body.appendChild(scriptElement);
}

chatbot.utils.debug = function(str) {
    var date = new Date().toTimeString().substring(0, 8);
    console.log("[" + date + " CHATBOT] " + str);
}

chatbot.utils.sendMessage = function(text, id) {
	text = "[Chatbot] " + text;
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
		chatbot.utils.debug("Could not send, waiting 1000.");
		window.setTimeout(send, 1000);
	}
	send();
}

chatbot.utils.sendUserMessage = function(user, text, id) {
	text = "@" + user + ": " + text;
	chatbot.utils.sendMessage(text, id);
}

chatbot.utils.parseLowQualityResults = function(data) {
	var message = "";
	$("<div/>").hide().html(data);
	var rows = $(".slick-row");
	rows.each(function(index, element) {
		if(index < 5) {
			var cells = $(this).children(".slick-cell");
			message += "[#" + (index + 1) + "](" + cells[0].children("a").attr("href") + "), ";
			message += " length: " + cells[1].text() + ", ";
			message += " score: " + cells[3].text() + "; ";
		}
		else {
			return message;
		}
	});
}

// ================== PROGRAM ==================

chatbot.program.main = function() {
    chatbot.utils.roomId = prompt("Enter this room's ID (can be found in the URL):");
	if(isNaN(chatbot.utils.roomId)) {
		alert("Invalid room ID entered. Exiting. Run 'chatbot.program.main()' from the console to restart.");
		return;
	}
	else {
		chatbot.utils.debug("ArtOfChatbot running. Run 'help' for a list of commands.");
	}
	
	chatbot.utils.sendMessage("ArtOfChatbot has been started! Run 'help' for a list of commands.", chatbot.utils.roomId);
	
	$("body").on("DOMNodeInserted", function(elem) {
		if($(elem.target).hasClass("message") && $(elem.target).hasClass("neworedit")) {
			var signature = $(elem.target).parent().siblings(".signature");
			var user = signature.children(".username").text();
			var message = $(elem.target).children(".content").text();
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

// ================== RUNTIME ==================

chatbot.program.main();
