import * as Discord from "discord.js";
import { add_currency, get_currency_balance, } from "../currency/operations/arithmetic.js";
import { level, xp } from "../currency/configurers/leveling/formula.js";
import config from "../configs/config.json" with { type: "json" };
import { update_user_level_roles } from "../util/level_roles.js";
let prestiging = [];
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("prestige")
        .setDescription("Prestige and reset your XP"),
    run: async function (interaction) {
        if (prestiging.includes(interaction.user.id)) {
            interaction.editReply({
                content: "You are already prestiging! (If you previously dismissed the embed, wait a minute and try again).",
            });
            return;
        }
        const user_data = await get_user_info(interaction.member);
        if (!user_data.prestige)
            user_data.prestige = 0;
        if (user_data.level < user_data.prestige_level_requirement) {
            interaction.editReply({
                embeds: [
                    embeds.prestige_ineligible(user_data.prestige_level_requirement),
                ],
            });
            return;
        }
        else {
            prestiging.push(interaction.user.id);
            const reply = await interaction.editReply({
                embeds: [
                    embeds.prestige_confirmation(user_data.is_boosting
                        ? xp(user_data.prestige_level_requirement)
                        : user_data.xp, user_data.prestige + 1, !user_data.is_boosting),
                ],
                components: [embeds.prestige_confirmation_button],
            });
            reply
                .awaitMessageComponent({
                filter: (confirm_interaction) => confirm_interaction.customId === "confirm" &&
                    confirm_interaction.user.id == interaction.user.id,
                time: 60 * 1000,
            })
                .then(async (i) => {
                i.deferReply({ ephemeral: true });
                await add_currency(i.user.id, "prestige", 1);
                await add_currency(i.user.id, "xp", -(user_data.is_boosting
                    ? xp(user_data.prestige_level_requirement)
                    : user_data.xp));
                await update_user_level_roles(i.user.id, config.server.roles.levels);
                await update_user_level_roles(i.user.id, config.server.roles.prestiges);
                i.editReply({
                    embeds: [embeds.prestige_success(user_data.prestige + 1)],
                    components: [],
                });
                prestiging.splice(prestiging.indexOf(interaction.user.id, 1));
            })
                .catch((err) => {
                prestiging.splice(prestiging.indexOf(interaction.user.id, 1));
            });
        }
    },
    options: {
        server_cooldown: 0,
    },
};
async function get_user_info(member) {
    const user_currency_balances = await get_currency_balance(member.id);
    if (!user_currency_balances.prestige)
        user_currency_balances.prestige = 0;
    if (!user_currency_balances.xp)
        user_currency_balances.xp = 0;
    return {
        level: level(user_currency_balances.xp),
        xp: user_currency_balances.xp || 0,
        prestige: user_currency_balances.prestige || 0,
        prestige_level_requirement: 25 + user_currency_balances.prestige * 5,
        is_boosting: member.premiumSince ? true : false,
    };
}
const embeds = {
    prestige_confirmation: (xp_traded, new_prestige, include_boost_ad) => {
        return new Discord.EmbedBuilder()
            .setTitle("Ready to prestige?")
            .setDescription(`▸ You're about to become Prestige **${new_prestige}** and trade **${xp_traded}** XP. Press the button below to confirm this. ${include_boost_ad
            ? `\n▸ **:bulb: Pro tip!** Server boosters only have to trade the XP required to reach their prestige level, meaning they save all their bonus XP.`
            : ``}`);
    },
    prestige_confirmation_button: new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm my prestige")
        .setStyle(Discord.ButtonStyle.Primary)),
    prestige_success: (new_prestige) => {
        return new Discord.EmbedBuilder()
            .setTitle("Prestige successful!")
            .setDescription(`▸ You're are now Prestige **${new_prestige}**. Congratulations!`);
    },
    prestige_ineligible: (required_level) => new Discord.EmbedBuilder()
        .setTitle("You can't prestige yet :(")
        .setDescription(`▸ Try again when you reach level **${required_level}**!`),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc3RpZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvcHJlc3RpZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUNMLFlBQVksRUFDWixvQkFBb0IsR0FDckIsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5QyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3hFLE9BQU8sTUFBTSxNQUFNLHdCQUF3QixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pFLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUVwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxVQUFVLENBQUM7U0FDbkIsY0FBYyxDQUFDLDRCQUE0QixDQUFDO0lBQy9DLEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUM3QyxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQ0wsbUdBQW1HO2FBQ3RHLENBQUMsQ0FBQztZQUNILE9BQU87UUFDVCxDQUFDO1FBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxhQUFhLENBQ25DLFdBQVcsQ0FBQyxNQUE2QixDQUMxQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRO1lBQUUsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQzNELFdBQVcsQ0FBQyxT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USxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQ3pDO0lBQ0gsZ0JBQWdCLEVBQUUsQ0FBQyxZQUFvQixFQUFFLEVBQUU7UUFDekMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDOUIsUUFBUSxDQUFDLHNCQUFzQixDQUFDO2FBQ2hDLGNBQWMsQ0FDYiwrQkFBK0IsWUFBWSxzQkFBc0IsQ0FDbEUsQ0FBQztJQUNOLENBQUM7SUFDRCxtQkFBbUIsRUFBRSxDQUFDLGNBQXNCLEVBQUUsRUFBRSxDQUM5QyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7U0FDdkIsUUFBUSxDQUFDLDJCQUEyQixDQUFDO1NBQ3JDLGNBQWMsQ0FDYixzQ0FBc0MsY0FBYyxLQUFLLENBQzFEO0NBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHtcclxuICBhZGRfY3VycmVuY3ksXHJcbiAgZ2V0X2N1cnJlbmN5X2JhbGFuY2UsXHJcbn0gZnJvbSBcIi4uL2N1cnJlbmN5L29wZXJhdGlvbnMvYXJpdGhtZXRpYy5qc1wiO1xyXG5pbXBvcnQgeyBsZXZlbCwgeHAgfSBmcm9tIFwiLi4vY3VycmVuY3kvY29uZmlndXJlcnMvbGV2ZWxpbmcvZm9ybXVsYS5qc1wiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdzL2NvbmZpZy5qc29uXCIgYXNzZXJ0IHsgdHlwZTogXCJqc29uXCIgfTtcclxuaW1wb3J0IHsgdXBkYXRlX3VzZXJfbGV2ZWxfcm9sZXMgfSBmcm9tIFwiLi4vdXRpbC9sZXZlbF9yb2xlcy5qc1wiO1xyXG5sZXQgcHJlc3RpZ2luZyA9IFtdO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6IG5ldyBEaXNjb3JkLlNsYXNoQ29tbWFuZEJ1aWxkZXIoKVxyXG4gICAgLnNldE5hbWUoXCJwcmVzdGlnZVwiKVxyXG4gICAgLnNldERlc2NyaXB0aW9uKFwiUHJlc3RpZ2UgYW5kIHJlc2V0IHlvdXIgWFBcIiksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uKSB7XHJcbiAgICBpZiAocHJlc3RpZ2luZy5pbmNsdWRlcyhpbnRlcmFjdGlvbi51c2VyLmlkKSkge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6XHJcbiAgICAgICAgICBcIllvdSBhcmUgYWxyZWFkeSBwcmVzdGlnaW5nISAoSWYgeW91IHByZXZpb3VzbHkgZGlzbWlzc2VkIHRoZSBlbWJlZCwgd2FpdCBhIG1pbnV0ZSBhbmQgdHJ5IGFnYWluKS5cIixcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHVzZXJfZGF0YSA9IGF3YWl0IGdldF91c2VyX2luZm8oXHJcbiAgICAgIGludGVyYWN0aW9uLm1lbWJlciBhcyBEaXNjb3JkLkd1aWxkTWVtYmVyXHJcbiAgICApO1xyXG4gICAgaWYgKCF1c2VyX2RhdGEucHJlc3RpZ2UpIHVzZXJfZGF0YS5wcmVzdGlnZSA9IDA7XHJcbiAgICBpZiAodXNlcl9kYXRhLmxldmVsIDwgdXNlcl9kYXRhLnByZXN0aWdlX2xldmVsX3JlcXVpcmVtZW50KSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgZW1iZWRzOiBbXHJcbiAgICAgICAgICBlbWJlZHMucHJlc3RpZ2VfaW5lbGlnaWJsZSh1c2VyX2RhdGEucHJlc3RpZ2VfbGV2ZWxfcmVxdWlyZW1lbnQpLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwcmVzdGlnaW5nLnB1c2goaW50ZXJhY3Rpb24udXNlci5pZCk7XHJcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBlbWJlZHM6IFtcclxuICAgICAgICAgIGVtYmVkcy5wcmVzdGlnZV9jb25maXJtYXRpb24oXHJcbiAgICAgICAgICAgIHVzZXJfZGF0YS5pc19ib29zdGluZ1xyXG4gICAgICAgICAgICAgID8geHAodXNlcl9kYXRhLnByZXN0aWdlX2xldmVsX3JlcXVpcmVtZW50KVxyXG4gICAgICAgICAgICAgIDogdXNlcl9kYXRhLnhwLFxyXG4gICAgICAgICAgICB1c2VyX2RhdGEucHJlc3RpZ2UgKyAxLFxyXG4gICAgICAgICAgICAhdXNlcl9kYXRhLmlzX2Jvb3N0aW5nXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgY29tcG9uZW50czogW2VtYmVkcy5wcmVzdGlnZV9jb25maXJtYXRpb25fYnV0dG9uXSxcclxuICAgICAgfSk7XHJcbiAgICAgIHJlcGx5XHJcbiAgICAgICAgLmF3YWl0TWVzc2FnZUNvbXBvbmVudCh7XHJcbiAgICAgICAgICBmaWx0ZXI6IChjb25maXJtX2ludGVyYWN0aW9uKSA9PlxyXG4gICAgICAgICAgICBjb25maXJtX2ludGVyYWN0aW9uLmN1c3RvbUlkID09PSBcImNvbmZpcm1cIiAmJlxyXG4gICAgICAgICAgICBjb25maXJtX2ludGVyYWN0aW9uLnVzZXIuaWQgPT0gaW50ZXJhY3Rpb24udXNlci5pZCxcclxuICAgICAgICAgIHRpbWU6IDYwICogMTAwMCxcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGFzeW5jIChpKSA9PiB7XHJcbiAgICAgICAgICBpLmRlZmVyUmVwbHkoeyBlcGhlbWVyYWw6IHRydWUgfSk7XHJcbiAgICAgICAgICBhd2FpdCBhZGRfY3VycmVuY3koaS51c2VyLmlkLCBcInByZXN0aWdlXCIsIDEpO1xyXG4gICAgICAgICAgYXdhaXQgYWRkX2N1cnJlbmN5KFxyXG4gICAgICAgICAgICBpLnVzZXIuaWQsXHJcbiAgICAgICAgICAgIFwieHBcIixcclxuICAgICAgICAgICAgLSh1c2VyX2RhdGEuaXNfYm9vc3RpbmdcclxuICAgICAgICAgICAgICA/IHhwKHVzZXJfZGF0YS5wcmVzdGlnZV9sZXZlbF9yZXF1aXJlbWVudClcclxuICAgICAgICAgICAgICA6IHVzZXJfZGF0YS54cClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBhd2FpdCB1cGRhdGVfdXNlcl9sZXZlbF9yb2xlcyhpLnVzZXIuaWQsIGNvbmZpZy5zZXJ2ZXIucm9sZXMubGV2ZWxzKTtcclxuICAgICAgICAgIGF3YWl0IHVwZGF0ZV91c2VyX2xldmVsX3JvbGVzKFxyXG4gICAgICAgICAgICBpLnVzZXIuaWQsXHJcbiAgICAgICAgICAgIGNvbmZpZy5zZXJ2ZXIucm9sZXMucHJlc3RpZ2VzXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaS5lZGl0UmVwbHkoe1xyXG4gICAgICAgICAgICBlbWJlZHM6IFtlbWJlZHMucHJlc3RpZ2Vfc3VjY2Vzcyh1c2VyX2RhdGEucHJlc3RpZ2UgKyAxKV0sXHJcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IFtdLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwcmVzdGlnaW5nLnNwbGljZShwcmVzdGlnaW5nLmluZGV4T2YoaW50ZXJhY3Rpb24udXNlci5pZCwgMSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgIHByZXN0aWdpbmcuc3BsaWNlKHByZXN0aWdpbmcuaW5kZXhPZihpbnRlcmFjdGlvbi51c2VyLmlkLCAxKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvcHRpb25zOiB7XHJcbiAgICBzZXJ2ZXJfY29vbGRvd246IDAsXHJcbiAgfSxcclxufTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldF91c2VyX2luZm8obWVtYmVyOiBEaXNjb3JkLkd1aWxkTWVtYmVyKSB7XHJcbiAgY29uc3QgdXNlcl9jdXJyZW5jeV9iYWxhbmNlcyA9IGF3YWl0IGdldF9jdXJyZW5jeV9iYWxhbmNlKG1lbWJlci5pZCk7XHJcbiAgaWYgKCF1c2VyX2N1cnJlbmN5X2JhbGFuY2VzLnByZXN0aWdlKSB1c2VyX2N1cnJlbmN5X2JhbGFuY2VzLnByZXN0aWdlID0gMDtcclxuICBpZiAoIXVzZXJfY3VycmVuY3lfYmFsYW5jZXMueHApIHVzZXJfY3VycmVuY3lfYmFsYW5jZXMueHAgPSAwO1xyXG4gIHJldHVybiB7XHJcbiAgICBsZXZlbDogbGV2ZWwodXNlcl9jdXJyZW5jeV9iYWxhbmNlcy54cCksXHJcbiAgICB4cDogdXNlcl9jdXJyZW5jeV9iYWxhbmNlcy54cCB8fCAwLFxyXG4gICAgcHJlc3RpZ2U6IHVzZXJfY3VycmVuY3lfYmFsYW5jZXMucHJlc3RpZ2UgfHwgMCxcclxuICAgIHByZXN0aWdlX2xldmVsX3JlcXVpcmVtZW50OiAyNSArIHVzZXJfY3VycmVuY3lfYmFsYW5jZXMucHJlc3RpZ2UgKiA1LFxyXG4gICAgaXNfYm9vc3Rpbmc6IG1lbWJlci5wcmVtaXVtU2luY2UgPyB0cnVlIDogZmFsc2UsXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZW1iZWRzID0ge1xyXG4gIHByZXN0aWdlX2NvbmZpcm1hdGlvbjogKFxyXG4gICAgeHBfdHJhZGVkOiBudW1iZXIsXHJcbiAgICBuZXdfcHJlc3RpZ2U6IG51bWJlcixcclxuICAgIGluY2x1ZGVfYm9vc3RfYWQ6IGJvb2xlYW5cclxuICApID0+IHtcclxuICAgIHJldHVybiBuZXcgRGlzY29yZC5FbWJlZEJ1aWxkZXIoKVxyXG4gICAgICAuc2V0VGl0bGUoXCJSZWFkeSB0byBwcmVzdGlnZT9cIilcclxuICAgICAgLnNldERlc2NyaXB0aW9uKFxyXG4gICAgICAgIGDilrggWW91J3JlIGFib3V0IHRvIGJlY29tZSBQcmVzdGlnZSAqKiR7bmV3X3ByZXN0aWdlfSoqIGFuZCB0cmFkZSAqKiR7eHBfdHJhZGVkfSoqIFhQLiBQcmVzcyB0aGUgYnV0dG9uIGJlbG93IHRvIGNvbmZpcm0gdGhpcy4gJHtcclxuICAgICAgICAgIGluY2x1ZGVfYm9vc3RfYWRcclxuICAgICAgICAgICAgPyBgXFxu4pa4ICoqOmJ1bGI6IFBybyB0aXAhKiogU2VydmVyIGJvb3N0ZXJzIG9ubHkgaGF2ZSB0byB0cmFkZSB0aGUgWFAgcmVxdWlyZWQgdG8gcmVhY2ggdGhlaXIgcHJlc3RpZ2UgbGV2ZWwsIG1lYW5pbmcgdGhleSBzYXZlIGFsbCB0aGVpciBib251cyBYUC5gXHJcbiAgICAgICAgICAgIDogYGBcclxuICAgICAgICB9YFxyXG4gICAgICApO1xyXG4gIH0sXHJcbiAgcHJlc3RpZ2VfY29uZmlybWF0aW9uX2J1dHRvbjpcclxuICAgIG5ldyBEaXNjb3JkLkFjdGlvblJvd0J1aWxkZXI8RGlzY29yZC5CdXR0b25CdWlsZGVyPigpLmFkZENvbXBvbmVudHMoXHJcbiAgICAgIG5ldyBEaXNjb3JkLkJ1dHRvbkJ1aWxkZXIoKVxyXG4gICAgICAgIC5zZXRDdXN0b21JZChcImNvbmZpcm1cIilcclxuICAgICAgICAuc2V0TGFiZWwoXCJDb25maXJtIG15IHByZXN0aWdlXCIpXHJcbiAgICAgICAgLnNldFN0eWxlKERpc2NvcmQuQnV0dG9uU3R5bGUuUHJpbWFyeSlcclxuICAgICksXHJcbiAgcHJlc3RpZ2Vfc3VjY2VzczogKG5ld19wcmVzdGlnZTogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IERpc2NvcmQuRW1iZWRCdWlsZGVyKClcclxuICAgICAgLnNldFRpdGxlKFwiUHJlc3RpZ2Ugc3VjY2Vzc2Z1bCFcIilcclxuICAgICAgLnNldERlc2NyaXB0aW9uKFxyXG4gICAgICAgIGDilrggWW91J3JlIGFyZSBub3cgUHJlc3RpZ2UgKioke25ld19wcmVzdGlnZX0qKi4gQ29uZ3JhdHVsYXRpb25zIWBcclxuICAgICAgKTtcclxuICB9LFxyXG4gIHByZXN0aWdlX2luZWxpZ2libGU6IChyZXF1aXJlZF9sZXZlbDogbnVtYmVyKSA9PlxyXG4gICAgbmV3IERpc2NvcmQuRW1iZWRCdWlsZGVyKClcclxuICAgICAgLnNldFRpdGxlKFwiWW91IGNhbid0IHByZXN0aWdlIHlldCA6KFwiKVxyXG4gICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgYOKWuCBUcnkgYWdhaW4gd2hlbiB5b3UgcmVhY2ggbGV2ZWwgKioke3JlcXVpcmVkX2xldmVsfSoqIWBcclxuICAgICAgKSxcclxufTtcclxuIl19