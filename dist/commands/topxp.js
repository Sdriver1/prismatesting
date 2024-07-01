import * as Discord from "discord.js";
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import { level } from "../currency/configurers/leveling/formula.js";
import { number_format_commas } from "../util/number_format_commas.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("topxp")
        .setDescription("Get the users with the highest XP")
        .addNumberOption((option) => option
        .setName("page")
        .setDescription("The leaderboard page to show (page 1 is 1-10, page 2 is 11-20, etc.)")),
    run: async function (interaction) {
        const page = interaction.options.getNumber("page") || 1;
        if (page > 999 || !Number.isInteger(page) || page < 1) {
            interaction.editReply("Invalid page supplied! (Only whole number pages between 1 and 999 work)");
            return;
        }
        const indices = {
            max: page * 10 - 1,
            min: page * 10 - 9 - 1,
        };
        const prestige_data = await db.all(SQL `SELECT DISTINCT 
      u.user_id, 
      p.amount as prestige, 
      x.amount as xp,
      s.amount as superprestige 
  FROM user_currencies u
  LEFT JOIN user_currencies p ON u.user_id = p.user_id AND p.currency_id = 'prestige'
  LEFT JOIN user_currencies x ON u.user_id = x.user_id AND x.currency_id = 'xp'
  LEFT JOIN user_currencies s ON u.user_id = s.user_id AND s.currency_id = 'superprestige' 
  WHERE p.amount IS NOT NULL OR x.amount IS NOT NULL OR s.amount IS NOT NULL
  ORDER BY superprestige DESC, prestige DESC, xp DESC;
`);
        let output_message = ``;
        for (let i = indices.min; i <= indices.max; i++) {
            let user_data = prestige_data[i];
            let user_amount_message = `<@${user_data.user_id}> ▸ `;
            if (!user_data)
                return;
            if (user_data.superprestige > 0)
                user_amount_message += `Superprestige **${number_format_commas(user_data.superprestige)}**, `;
            if (user_data.prestige > 0)
                user_amount_message += `Prestige **${number_format_commas(user_data.prestige)}**, `;
            user_amount_message += `Level **${number_format_commas(level(user_data.xp))}**\n`;
            output_message += user_amount_message;
        }
        if (output_message === ``) {
            interaction.editReply("No data exists for specified page");
            return;
        }
        else {
            output_message +=
                "\n[Click me for more information about Prestige & Super Prestige](https://discord.com/channels/921403338069770280/1212989878485385236)";
            interaction.editReply({
                content: "# XP Leaderboard\n" + output_message,
            });
        }
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9weHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvdG9weHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RDLE9BQU8sR0FBRyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN2RSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxPQUFPLENBQUM7U0FDaEIsY0FBYyxDQUFDLG1DQUFtQyxDQUFDO1NBQ25ELGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQ2YsY0FBYyxDQUNiLHNFQUFzRSxDQUN2RSxDQUNKO0lBQ0gsR0FBRyxFQUFFLEtBQUssV0FBVyxXQUFnRDtRQUNuRSxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEQsV0FBVyxDQUFDLFNBQVMsQ0FDbkIseUVBQXlFLENBQzFFLENBQUM7WUFDRixPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHO1lBQ2QsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNsQixHQUFHLEVBQUUsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQztTQUN2QixDQUFDO1FBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUNoQyxHQUFHLENBQUE7Ozs7Ozs7Ozs7O0NBV1IsQ0FDSSxDQUFDO1FBQ0YsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hELElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLG1CQUFtQixHQUFHLEtBQUssU0FBUyxDQUFDLE9BQU8sTUFBTSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU87WUFDdkIsSUFBSSxTQUFTLENBQUMsYUFBYSxHQUFHLENBQUM7Z0JBQzdCLG1CQUFtQixJQUFJLG1CQUFtQixvQkFBb0IsQ0FDNUQsU0FBUyxDQUFDLGFBQWEsQ0FDeEIsTUFBTSxDQUFDO1lBQ1YsSUFBSSxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUM7Z0JBQ3hCLG1CQUFtQixJQUFJLGNBQWMsb0JBQW9CLENBQ3ZELFNBQVMsQ0FBQyxRQUFRLENBQ25CLE1BQU0sQ0FBQztZQUNWLG1CQUFtQixJQUFJLFdBQVcsb0JBQW9CLENBQ3BELEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQ3BCLE1BQU0sQ0FBQztZQUNSLGNBQWMsSUFBSSxtQkFBbUIsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsSUFBSSxjQUFjLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDMUIsV0FBVyxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQzNELE9BQU87UUFDVCxDQUFDO2FBQU0sQ0FBQztZQUNOLGNBQWM7Z0JBQ1osd0lBQXdJLENBQUM7WUFDM0ksV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLG9CQUFvQixHQUFHLGNBQWM7YUFDL0MsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uL3N0YXJ0dXAvZGIuanNcIjtcclxuaW1wb3J0IFNRTCBmcm9tIFwic3FsLXRlbXBsYXRlLXN0cmluZ3NcIjtcclxuaW1wb3J0IHsgbGV2ZWwgfSBmcm9tIFwiLi4vY3VycmVuY3kvY29uZmlndXJlcnMvbGV2ZWxpbmcvZm9ybXVsYS5qc1wiO1xyXG5pbXBvcnQgeyBudW1iZXJfZm9ybWF0X2NvbW1hcyB9IGZyb20gXCIuLi91dGlsL251bWJlcl9mb3JtYXRfY29tbWFzLmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwidG9weHBcIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIkdldCB0aGUgdXNlcnMgd2l0aCB0aGUgaGlnaGVzdCBYUFwiKVxyXG4gICAgLmFkZE51bWJlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcInBhZ2VcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIlRoZSBsZWFkZXJib2FyZCBwYWdlIHRvIHNob3cgKHBhZ2UgMSBpcyAxLTEwLCBwYWdlIDIgaXMgMTEtMjAsIGV0Yy4pXCJcclxuICAgICAgICApXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgY29uc3QgcGFnZSA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0TnVtYmVyKFwicGFnZVwiKSB8fCAxO1xyXG4gICAgaWYgKHBhZ2UgPiA5OTkgfHwgIU51bWJlci5pc0ludGVnZXIocGFnZSkgfHwgcGFnZSA8IDEpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KFxyXG4gICAgICAgIFwiSW52YWxpZCBwYWdlIHN1cHBsaWVkISAoT25seSB3aG9sZSBudW1iZXIgcGFnZXMgYmV0d2VlbiAxIGFuZCA5OTkgd29yaylcIlxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyAxIGlzIHN1YnRyYWN0ZWQgdG8gbWF0Y2ggdGhlIGFycmF5IGluZGV4XHJcbiAgICBjb25zdCBpbmRpY2VzID0ge1xyXG4gICAgICBtYXg6IHBhZ2UgKiAxMCAtIDEsXHJcbiAgICAgIG1pbjogcGFnZSAqIDEwIC0gOSAtIDEsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcHJlc3RpZ2VfZGF0YSA9IGF3YWl0IGRiLmFsbChcclxuICAgICAgU1FMYFNFTEVDVCBESVNUSU5DVCBcclxuICAgICAgdS51c2VyX2lkLCBcclxuICAgICAgcC5hbW91bnQgYXMgcHJlc3RpZ2UsIFxyXG4gICAgICB4LmFtb3VudCBhcyB4cCxcclxuICAgICAgcy5hbW91bnQgYXMgc3VwZXJwcmVzdGlnZSBcclxuICBGUk9NIHVzZXJfY3VycmVuY2llcyB1XHJcbiAgTEVGVCBKT0lOIHVzZXJfY3VycmVuY2llcyBwIE9OIHUudXNlcl9pZCA9IHAudXNlcl9pZCBBTkQgcC5jdXJyZW5jeV9pZCA9ICdwcmVzdGlnZSdcclxuICBMRUZUIEpPSU4gdXNlcl9jdXJyZW5jaWVzIHggT04gdS51c2VyX2lkID0geC51c2VyX2lkIEFORCB4LmN1cnJlbmN5X2lkID0gJ3hwJ1xyXG4gIExFRlQgSk9JTiB1c2VyX2N1cnJlbmNpZXMgcyBPTiB1LnVzZXJfaWQgPSBzLnVzZXJfaWQgQU5EIHMuY3VycmVuY3lfaWQgPSAnc3VwZXJwcmVzdGlnZScgXHJcbiAgV0hFUkUgcC5hbW91bnQgSVMgTk9UIE5VTEwgT1IgeC5hbW91bnQgSVMgTk9UIE5VTEwgT1Igcy5hbW91bnQgSVMgTk9UIE5VTExcclxuICBPUkRFUiBCWSBzdXBlcnByZXN0aWdlIERFU0MsIHByZXN0aWdlIERFU0MsIHhwIERFU0M7XHJcbmBcclxuICAgICk7XHJcbiAgICBsZXQgb3V0cHV0X21lc3NhZ2UgPSBgYDtcclxuICAgIGZvciAobGV0IGkgPSBpbmRpY2VzLm1pbjsgaSA8PSBpbmRpY2VzLm1heDsgaSsrKSB7XHJcbiAgICAgIGxldCB1c2VyX2RhdGEgPSBwcmVzdGlnZV9kYXRhW2ldO1xyXG4gICAgICBsZXQgdXNlcl9hbW91bnRfbWVzc2FnZSA9IGA8QCR7dXNlcl9kYXRhLnVzZXJfaWR9PiDilrggYDtcclxuICAgICAgaWYgKCF1c2VyX2RhdGEpIHJldHVybjtcclxuICAgICAgaWYgKHVzZXJfZGF0YS5zdXBlcnByZXN0aWdlID4gMClcclxuICAgICAgICB1c2VyX2Ftb3VudF9tZXNzYWdlICs9IGBTdXBlcnByZXN0aWdlICoqJHtudW1iZXJfZm9ybWF0X2NvbW1hcyhcclxuICAgICAgICAgIHVzZXJfZGF0YS5zdXBlcnByZXN0aWdlXHJcbiAgICAgICAgKX0qKiwgYDtcclxuICAgICAgaWYgKHVzZXJfZGF0YS5wcmVzdGlnZSA+IDApXHJcbiAgICAgICAgdXNlcl9hbW91bnRfbWVzc2FnZSArPSBgUHJlc3RpZ2UgKioke251bWJlcl9mb3JtYXRfY29tbWFzKFxyXG4gICAgICAgICAgdXNlcl9kYXRhLnByZXN0aWdlXHJcbiAgICAgICAgKX0qKiwgYDtcclxuICAgICAgdXNlcl9hbW91bnRfbWVzc2FnZSArPSBgTGV2ZWwgKioke251bWJlcl9mb3JtYXRfY29tbWFzKFxyXG4gICAgICAgIGxldmVsKHVzZXJfZGF0YS54cClcclxuICAgICAgKX0qKlxcbmA7XHJcbiAgICAgIG91dHB1dF9tZXNzYWdlICs9IHVzZXJfYW1vdW50X21lc3NhZ2U7XHJcbiAgICB9XHJcbiAgICBpZiAob3V0cHV0X21lc3NhZ2UgPT09IGBgKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcIk5vIGRhdGEgZXhpc3RzIGZvciBzcGVjaWZpZWQgcGFnZVwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0cHV0X21lc3NhZ2UgKz1cclxuICAgICAgICBcIlxcbltDbGljayBtZSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBQcmVzdGlnZSAmIFN1cGVyIFByZXN0aWdlXShodHRwczovL2Rpc2NvcmQuY29tL2NoYW5uZWxzLzkyMTQwMzMzODA2OTc3MDI4MC8xMjEyOTg5ODc4NDg1Mzg1MjM2KVwiO1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IFwiIyBYUCBMZWFkZXJib2FyZFxcblwiICsgb3V0cHV0X21lc3NhZ2UsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==