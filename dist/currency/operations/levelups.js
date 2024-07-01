import * as Discord from "discord.js";
import { level, xp } from "../configurers/leveling/formula.js";
import config from "../../configs/config.json" with { type: "json" };
import { update_user_level_roles } from "../../util/level_roles.js";
import { number_format_commas } from "../../util/number_format_commas.js";
import { generate_boost_id, generate_xp_boost, } from "../configurers/xp_boosts.js";
import { get_currency_balance, give_reward } from "./arithmetic.js";
import { db } from "../../startup/db.js";
import SQL from "sql-template-strings";
import { activate_boost } from "../../command_parts/xp_boosts.js";
let reward_thresholds;
async function update_reward_thresholds() {
    let rewards = await db.all(SQL `SELECT messages FROM rewards`);
    reward_thresholds = rewards.map((reward) => reward.messages);
}
setInterval(update_reward_thresholds, 60 * 1000);
update_reward_thresholds();
export const xp_system = {
    checker: function (old_value, new_value) {
        if (level(old_value) < level(new_value)) {
            return true;
        }
        return false;
    },
    process: async function (new_value, user_id, channel) {
        if (!channel)
            return;
        let level_up_message = `### 🎉 Level up, <@${user_id}>!
▸ You have reached level **${number_format_commas(level(new_value))}**!
▸ You'll level up again in **${number_format_commas(Math.ceil(xp(level(new_value) + 1) - new_value))}** XP!`;
        const prestige = await get_currency_balance(user_id, "prestige");
        if (level(new_value) >= prestige * 5 + 25)
            level_up_message += `\n▸ **PRESTIGE AVAILABLE!** Type \`/prestige\` to prestige now!`;
        channel
            .send({
            content: level_up_message,
            flags: Discord.MessageFlags.SuppressNotifications,
        })
            .catch((err) => {
            return;
        });
        await update_user_level_roles(user_id, config.server.roles.levels);
    },
};
export const monthly_rewards = {
    checker: function (new_value) {
        if (reward_thresholds.some((n) => n == new_value) ||
            (new_value > 2000 && new_value % 1000 === 0)) {
            return true;
        }
        return false;
    },
    process: async function (new_value, message) {
        const reward = await db.get(SQL `SELECT * FROM rewards WHERE messages = ${new_value}`);
        if (!message.channel || !reward)
            return;
        try {
            await give_reward(message.author.id, new_value);
        }
        catch (err) {
            console.log(err);
            return;
        }
        let reward_message = `### 🎉 ${number_format_commas(new_value)} message reward unlocked, ${message.author}!\n`;
        if (reward.xp_boost_multiplier && reward.xp_boost_duration)
            reward_message += `▸ **${reward.xp_boost_multiplier}**x XP for **${reward.xp_boost_duration / 1000 / 60}** minutes\n`;
        if (reward.currency_to_give && reward.currency_to_give_amount)
            reward_message += `▸ **${number_format_commas(reward.currency_to_give_amount)}** ${reward.currency_to_give}\n`;
        if (reward.role_id)
            reward_message += `▸ <@&${reward.role_id}>\n`;
        if (new_value === 5)
            reward_message += `▸ **Grab the Rewards Wager** from </shop:1203120195531440203> to get **MORE REWARDS** when you reach the maximum reward! (We gave you enough gold to buy it!)`;
        await message.channel.send({
            content: reward_message,
            flags: Discord.MessageFlags.SuppressNotifications,
            components: [
                new Discord.ActionRowBuilder().addComponents([
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("What do rewards do?")
                        .setURL("https://discord.com/channels/921403338069770280/1234282759195721830"),
                ]),
            ],
        });
    },
};
export const first_message = {
    checker: function (old_xp, prestige, superprestige) {
        if (old_xp === 0 && prestige === 0 && superprestige === 0)
            return true;
        return false;
    },
    process: async function (user_id, channel) {
        if (!channel)
            return;
        const id = await generate_boost_id();
        channel
            .send({
            content: `# 🎉 5x XP unlocked, <@${user_id}>!`,
            flags: Discord.MessageFlags.SuppressNotifications,
            components: [
                new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId(`${id}`)
                    .setLabel("CLICK ME: Get 5x XP")),
            ],
        })
            .then(async (message) => {
            const collector = await message.createMessageComponentCollector({
                time: 10 * 60 * 1000,
            });
            collector.on("collect", (i) => {
                if (i.user.id !== user_id) {
                    i.reply({
                        content: "Hey! This isn't your boost! (  •̀ ᴖ •́  )",
                        ephemeral: true,
                    });
                    return;
                }
                else {
                    activate_boost(Number(i.customId), 10 * 60 * 1000);
                    i.reply({
                        content: "**Great job!** You have 5x XP for the next 10 minutes. **You'll get more XP boosts like this the more you chat here!**",
                        ephemeral: true,
                    });
                    message.edit({ components: [] });
                }
            });
        })
            .catch((err) => {
            return;
        });
        await generate_xp_boost({
            multiplier: 5,
            unclaimed_time_ms: 10 * 60 * 1000,
            owner_id: user_id,
            id: id,
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV2ZWx1cHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY3VycmVuY3kvb3BlcmF0aW9ucy9sZXZlbHVwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQy9ELE9BQU8sTUFBTSxNQUFNLDJCQUEyQixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzFFLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsaUJBQWlCLEdBQ2xCLE1BQU0sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN6QyxPQUFPLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsSUFBSSxpQkFBaUIsQ0FBQztBQUN0QixLQUFLLFVBQVUsd0JBQXdCO0lBQ3JDLElBQUksT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUEsOEJBQThCLENBQUMsQ0FBQztJQUM5RCxpQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUNELFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDakQsd0JBQXdCLEVBQUUsQ0FBQztB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RSxFQUFFLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixPQUFPO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDTCxNQUFNLGlCQUFpQixDQUFDO1lBQ3RCLFVBQVUsRUFBRSxDQUFDO1lBQ2IsaUJBQWlCLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJO1lBQ2pDLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLEVBQUUsRUFBRSxFQUFFO1NBQ1AsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGxldmVsLCB4cCB9IGZyb20gXCIuLi9jb25maWd1cmVycy9sZXZlbGluZy9mb3JtdWxhLmpzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5pbXBvcnQgeyB1cGRhdGVfdXNlcl9sZXZlbF9yb2xlcyB9IGZyb20gXCIuLi8uLi91dGlsL2xldmVsX3JvbGVzLmpzXCI7XHJcbmltcG9ydCB7IG51bWJlcl9mb3JtYXRfY29tbWFzIH0gZnJvbSBcIi4uLy4uL3V0aWwvbnVtYmVyX2Zvcm1hdF9jb21tYXMuanNcIjtcclxuaW1wb3J0IHtcclxuICBnZW5lcmF0ZV9ib29zdF9pZCxcclxuICBnZW5lcmF0ZV94cF9ib29zdCxcclxufSBmcm9tIFwiLi4vY29uZmlndXJlcnMveHBfYm9vc3RzLmpzXCI7XHJcbmltcG9ydCB7IGdldF9jdXJyZW5jeV9iYWxhbmNlLCBnaXZlX3Jld2FyZCB9IGZyb20gXCIuL2FyaXRobWV0aWMuanNcIjtcclxuaW1wb3J0IHsgZGIgfSBmcm9tIFwiLi4vLi4vc3RhcnR1cC9kYi5qc1wiO1xyXG5pbXBvcnQgU1FMIGZyb20gXCJzcWwtdGVtcGxhdGUtc3RyaW5nc1wiO1xyXG5pbXBvcnQgeyBhY3RpdmF0ZV9ib29zdCB9IGZyb20gXCIuLi8uLi9jb21tYW5kX3BhcnRzL3hwX2Jvb3N0cy5qc1wiO1xyXG5sZXQgcmV3YXJkX3RocmVzaG9sZHM7XHJcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZV9yZXdhcmRfdGhyZXNob2xkcygpIHtcclxuICBsZXQgcmV3YXJkcyA9IGF3YWl0IGRiLmFsbChTUUxgU0VMRUNUIG1lc3NhZ2VzIEZST00gcmV3YXJkc2ApO1xyXG4gIHJld2FyZF90aHJlc2hvbGRzID0gcmV3YXJkcy5tYXAoKHJld2FyZCkgPT4gcmV3YXJkLm1lc3NhZ2VzKTtcclxufVxyXG5zZXRJbnRlcnZhbCh1cGRhdGVfcmV3YXJkX3RocmVzaG9sZHMsIDYwICogMTAwMCk7XHJcbnVwZGF0ZV9yZXdhcmRfdGhyZXNob2xkcygpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHhwX3N5c3RlbSA9IHtcclxuICBjaGVja2VyOiBmdW5jdGlvbiAob2xkX3ZhbHVlOiBudW1iZXIsIG5ld192YWx1ZTogbnVtYmVyKSB7XHJcbiAgICBpZiAobGV2ZWwob2xkX3ZhbHVlKSA8IGxldmVsKG5ld192YWx1ZSkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICBwcm9jZXNzOiBhc3luYyBmdW5jdGlvbiAoXHJcbiAgICBuZXdfdmFsdWU6IG51bWJlcixcclxuICAgIHVzZXJfaWQ6IHN0cmluZyxcclxuICAgIGNoYW5uZWw6IERpc2NvcmQuVGV4dEJhc2VkQ2hhbm5lbFxyXG4gICkge1xyXG4gICAgaWYgKCFjaGFubmVsKSByZXR1cm47XHJcbiAgICBsZXQgbGV2ZWxfdXBfbWVzc2FnZSA9IGAjIyMg8J+OiSBMZXZlbCB1cCwgPEAke3VzZXJfaWR9PiFcclxu4pa4IFlvdSBoYXZlIHJlYWNoZWQgbGV2ZWwgKioke251bWJlcl9mb3JtYXRfY29tbWFzKGxldmVsKG5ld192YWx1ZSkpfSoqIVxyXG7ilrggWW91J2xsIGxldmVsIHVwIGFnYWluIGluICoqJHtudW1iZXJfZm9ybWF0X2NvbW1hcyhcclxuICAgICAgTWF0aC5jZWlsKHhwKGxldmVsKG5ld192YWx1ZSkgKyAxKSAtIG5ld192YWx1ZSlcclxuICAgICl9KiogWFAhYDtcclxuICAgIGNvbnN0IHByZXN0aWdlID0gYXdhaXQgZ2V0X2N1cnJlbmN5X2JhbGFuY2UodXNlcl9pZCwgXCJwcmVzdGlnZVwiKTtcclxuICAgIGlmIChsZXZlbChuZXdfdmFsdWUpID49IHByZXN0aWdlICogNSArIDI1KVxyXG4gICAgICBsZXZlbF91cF9tZXNzYWdlICs9IGBcXG7ilrggKipQUkVTVElHRSBBVkFJTEFCTEUhKiogVHlwZSBcXGAvcHJlc3RpZ2VcXGAgdG8gcHJlc3RpZ2Ugbm93IWA7XHJcbiAgICBjaGFubmVsXHJcbiAgICAgIC5zZW5kKHtcclxuICAgICAgICBjb250ZW50OiBsZXZlbF91cF9tZXNzYWdlLFxyXG4gICAgICAgIGZsYWdzOiBEaXNjb3JkLk1lc3NhZ2VGbGFncy5TdXBwcmVzc05vdGlmaWNhdGlvbnMsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9KTtcclxuICAgIGF3YWl0IHVwZGF0ZV91c2VyX2xldmVsX3JvbGVzKHVzZXJfaWQsIGNvbmZpZy5zZXJ2ZXIucm9sZXMubGV2ZWxzKTtcclxuICB9LFxyXG59O1xyXG5leHBvcnQgY29uc3QgbW9udGhseV9yZXdhcmRzID0ge1xyXG4gIGNoZWNrZXI6IGZ1bmN0aW9uIChuZXdfdmFsdWU6IG51bWJlcikge1xyXG4gICAgaWYgKFxyXG4gICAgICByZXdhcmRfdGhyZXNob2xkcy5zb21lKChuKSA9PiBuID09IG5ld192YWx1ZSkgfHxcclxuICAgICAgKG5ld192YWx1ZSA+IDIwMDAgJiYgbmV3X3ZhbHVlICUgMTAwMCA9PT0gMClcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIHByb2Nlc3M6IGFzeW5jIGZ1bmN0aW9uIChuZXdfdmFsdWU6IG51bWJlciwgbWVzc2FnZTogRGlzY29yZC5NZXNzYWdlKSB7XHJcbiAgICBjb25zdCByZXdhcmQgPSBhd2FpdCBkYi5nZXQoXHJcbiAgICAgIFNRTGBTRUxFQ1QgKiBGUk9NIHJld2FyZHMgV0hFUkUgbWVzc2FnZXMgPSAke25ld192YWx1ZX1gXHJcbiAgICApO1xyXG4gICAgaWYgKCFtZXNzYWdlLmNoYW5uZWwgfHwgIXJld2FyZCkgcmV0dXJuO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgZ2l2ZV9yZXdhcmQobWVzc2FnZS5hdXRob3IuaWQsIG5ld192YWx1ZSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHJld2FyZF9tZXNzYWdlID0gYCMjIyDwn46JICR7bnVtYmVyX2Zvcm1hdF9jb21tYXMoXHJcbiAgICAgIG5ld192YWx1ZVxyXG4gICAgKX0gbWVzc2FnZSByZXdhcmQgdW5sb2NrZWQsICR7bWVzc2FnZS5hdXRob3J9IVxcbmA7XHJcbiAgICBpZiAocmV3YXJkLnhwX2Jvb3N0X211bHRpcGxpZXIgJiYgcmV3YXJkLnhwX2Jvb3N0X2R1cmF0aW9uKVxyXG4gICAgICByZXdhcmRfbWVzc2FnZSArPSBg4pa4ICoqJHtyZXdhcmQueHBfYm9vc3RfbXVsdGlwbGllcn0qKnggWFAgZm9yICoqJHtcclxuICAgICAgICByZXdhcmQueHBfYm9vc3RfZHVyYXRpb24gLyAxMDAwIC8gNjBcclxuICAgICAgfSoqIG1pbnV0ZXNcXG5gO1xyXG4gICAgaWYgKHJld2FyZC5jdXJyZW5jeV90b19naXZlICYmIHJld2FyZC5jdXJyZW5jeV90b19naXZlX2Ftb3VudClcclxuICAgICAgcmV3YXJkX21lc3NhZ2UgKz0gYOKWuCAqKiR7bnVtYmVyX2Zvcm1hdF9jb21tYXMoXHJcbiAgICAgICAgcmV3YXJkLmN1cnJlbmN5X3RvX2dpdmVfYW1vdW50XHJcbiAgICAgICl9KiogJHtyZXdhcmQuY3VycmVuY3lfdG9fZ2l2ZX1cXG5gO1xyXG4gICAgaWYgKHJld2FyZC5yb2xlX2lkKSByZXdhcmRfbWVzc2FnZSArPSBg4pa4IDxAJiR7cmV3YXJkLnJvbGVfaWR9PlxcbmA7XHJcbiAgICBpZiAobmV3X3ZhbHVlID09PSA1KVxyXG4gICAgICByZXdhcmRfbWVzc2FnZSArPSBg4pa4ICoqR3JhYiB0aGUgUmV3YXJkcyBXYWdlcioqIGZyb20gPC9zaG9wOjEyMDMxMjAxOTU1MzE0NDAyMDM+IHRvIGdldCAqKk1PUkUgUkVXQVJEUyoqIHdoZW4geW91IHJlYWNoIHRoZSBtYXhpbXVtIHJld2FyZCEgKFdlIGdhdmUgeW91IGVub3VnaCBnb2xkIHRvIGJ1eSBpdCEpYDtcclxuICAgIGF3YWl0IG1lc3NhZ2UuY2hhbm5lbC5zZW5kKHtcclxuICAgICAgY29udGVudDogcmV3YXJkX21lc3NhZ2UsXHJcbiAgICAgIGZsYWdzOiBEaXNjb3JkLk1lc3NhZ2VGbGFncy5TdXBwcmVzc05vdGlmaWNhdGlvbnMsXHJcbiAgICAgIGNvbXBvbmVudHM6IFtcclxuICAgICAgICBuZXcgRGlzY29yZC5BY3Rpb25Sb3dCdWlsZGVyPERpc2NvcmQuQnV0dG9uQnVpbGRlcj4oKS5hZGRDb21wb25lbnRzKFtcclxuICAgICAgICAgIG5ldyBEaXNjb3JkLkJ1dHRvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuc2V0U3R5bGUoRGlzY29yZC5CdXR0b25TdHlsZS5MaW5rKVxyXG4gICAgICAgICAgICAuc2V0TGFiZWwoXCJXaGF0IGRvIHJld2FyZHMgZG8/XCIpXHJcbiAgICAgICAgICAgIC5zZXRVUkwoXHJcbiAgICAgICAgICAgICAgXCJodHRwczovL2Rpc2NvcmQuY29tL2NoYW5uZWxzLzkyMTQwMzMzODA2OTc3MDI4MC8xMjM0MjgyNzU5MTk1NzIxODMwXCJcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICBdKSxcclxuICAgICAgXSxcclxuICAgIH0pO1xyXG4gIH0sXHJcbn07XHJcbmV4cG9ydCBjb25zdCBmaXJzdF9tZXNzYWdlID0ge1xyXG4gIGNoZWNrZXI6IGZ1bmN0aW9uIChvbGRfeHA6IG51bWJlciwgcHJlc3RpZ2U6IG51bWJlciwgc3VwZXJwcmVzdGlnZTogbnVtYmVyKSB7XHJcbiAgICBpZiAob2xkX3hwID09PSAwICYmIHByZXN0aWdlID09PSAwICYmIHN1cGVycHJlc3RpZ2UgPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgcHJvY2VzczogYXN5bmMgZnVuY3Rpb24gKHVzZXJfaWQ6IHN0cmluZywgY2hhbm5lbDogRGlzY29yZC5UZXh0QmFzZWRDaGFubmVsKSB7XHJcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcclxuICAgIGNvbnN0IGlkID0gYXdhaXQgZ2VuZXJhdGVfYm9vc3RfaWQoKTtcclxuICAgIGNoYW5uZWxcclxuICAgICAgLnNlbmQoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGAjIPCfjokgNXggWFAgdW5sb2NrZWQsIDxAJHt1c2VyX2lkfT4hYCxcclxuICAgICAgICBmbGFnczogRGlzY29yZC5NZXNzYWdlRmxhZ3MuU3VwcHJlc3NOb3RpZmljYXRpb25zLFxyXG4gICAgICAgIGNvbXBvbmVudHM6IFtcclxuICAgICAgICAgIG5ldyBEaXNjb3JkLkFjdGlvblJvd0J1aWxkZXI8RGlzY29yZC5CdXR0b25CdWlsZGVyPigpLmFkZENvbXBvbmVudHMoXHJcbiAgICAgICAgICAgIG5ldyBEaXNjb3JkLkJ1dHRvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAgIC5zZXRTdHlsZShEaXNjb3JkLkJ1dHRvblN0eWxlLlByaW1hcnkpXHJcbiAgICAgICAgICAgICAgLnNldEN1c3RvbUlkKGAke2lkfWApXHJcbiAgICAgICAgICAgICAgLnNldExhYmVsKFwiQ0xJQ0sgTUU6IEdldCA1eCBYUFwiKVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICBdLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihhc3luYyAobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbGxlY3RvciA9IGF3YWl0IG1lc3NhZ2UuY3JlYXRlTWVzc2FnZUNvbXBvbmVudENvbGxlY3Rvcih7XHJcbiAgICAgICAgICB0aW1lOiAxMCAqIDYwICogMTAwMCxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb2xsZWN0b3Iub24oXCJjb2xsZWN0XCIsIChpKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaS51c2VyLmlkICE9PSB1c2VyX2lkKSB7XHJcbiAgICAgICAgICAgIGkucmVwbHkoe1xyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IFwiSGV5ISBUaGlzIGlzbid0IHlvdXIgYm9vc3QhICggIOKAosyAIOG0liDigKLMgSAgKVwiLFxyXG4gICAgICAgICAgICAgIGVwaGVtZXJhbDogdHJ1ZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGl2YXRlX2Jvb3N0KE51bWJlcihpLmN1c3RvbUlkKSwgMTAgKiA2MCAqIDEwMDApO1xyXG4gICAgICAgICAgICBpLnJlcGx5KHtcclxuICAgICAgICAgICAgICBjb250ZW50OlxyXG4gICAgICAgICAgICAgICAgXCIqKkdyZWF0IGpvYiEqKiBZb3UgaGF2ZSA1eCBYUCBmb3IgdGhlIG5leHQgMTAgbWludXRlcy4gKipZb3UnbGwgZ2V0IG1vcmUgWFAgYm9vc3RzIGxpa2UgdGhpcyB0aGUgbW9yZSB5b3UgY2hhdCBoZXJlISoqXCIsXHJcbiAgICAgICAgICAgICAgZXBoZW1lcmFsOiB0cnVlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbWVzc2FnZS5lZGl0KHsgY29tcG9uZW50czogW10gfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9KTtcclxuICAgIGF3YWl0IGdlbmVyYXRlX3hwX2Jvb3N0KHtcclxuICAgICAgbXVsdGlwbGllcjogNSxcclxuICAgICAgdW5jbGFpbWVkX3RpbWVfbXM6IDEwICogNjAgKiAxMDAwLFxyXG4gICAgICBvd25lcl9pZDogdXNlcl9pZCxcclxuICAgICAgaWQ6IGlkLFxyXG4gICAgfSk7XHJcbiAgfSxcclxufTtcclxuIl19