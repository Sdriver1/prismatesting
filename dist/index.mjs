import "dotenv/config";
import { client } from "./startup/client.js";
import { ready } from "./events/ready.js";
import { interactionCreate } from "./events/interactionCreate.js";
import { messageCreate } from "./events/messageCreate.js";
import { guildCreate } from "./events/guildCreate.js";
import { guildBanAdd } from "./events/guildBanAdd.js";
import { guildMemberRemove } from "./events/guildMemberRemove.js";
import { guildMemberUpdate } from "./events/guildMemberUpdate.js";
import config from "./configs/config.json" with { type: "json" };
console.log("Loading Star...");
client.once("ready", ready);
client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand())
            await interaction.deferReply({ ephemeral: true });
        await interactionCreate(interaction);
    }
    catch (err) {
        interaction.channel.send("**Sorry I didn't reply!** You're probably seeing this because I just restarted, so wait 15 minutes and try again.");
        return;
    }
});
client.on("messageCreate", (message) => messageCreate(message));
client.on("guildCreate", (guild) => guildCreate(guild));
client.on("guildBanAdd", (ban) => guildBanAdd(ban));
client.on("guildMemberRemove", (member) => guildMemberRemove(member));
client.on("guildMemberUpdate", (oldMember, newMember) => guildMemberUpdate(oldMember, newMember));
await client.login(config.bot.token);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVsRSxPQUFPLE1BQU0sTUFBTSx1QkFBdUIsQ0FBQyxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUVuRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUU7SUFDbkQsSUFBSSxDQUFDO1FBQ0gsSUFBSSxXQUFXLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxXQUFXLENBQUMsb0JBQW9CLEVBQUU7WUFDeEUsTUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEQsTUFBTSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUN0QixtSEFBbUgsQ0FDcEgsQ0FBQztRQUNGLE9BQU87SUFDVCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hELE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwRCxNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDeEMsaUJBQWlCLENBQUMsTUFBcUIsQ0FBQyxDQUN6QyxDQUFDO0FBQ0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUN0RCxpQkFBaUIsQ0FBQyxTQUF3QixFQUFFLFNBQVMsQ0FBQyxDQUN2RCxDQUFDO0FBRUYsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJkb3RlbnYvY29uZmlnXCI7XHJcblxyXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tIFwiLi9zdGFydHVwL2NsaWVudC5qc1wiO1xyXG5pbXBvcnQgeyByZWFkeSB9IGZyb20gXCIuL2V2ZW50cy9yZWFkeS5qc1wiO1xyXG5pbXBvcnQgeyBpbnRlcmFjdGlvbkNyZWF0ZSB9IGZyb20gXCIuL2V2ZW50cy9pbnRlcmFjdGlvbkNyZWF0ZS5qc1wiO1xyXG5pbXBvcnQgeyBtZXNzYWdlQ3JlYXRlIH0gZnJvbSBcIi4vZXZlbnRzL21lc3NhZ2VDcmVhdGUuanNcIjtcclxuaW1wb3J0IHsgZ3VpbGRDcmVhdGUgfSBmcm9tIFwiLi9ldmVudHMvZ3VpbGRDcmVhdGUuanNcIjtcclxuaW1wb3J0IHsgZ3VpbGRCYW5BZGQgfSBmcm9tIFwiLi9ldmVudHMvZ3VpbGRCYW5BZGQuanNcIjtcclxuaW1wb3J0IHsgZ3VpbGRNZW1iZXJSZW1vdmUgfSBmcm9tIFwiLi9ldmVudHMvZ3VpbGRNZW1iZXJSZW1vdmUuanNcIjtcclxuaW1wb3J0IHsgZ3VpbGRNZW1iZXJVcGRhdGUgfSBmcm9tIFwiLi9ldmVudHMvZ3VpbGRNZW1iZXJVcGRhdGUuanNcIjtcclxuaW1wb3J0IHsgR3VpbGRNZW1iZXIgfSBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5cclxuY29uc29sZS5sb2coXCJMb2FkaW5nIFN0YXIuLi5cIik7XHJcblxyXG5jbGllbnQub25jZShcInJlYWR5XCIsIHJlYWR5KTtcclxuY2xpZW50Lm9uKFwiaW50ZXJhY3Rpb25DcmVhdGVcIiwgYXN5bmMgKGludGVyYWN0aW9uKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGlmIChpbnRlcmFjdGlvbi5pc0NoYXRJbnB1dENvbW1hbmQoKSB8fCBpbnRlcmFjdGlvbi5pc0NvbnRleHRNZW51Q29tbWFuZCgpKVxyXG4gICAgICBhd2FpdCBpbnRlcmFjdGlvbi5kZWZlclJlcGx5KHsgZXBoZW1lcmFsOiB0cnVlIH0pO1xyXG4gICAgYXdhaXQgaW50ZXJhY3Rpb25DcmVhdGUoaW50ZXJhY3Rpb24pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgaW50ZXJhY3Rpb24uY2hhbm5lbC5zZW5kKFxyXG4gICAgICBcIioqU29ycnkgSSBkaWRuJ3QgcmVwbHkhKiogWW91J3JlIHByb2JhYmx5IHNlZWluZyB0aGlzIGJlY2F1c2UgSSBqdXN0IHJlc3RhcnRlZCwgc28gd2FpdCAxNSBtaW51dGVzIGFuZCB0cnkgYWdhaW4uXCJcclxuICAgICk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG59KTtcclxuY2xpZW50Lm9uKFwibWVzc2FnZUNyZWF0ZVwiLCAobWVzc2FnZSkgPT4gbWVzc2FnZUNyZWF0ZShtZXNzYWdlKSk7XHJcbmNsaWVudC5vbihcImd1aWxkQ3JlYXRlXCIsIChndWlsZCkgPT4gZ3VpbGRDcmVhdGUoZ3VpbGQpKTtcclxuY2xpZW50Lm9uKFwiZ3VpbGRCYW5BZGRcIiwgKGJhbikgPT4gZ3VpbGRCYW5BZGQoYmFuKSk7XHJcbmNsaWVudC5vbihcImd1aWxkTWVtYmVyUmVtb3ZlXCIsIChtZW1iZXIpID0+XHJcbiAgZ3VpbGRNZW1iZXJSZW1vdmUobWVtYmVyIGFzIEd1aWxkTWVtYmVyKVxyXG4pO1xyXG5jbGllbnQub24oXCJndWlsZE1lbWJlclVwZGF0ZVwiLCAob2xkTWVtYmVyLCBuZXdNZW1iZXIpID0+XHJcbiAgZ3VpbGRNZW1iZXJVcGRhdGUob2xkTWVtYmVyIGFzIEd1aWxkTWVtYmVyLCBuZXdNZW1iZXIpXHJcbik7XHJcblxyXG5hd2FpdCBjbGllbnQubG9naW4oY29uZmlnLmJvdC50b2tlbik7XHJcbiJdfQ==