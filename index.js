﻿// Calling the package
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const ms = require("ms"); // npm install ms -
const prefix = '`' // The text before commands

const commands1 = {
	purge: {
		usage: prefix + "purge (num)",
		description: `Delete some messages.`
	},
	botinfo: {
		usage: prefix + "botinfo",
		description: `Get info on the bot.`
	},
	serverinfo: {
		usage: prefix + "serverinfo",
		description: `Get info on the server.`
	},
	member: {
		usage: prefix + "member (@member)",
		description: `Get info on a member.`
	},
	roleinfo: {
		usage: prefix + "roleinfo (@role)",
		description: `Get info on a role.`
	},
};
// Listener Event: Bot Launched
bot.on('ready', () => {
    console.log('Power Level Stabilised.') // Runs when the bot is launched

    //const botchat = bot.channels.get("469992574791319552")
    //const generalchat = bot.channels.get("469490700845580298")
    //generalchat.send(`Topic of the week: `)
    
    
    bot.user.setActivity("prefix " + prefix + " | Blocks Awakens") // Diff per bot

});


// Event listener: Message Received ( This will run every time a message is received)
bot.on('message', async message => {
    // Variables
    let sender = message.author; // The person who sent the message
    let msg = message.content.toLowerCase();
    if (bot.user.id === sender.id) { return }
    let nick = sender.username
    let Owner = message.guild.roles.find('name', "Owner")    
    let Staff = message.guild.roles.find('name', "Staff")
    let PlayerRole = message.guild.roles.find('name', "Player")
    
    // commands

     if(msg.split(' ')[0] === prefix + 'help'){
	console.log('HELP INITIATED!')
      	let args = msg.split(" ").slice(1);
	console.log(args[0])
	
	if(!args[0]){
		let embed = new Discord.RichEmbed()
		.setDescription("All available commands")
		.setColor(0x00fff3)
		for(var name in commands1){
			embed.addField("Command:", name)
		}
		await message.channel.send(embed)
		return await message.channel.send("For info on a specific command, do " + prefix + "help (command)")
	}
	for(var name in commands1){
		if(args[0] === name){
			var commandname = name;
			let embed = new Discord.RichEmbed()
			.setDescription(name)
			.setColor(0x00fff3)
			.addField("Usage:", commands1[commandname].usage)
			.addField("Description:", commands1[commandname].description)
			return await message.channel.send(embed)
		}
    	}
	if(args[0]) return message.channel.send("Hm, check your spelling and try again!");
    };
	
    // Ping / Pong command
    if (msg === prefix + 'ping') {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong. Latency: ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
      } else {return}
    };

    // Delete msgs
    if (msg.split(" ")[0] === prefix + "purge"){
        if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
            let args = msg.split(" ").slice(1)
            let num = Number(args[0]);
            if (num > 100 || num < 2){
                return message.reply('Please enter a number between 2 and 100')
            }
            message.channel.bulkDelete(num).then(() => {
            message.channel.send("Deleted " + num + " messages.").then(msg => msg.delete(5300));
            });
        }else {return}
    };


    //bot info command
    if (msg === prefix + "botinfo") {
        let bicon = bot.user.displayAvatarURL

        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor(0x15f153)
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Created At", bot.user.createdAt)

        message.channel.send(botembed)
    };


    //serverinfo command
    if (msg === prefix + "serverinfo") {
      let sicon = message.guild.iconURL
        
        let serverembed = new Discord.RichEmbed()
        .setDescription("__**Server Information**__")
        .setColor(0x15f153)
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("Total Members", message.guild.memberCount)
        .addField("Emoji", message.guild.emojis + "*work in progress*")

        await message.channel.send(serverembed)

    };


    //member info
    if (msg.split(" ")[0] === prefix + "member") {
      //ex `member @Rinkky
      let args = msg.split(" ").slice(1)
      let rMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let micon = rMember.displayAvatarURL

        if(!rMember) 
          return message.reply("Who dat user? I dunno him.")

          let memberembed = new Discord.RichEmbed()
          .setDescription("__**Member Information**__")
          .setColor(0x15f153)
          .setThumbnail(micon)
          .addField("Name", rMember)
          .addField("ID", rMember.id)
          .addField("Joined at", rMember.joinedAt)
  
          await message.channel.send(memberembed)

    };


    //role info
    if (msg.split(" ")[0] === prefix + "roleinfo") {
          //ex `roleinfo @owner
          //let args = msg.split(" ").slice(1)
          let rRole = message.mentions.roles.first()
          if(!rRole) return message.reply("Who dat role? I cant find it.")
          var rmembers = message.guild.roles.get(rRole.id).members.map(m=>m.user.tag)
          var numMembers = rmembers.length
          if(numMembers == 0) {
           let roleembed = new Discord.RichEmbed()
          .setDescription("__**Role Information**__")
          .setColor(0x15f153)
          .addField("Name", rRole)
          .addField("ID", rRole.id)
          .addField(`Members with this role (${numMembers}):`, "None");
          await message.channel.send(roleembed) 
          }
          let roleembed = new Discord.RichEmbed()
          .setDescription("__**Role Information**__")
          .setColor(0x15f153)
          .addField("Name", rRole)
          .addField("ID", rRole.id)
          .addField(`Members with this role (${numMembers}):`, rmembers.join('\n'));
          await message.channel.send(roleembed) 
    };
	
      //DM forwarding - draft
      if (message.channel.type == 'dm'){ //checks for DM
        let dmName = `${nick}DM`
        staffchat = member.guild.channels.find('name', 'staff');

        message.staffchat.send({embed: { //forwards DM to staff chat
          color: 0xff0000,
          title: "DM Forwarded" ,
         description: dm.content ,
         timestamp: new Date(),
          footer: {
          icon_url: sender.avatarURL,
          text: `by ${dmName}`
          }
        }})
      };


    //stopping the bot
    if (msg === prefix + 'stop') {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
        process.exit(1)
      } else {return}
    };

}); //the end of bot.on ------------------------------


/*one time event function
  function onetime(node, type, callback) {
    //create event
    node.addEventListener(type, function(e) {
      //remove event
      e.target.removeEventListener(e, type, arguments.callee)
        //call gandler
        return callback(e)
    })
  } draaaaaft*/

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}


//  Login

// the bot.token('token')
bot.login(process.env.token);
