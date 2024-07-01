import * as Discord from "discord.js";
import { revive_process } from "../command_parts/revive.js";
import config from "../configs/config.json" with { type: "json" };
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("vc")
        .setDescription("Start a voice chat!")
        .addStringOption((option) => option
        .setName("message")
        .setDescription("The message to include with the VC ping"))
        .addStringOption((option) => option
        .setName("embed_title_override")
        .setDescription("Override the randomly-picked embed title (boosters only)"))
        .addStringOption((option) => option
        .setName("embed_color_override")
        .setDescription("Override the randomly-picked embed color (boosters only)")),
    run: async function (interaction) {
        if (interaction.channelId !== config.server.channels.chat) {
            interaction.editReply(`This command only works in <#${config.server.channels.chat}>! (  •̀ ᴖ •́  )`);
            return;
        }
        else {
            const voice_role = interaction.guild.roles.resolve(config.server.roles.pings.vc);
            const member = interaction.member;
            const message = interaction.options.getString("message");
            const embed_title_override = interaction.options.getString("embed_title_override");
            const embed_color_override = interaction.options.getString("embed_color_override");
            const boosting = member.premiumSince ? true : false;
            await revive_process(interaction, {
                role_to_ping: voice_role,
                revive_message: message,
                embed_title_override: embed_title_override,
                embed_color_override: embed_color_override,
                channel: interaction.channel,
                boosting: boosting,
            });
        }
    },
    options: {
        server_cooldown: 3 * 60 * 60 * 1000,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvdmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sTUFBTSxNQUFNLHdCQUF3QixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BFLGVBQWU7SUFDYixJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7U0FDcEMsT0FBTyxDQUFDLElBQUksQ0FBQztTQUNiLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQztTQUNyQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFNBQVMsQ0FBQztTQUNsQixjQUFjLENBQUMseUNBQXlDLENBQUMsQ0FDN0Q7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLHNCQUFzQixDQUFDO1NBQy9CLGNBQWMsQ0FDYiwwREFBMEQsQ0FDM0QsQ0FDSjtTQUNBLGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsc0JBQXNCLENBQUM7U0FDL0IsY0FBYyxDQUNiLDBEQUEwRCxDQUMzRCxDQUNKO0lBQ0gsR0FBRyxFQUFFLEtBQUssV0FBVyxXQUFnRDtRQUNuRSxJQUFJLFdBQVcsQ0FBQyxTQUFTLEtBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUQsV0FBVyxDQUFDLFNBQVMsQ0FDbkIsZ0NBQWdDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksa0JBQWtCLENBQzlFLENBQUM7WUFDRixPQUFPO1FBQ1QsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQzdCLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBNkIsQ0FBQztZQUN6RCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6RCxNQUFNLG9CQUFvQixHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUN4RCxzQkFBc0IsQ0FDdkIsQ0FBQztZQUNGLE1BQU0sb0JBQW9CLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQ3hELHNCQUFzQixDQUN2QixDQUFDO1lBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDcEQsTUFBTSxjQUFjLENBQUMsV0FBVyxFQUFFO2dCQUNoQyxZQUFZLEVBQUUsVUFBVTtnQkFDeEIsY0FBYyxFQUFFLE9BQU87Z0JBQ3ZCLG9CQUFvQixFQUFFLG9CQUFvQjtnQkFDMUMsb0JBQW9CLEVBQUUsb0JBQW9CO2dCQUMxQyxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQThCO2dCQUNuRCxRQUFRLEVBQUUsUUFBUTthQUNuQixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sRUFBRTtRQUNQLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJO0tBQ3BDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgcmV2aXZlX3Byb2Nlc3MgfSBmcm9tIFwiLi4vY29tbWFuZF9wYXJ0cy9yZXZpdmUuanNcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlncy9jb25maWcuanNvblwiIGFzc2VydCB7IHR5cGU6IFwianNvblwiIH07XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwidmNcIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIlN0YXJ0IGEgdm9pY2UgY2hhdCFcIilcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJtZXNzYWdlXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIG1lc3NhZ2UgdG8gaW5jbHVkZSB3aXRoIHRoZSBWQyBwaW5nXCIpXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiZW1iZWRfdGl0bGVfb3ZlcnJpZGVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIk92ZXJyaWRlIHRoZSByYW5kb21seS1waWNrZWQgZW1iZWQgdGl0bGUgKGJvb3N0ZXJzIG9ubHkpXCJcclxuICAgICAgICApXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiZW1iZWRfY29sb3Jfb3ZlcnJpZGVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIk92ZXJyaWRlIHRoZSByYW5kb21seS1waWNrZWQgZW1iZWQgY29sb3IgKGJvb3N0ZXJzIG9ubHkpXCJcclxuICAgICAgICApXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgaWYgKGludGVyYWN0aW9uLmNoYW5uZWxJZCAhPT0gY29uZmlnLnNlcnZlci5jaGFubmVscy5jaGF0KSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcclxuICAgICAgICBgVGhpcyBjb21tYW5kIG9ubHkgd29ya3MgaW4gPCMke2NvbmZpZy5zZXJ2ZXIuY2hhbm5lbHMuY2hhdH0+ISAoICDigKLMgCDhtJYg4oCizIEgIClgXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHZvaWNlX3JvbGUgPSBpbnRlcmFjdGlvbi5ndWlsZC5yb2xlcy5yZXNvbHZlKFxyXG4gICAgICAgIGNvbmZpZy5zZXJ2ZXIucm9sZXMucGluZ3MudmNcclxuICAgICAgKTtcclxuICAgICAgY29uc3QgbWVtYmVyID0gaW50ZXJhY3Rpb24ubWVtYmVyIGFzIERpc2NvcmQuR3VpbGRNZW1iZXI7XHJcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcIm1lc3NhZ2VcIik7XHJcbiAgICAgIGNvbnN0IGVtYmVkX3RpdGxlX292ZXJyaWRlID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXHJcbiAgICAgICAgXCJlbWJlZF90aXRsZV9vdmVycmlkZVwiXHJcbiAgICAgICk7XHJcbiAgICAgIGNvbnN0IGVtYmVkX2NvbG9yX292ZXJyaWRlID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXHJcbiAgICAgICAgXCJlbWJlZF9jb2xvcl9vdmVycmlkZVwiXHJcbiAgICAgICk7XHJcbiAgICAgIGNvbnN0IGJvb3N0aW5nID0gbWVtYmVyLnByZW1pdW1TaW5jZSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgYXdhaXQgcmV2aXZlX3Byb2Nlc3MoaW50ZXJhY3Rpb24sIHtcclxuICAgICAgICByb2xlX3RvX3Bpbmc6IHZvaWNlX3JvbGUsXHJcbiAgICAgICAgcmV2aXZlX21lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgZW1iZWRfdGl0bGVfb3ZlcnJpZGU6IGVtYmVkX3RpdGxlX292ZXJyaWRlLFxyXG4gICAgICAgIGVtYmVkX2NvbG9yX292ZXJyaWRlOiBlbWJlZF9jb2xvcl9vdmVycmlkZSxcclxuICAgICAgICBjaGFubmVsOiBpbnRlcmFjdGlvbi5jaGFubmVsIGFzIERpc2NvcmQuVGV4dENoYW5uZWwsXHJcbiAgICAgICAgYm9vc3Rpbmc6IGJvb3N0aW5nLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMyAqIDYwICogNjAgKiAxMDAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==