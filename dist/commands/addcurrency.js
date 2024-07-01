import * as Discord from "discord.js";
import { add_currency } from "../currency/operations/arithmetic.js";
import { client } from "../startup/client.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("addcurrency")
        .setDescription("Generate currency & credit it to user")
        .addStringOption((option) => option
        .setName("currency")
        .setDescription("The currency to modify.")
        .setRequired(true))
        .addNumberOption((option) => option
        .setName("amount")
        .setDescription("The amount of currency to add. Specify a negative number to remove currency.")
        .setRequired(true))
        .addUserOption((option) => option
        .setName("target_user")
        .setDescription("The user whose currency to modify"))
        .addRoleOption((option) => option
        .setName("target_role")
        .setDescription("The role whose members will each get the full amount specified in this command"))
        .addStringOption((option) => option
        .setName("reason")
        .setDescription("The reason you are adding the currency")),
    run: async function (interaction) {
        const target_user = interaction.options.getUser("target_user");
        const target_role = interaction.options.getRole("target_role");
        const currency = interaction.options.getString("currency");
        const amount = interaction.options.getNumber("amount");
        const reason = interaction.options.getString("reason");
        if (!target_role && !target_user) {
            interaction.editReply("At this time, you can only add to a user OR a role, not both.");
            return;
        }
        if (target_user) {
            if (target_user.bot) {
                interaction.editReply("Hey! Stop trying to add currency to bots! (  •̀ ᴖ •́  )");
                return;
            }
            try {
                await add_currency(target_user.id, currency, amount, `Mod action by ${interaction.user.displayName} ${reason ? `for reason \`${reason}\`` : `with no reason spcified`}`);
                interaction.editReply({
                    content: `Successfully added ${amount} ${currency} to ${target_user.displayName}'s balance`,
                });
            }
            catch (err) {
                interaction.editReply({
                    content: `${err}`,
                });
            }
        }
        if (target_role) {
            const guild = client.guilds.resolve(interaction.guild);
            const fetched_guild_members = await (await guild.fetch()).members.fetch();
            for (let [id, member] of fetched_guild_members) {
                if (member.roles.cache.has(target_role.id)) {
                    await add_currency(id, currency, amount, `Mod action by ${interaction.user.displayName} ${reason ? `for reason \`${reason}\`` : `with no reason specified`}`);
                }
            }
            interaction.editReply({
                content: `Successfully added ${amount} ${currency} to everyone with ${target_role}.`,
            });
        }
        if (!target_role && !target_user)
            interaction.editReply("### Fun Cringelord Facts!\n▸ You're supposed to specify either `target_role` or `target_user`");
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkY3VycmVuY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYWRkY3VycmVuY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QyxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxhQUFhLENBQUM7U0FDdEIsY0FBYyxDQUFDLHVDQUF1QyxDQUFDO1NBQ3ZELGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ25CLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQztTQUN6QyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FDakIsY0FBYyxDQUNiLDhFQUE4RSxDQUMvRTtTQUNBLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7U0FDQSxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUN4QixNQUFNO1NBQ0gsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUN0QixjQUFjLENBQUMsbUNBQW1DLENBQUMsQ0FDdkQ7U0FDQSxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUN4QixNQUFNO1NBQ0gsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUN0QixjQUFjLENBQ2IsZ0ZBQWdGLENBQ2pGLENBQ0o7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUNq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QWUsRUFBRSxDQUFDO0tBQ25CO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgYWRkX2N1cnJlbmN5IH0gZnJvbSBcIi4uL2N1cnJlbmN5L29wZXJhdGlvbnMvYXJpdGhtZXRpYy5qc1wiO1xyXG5pbXBvcnQgeyBjbGllbnQgfSBmcm9tIFwiLi4vc3RhcnR1cC9jbGllbnQuanNcIjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6IG5ldyBEaXNjb3JkLlNsYXNoQ29tbWFuZEJ1aWxkZXIoKVxyXG4gICAgLnNldE5hbWUoXCJhZGRjdXJyZW5jeVwiKVxyXG4gICAgLnNldERlc2NyaXB0aW9uKFwiR2VuZXJhdGUgY3VycmVuY3kgJiBjcmVkaXQgaXQgdG8gdXNlclwiKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImN1cnJlbmN5XCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIGN1cnJlbmN5IHRvIG1vZGlmeS5cIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJhbW91bnRcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIlRoZSBhbW91bnQgb2YgY3VycmVuY3kgdG8gYWRkLiBTcGVjaWZ5IGEgbmVnYXRpdmUgbnVtYmVyIHRvIHJlbW92ZSBjdXJyZW5jeS5cIlxyXG4gICAgICAgIClcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGRVc2VyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwidGFyZ2V0X3VzZXJcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgdXNlciB3aG9zZSBjdXJyZW5jeSB0byBtb2RpZnlcIilcclxuICAgIClcclxuICAgIC5hZGRSb2xlT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwidGFyZ2V0X3JvbGVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIlRoZSByb2xlIHdob3NlIG1lbWJlcnMgd2lsbCBlYWNoIGdldCB0aGUgZnVsbCBhbW91bnQgc3BlY2lmaWVkIGluIHRoaXMgY29tbWFuZFwiXHJcbiAgICAgICAgKVxyXG4gICAgKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcInJlYXNvblwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSByZWFzb24geW91IGFyZSBhZGRpbmcgdGhlIGN1cnJlbmN5XCIpXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgLy8gR2V0IG9wdGlvbnNcclxuICAgIGNvbnN0IHRhcmdldF91c2VyID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwidGFyZ2V0X3VzZXJcIik7XHJcbiAgICBjb25zdCB0YXJnZXRfcm9sZSA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0Um9sZShcInRhcmdldF9yb2xlXCIpO1xyXG4gICAgY29uc3QgY3VycmVuY3kgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImN1cnJlbmN5XCIpO1xyXG4gICAgY29uc3QgYW1vdW50ID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJhbW91bnRcIik7XHJcbiAgICBjb25zdCByZWFzb24gPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcInJlYXNvblwiKTtcclxuICAgIGlmICghdGFyZ2V0X3JvbGUgJiYgIXRhcmdldF91c2VyKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcclxuICAgICAgICBcIkF0IHRoaXMgdGltZSwgeW91IGNhbiBvbmx5IGFkZCB0byBhIHVzZXIgT1IgYSByb2xlLCBub3QgYm90aC5cIlxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgY3VycmVuY3kgdG8gdXNlclxyXG4gICAgaWYgKHRhcmdldF91c2VyKSB7XHJcbiAgICAgIGlmICh0YXJnZXRfdXNlci5ib3QpIHtcclxuICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgICAgICBcIkhleSEgU3RvcCB0cnlpbmcgdG8gYWRkIGN1cnJlbmN5IHRvIGJvdHMhICggIOKAosyAIOG0liDigKLMgSAgKVwiXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBhZGRfY3VycmVuY3koXHJcbiAgICAgICAgICB0YXJnZXRfdXNlci5pZCxcclxuICAgICAgICAgIGN1cnJlbmN5LFxyXG4gICAgICAgICAgYW1vdW50LFxyXG4gICAgICAgICAgYE1vZCBhY3Rpb24gYnkgJHtpbnRlcmFjdGlvbi51c2VyLmRpc3BsYXlOYW1lfSAke1xyXG4gICAgICAgICAgICByZWFzb24gPyBgZm9yIHJlYXNvbiBcXGAke3JlYXNvbn1cXGBgIDogYHdpdGggbm8gcmVhc29uIHNwY2lmaWVkYFxyXG4gICAgICAgICAgfWBcclxuICAgICAgICApO1xyXG4gICAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgICBjb250ZW50OiBgU3VjY2Vzc2Z1bGx5IGFkZGVkICR7YW1vdW50fSAke2N1cnJlbmN5fSB0byAke3RhcmdldF91c2VyLmRpc3BsYXlOYW1lfSdzIGJhbGFuY2VgLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgICAgY29udGVudDogYCR7ZXJyfWAsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0YXJnZXRfcm9sZSkge1xyXG4gICAgICBjb25zdCBndWlsZCA9IGNsaWVudC5ndWlsZHMucmVzb2x2ZShpbnRlcmFjdGlvbi5ndWlsZCk7XHJcbiAgICAgIGNvbnN0IGZldGNoZWRfZ3VpbGRfbWVtYmVycyA9IGF3YWl0IChhd2FpdCBndWlsZC5mZXRjaCgpKS5tZW1iZXJzLmZldGNoKCk7XHJcbiAgICAgIGZvciAobGV0IFtpZCwgbWVtYmVyXSBvZiBmZXRjaGVkX2d1aWxkX21lbWJlcnMpIHtcclxuICAgICAgICBpZiAobWVtYmVyLnJvbGVzLmNhY2hlLmhhcyh0YXJnZXRfcm9sZS5pZCkpIHtcclxuICAgICAgICAgIGF3YWl0IGFkZF9jdXJyZW5jeShcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGN1cnJlbmN5LFxyXG4gICAgICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgICAgIGBNb2QgYWN0aW9uIGJ5ICR7aW50ZXJhY3Rpb24udXNlci5kaXNwbGF5TmFtZX0gJHtcclxuICAgICAgICAgICAgICByZWFzb24gPyBgZm9yIHJlYXNvbiBcXGAke3JlYXNvbn1cXGBgIDogYHdpdGggbm8gcmVhc29uIHNwZWNpZmllZGBcclxuICAgICAgICAgICAgfWBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYFN1Y2Nlc3NmdWxseSBhZGRlZCAke2Ftb3VudH0gJHtjdXJyZW5jeX0gdG8gZXZlcnlvbmUgd2l0aCAke3RhcmdldF9yb2xlfS5gLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghdGFyZ2V0X3JvbGUgJiYgIXRhcmdldF91c2VyKVxyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgICAgXCIjIyMgRnVuIENyaW5nZWxvcmQgRmFjdHMhXFxu4pa4IFlvdSdyZSBzdXBwb3NlZCB0byBzcGVjaWZ5IGVpdGhlciBgdGFyZ2V0X3JvbGVgIG9yIGB0YXJnZXRfdXNlcmBcIlxyXG4gICAgICApO1xyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==