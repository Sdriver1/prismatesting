import * as Discord from "discord.js";
import SQL from "sql-template-strings";
import { db } from "../startup/db.js";
import { number_format_commas } from "../util/number_format_commas.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("showrewards")
        .setDescription("Lists current rewards"),
    run: async function (interaction) {
        const rewards = await db.all(SQL `SELECT * from rewards`);
        let reward_info_message = "";
        if (!rewards[0])
            reward_info_message = "There are no configured rewards";
        for (let reward of rewards) {
            reward_info_message += `## ${reward.messages} messages\n`;
            if (reward.xp_boost_duration && reward.xp_boost_multiplier)
                reward_info_message += `▸ **${reward.xp_boost_multiplier}x** XP for **${reward.xp_boost_duration / 1000 / 60}** minutes\n`;
            if (reward.currency_to_give && reward.currency_to_give_amount)
                reward_info_message += `▸ **${number_format_commas(reward.currency_to_give_amount)}** ${reward.currency_to_give}\n`;
            if (reward.role_id)
                reward_info_message += `▸ <@&${reward.role_id}>\n`;
        }
        interaction.editReply({ content: reward_info_message });
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd3Jld2FyZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvc2hvd3Jld2FyZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxHQUFHLE1BQU0sc0JBQXNCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRXZFLGVBQWU7SUFDYixJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7U0FDcEMsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUN0QixjQUFjLENBQUMsdUJBQXVCLENBQUM7SUFDMUMsR0FBRyxFQUFFLEtBQUssV0FBVyxXQUFnRDtRQUNuRSxNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFBLHVCQUF1QixDQUFDLENBQUM7UUFDekQsSUFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFBRSxtQkFBbUIsR0FBRyxpQ0FBaUMsQ0FBQztRQUN6RSxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQzNCLG1CQUFtQixJQUFJLE1BQU0sTUFBTSxDQUFDLFFBQVEsYUFBYSxDQUFDO1lBQzFELElBQUksTUFBTSxDQUFDLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxtQkFBbUI7Z0JBQ3hELG1CQUFtQixJQUFJLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixnQkFDdEQsTUFBTSxDQUFDLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUNwQyxjQUFjLENBQUM7WUFDakIsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLHVCQUF1QjtnQkFDM0QsbUJBQW1CLElBQUksT0FBTyxvQkFBb0IsQ0FDaEQsTUFBTSxDQUFDLHVCQUF1QixDQUMvQixNQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDO1lBQ3JDLElBQUksTUFBTSxDQUFDLE9BQU87Z0JBQUUsbUJBQW1CLElBQUksUUFBUSxNQUFNLENBQUMsT0FBTyxLQUFLLENBQUM7UUFDekUsQ0FBQztRQUNELFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCBTUUwgZnJvbSBcInNxbC10ZW1wbGF0ZS1zdHJpbmdzXCI7XHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uL3N0YXJ0dXAvZGIuanNcIjtcclxuaW1wb3J0IHsgbnVtYmVyX2Zvcm1hdF9jb21tYXMgfSBmcm9tIFwiLi4vdXRpbC9udW1iZXJfZm9ybWF0X2NvbW1hcy5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6IG5ldyBEaXNjb3JkLlNsYXNoQ29tbWFuZEJ1aWxkZXIoKVxyXG4gICAgLnNldE5hbWUoXCJzaG93cmV3YXJkc1wiKVxyXG4gICAgLnNldERlc2NyaXB0aW9uKFwiTGlzdHMgY3VycmVudCByZXdhcmRzXCIpLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgY29uc3QgcmV3YXJkcyA9IGF3YWl0IGRiLmFsbChTUUxgU0VMRUNUICogZnJvbSByZXdhcmRzYCk7XHJcbiAgICBsZXQgcmV3YXJkX2luZm9fbWVzc2FnZSA9IFwiXCI7XHJcbiAgICBpZiAoIXJld2FyZHNbMF0pIHJld2FyZF9pbmZvX21lc3NhZ2UgPSBcIlRoZXJlIGFyZSBubyBjb25maWd1cmVkIHJld2FyZHNcIjtcclxuICAgIGZvciAobGV0IHJld2FyZCBvZiByZXdhcmRzKSB7XHJcbiAgICAgIHJld2FyZF9pbmZvX21lc3NhZ2UgKz0gYCMjICR7cmV3YXJkLm1lc3NhZ2VzfSBtZXNzYWdlc1xcbmA7XHJcbiAgICAgIGlmIChyZXdhcmQueHBfYm9vc3RfZHVyYXRpb24gJiYgcmV3YXJkLnhwX2Jvb3N0X211bHRpcGxpZXIpXHJcbiAgICAgICAgcmV3YXJkX2luZm9fbWVzc2FnZSArPSBg4pa4ICoqJHtyZXdhcmQueHBfYm9vc3RfbXVsdGlwbGllcn14KiogWFAgZm9yICoqJHtcclxuICAgICAgICAgIHJld2FyZC54cF9ib29zdF9kdXJhdGlvbiAvIDEwMDAgLyA2MFxyXG4gICAgICAgIH0qKiBtaW51dGVzXFxuYDtcclxuICAgICAgaWYgKHJld2FyZC5jdXJyZW5jeV90b19naXZlICYmIHJld2FyZC5jdXJyZW5jeV90b19naXZlX2Ftb3VudClcclxuICAgICAgICByZXdhcmRfaW5mb19tZXNzYWdlICs9IGDilrggKioke251bWJlcl9mb3JtYXRfY29tbWFzKFxyXG4gICAgICAgICAgcmV3YXJkLmN1cnJlbmN5X3RvX2dpdmVfYW1vdW50XHJcbiAgICAgICAgKX0qKiAke3Jld2FyZC5jdXJyZW5jeV90b19naXZlfVxcbmA7XHJcbiAgICAgIGlmIChyZXdhcmQucm9sZV9pZCkgcmV3YXJkX2luZm9fbWVzc2FnZSArPSBg4pa4IDxAJiR7cmV3YXJkLnJvbGVfaWR9PlxcbmA7XHJcbiAgICB9XHJcbiAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoeyBjb250ZW50OiByZXdhcmRfaW5mb19tZXNzYWdlIH0pO1xyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==