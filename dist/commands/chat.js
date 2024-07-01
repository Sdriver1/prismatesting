import * as Discord from "discord.js";
import { revive_process } from "../command_parts/revive.js";
import config from "../configs/config.json" with { type: "json" };
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("chat")
        .setDescription("Start a text chat!")
        .addStringOption((option) => option
        .setName("message")
        .setDescription("The message to include with the revive ping"))
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
            const revive_role = interaction.guild.roles.resolve(config.server.roles.pings.revive);
            const member = interaction.member;
            const message = interaction.options.getString("message");
            const embed_title_override = interaction.options.getString("embed_title_override");
            const embed_color_override = interaction.options.getString("embed_color_override");
            const boosting = member.premiumSince ? true : false;
            await revive_process(interaction, {
                role_to_ping: revive_role,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9jaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxPQUFPLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLE1BQU0sTUFBTSx3QkFBd0IsQ0FBQyxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUNwRSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDZixjQUFjLENBQUMsb0JBQW9CLENBQUM7U0FDcEMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDbEIsY0FBYyxDQUFDLDZDQUE2QyxDQUFDLENBQ2pFO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztTQUMvQixjQUFjLENBQ2IsMERBQTBELENBQzNELENBQ0o7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLHNCQUFzQixDQUFDO1NBQy9CLGNBQWMsQ0FDYiwwREFBMEQsQ0FDM0QsQ0FDSjtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsSUFBSSxXQUFXLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzFELFdBQVcsQ0FBQyxTQUFTLENBQ25CLGdDQUFnQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGtCQUFrQixDQUM5RSxDQUFDO1lBQ0YsT0FBTztRQUNULENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUNqRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUNqQyxDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQTZCLENBQUM7WUFDekQsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekQsTUFBTSxvQkFBb0IsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FDeEQsc0JBQXNCLENBQ3ZCLENBQUM7WUFDRixNQUFNLG9CQUFvQixHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUN4RCxzQkFBc0IsQ0FDdkIsQ0FBQztZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3BELE1BQU0sY0FBYyxDQUFDLFdBQVcsRUFBRTtnQkFDaEMsWUFBWSxFQUFFLFdBQVc7Z0JBQ3pCLGNBQWMsRUFBRSxPQUFPO2dCQUN2QixvQkFBb0IsRUFBRSxvQkFBb0I7Z0JBQzFDLG9CQUFvQixFQUFFLG9CQUFvQjtnQkFDMUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUE4QjtnQkFDbkQsUUFBUSxFQUFFLFFBQVE7YUFDbkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSTtLQUNwQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IHJldml2ZV9wcm9jZXNzIH0gZnJvbSBcIi4uL2NvbW1hbmRfcGFydHMvcmV2aXZlLmpzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcImNoYXRcIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIlN0YXJ0IGEgdGV4dCBjaGF0IVwiKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcIm1lc3NhZ2VcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgbWVzc2FnZSB0byBpbmNsdWRlIHdpdGggdGhlIHJldml2ZSBwaW5nXCIpXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiZW1iZWRfdGl0bGVfb3ZlcnJpZGVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIk92ZXJyaWRlIHRoZSByYW5kb21seS1waWNrZWQgZW1iZWQgdGl0bGUgKGJvb3N0ZXJzIG9ubHkpXCJcclxuICAgICAgICApXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiZW1iZWRfY29sb3Jfb3ZlcnJpZGVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIk92ZXJyaWRlIHRoZSByYW5kb21seS1waWNrZWQgZW1iZWQgY29sb3IgKGJvb3N0ZXJzIG9ubHkpXCJcclxuICAgICAgICApXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgaWYgKGludGVyYWN0aW9uLmNoYW5uZWxJZCAhPT0gY29uZmlnLnNlcnZlci5jaGFubmVscy5jaGF0KSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcclxuICAgICAgICBgVGhpcyBjb21tYW5kIG9ubHkgd29ya3MgaW4gPCMke2NvbmZpZy5zZXJ2ZXIuY2hhbm5lbHMuY2hhdH0+ISAoICDigKLMgCDhtJYg4oCizIEgIClgXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHJldml2ZV9yb2xlID0gaW50ZXJhY3Rpb24uZ3VpbGQucm9sZXMucmVzb2x2ZShcclxuICAgICAgICBjb25maWcuc2VydmVyLnJvbGVzLnBpbmdzLnJldml2ZVxyXG4gICAgICApO1xyXG4gICAgICBjb25zdCBtZW1iZXIgPSBpbnRlcmFjdGlvbi5tZW1iZXIgYXMgRGlzY29yZC5HdWlsZE1lbWJlcjtcclxuICAgICAgY29uc3QgbWVzc2FnZSA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwibWVzc2FnZVwiKTtcclxuICAgICAgY29uc3QgZW1iZWRfdGl0bGVfb3ZlcnJpZGUgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcclxuICAgICAgICBcImVtYmVkX3RpdGxlX292ZXJyaWRlXCJcclxuICAgICAgKTtcclxuICAgICAgY29uc3QgZW1iZWRfY29sb3Jfb3ZlcnJpZGUgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcclxuICAgICAgICBcImVtYmVkX2NvbG9yX292ZXJyaWRlXCJcclxuICAgICAgKTtcclxuICAgICAgY29uc3QgYm9vc3RpbmcgPSBtZW1iZXIucHJlbWl1bVNpbmNlID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICBhd2FpdCByZXZpdmVfcHJvY2VzcyhpbnRlcmFjdGlvbiwge1xyXG4gICAgICAgIHJvbGVfdG9fcGluZzogcmV2aXZlX3JvbGUsXHJcbiAgICAgICAgcmV2aXZlX21lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgZW1iZWRfdGl0bGVfb3ZlcnJpZGU6IGVtYmVkX3RpdGxlX292ZXJyaWRlLFxyXG4gICAgICAgIGVtYmVkX2NvbG9yX292ZXJyaWRlOiBlbWJlZF9jb2xvcl9vdmVycmlkZSxcclxuICAgICAgICBjaGFubmVsOiBpbnRlcmFjdGlvbi5jaGFubmVsIGFzIERpc2NvcmQuVGV4dENoYW5uZWwsXHJcbiAgICAgICAgYm9vc3Rpbmc6IGJvb3N0aW5nLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMyAqIDYwICogNjAgKiAxMDAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==