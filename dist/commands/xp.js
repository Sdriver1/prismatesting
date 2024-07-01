import * as Discord from "discord.js";
import { level, xp } from "../currency/configurers/leveling/formula.js";
import { get_currency_balance } from "../currency/operations/arithmetic.js";
import { number_format_commas } from "../util/number_format_commas.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("xp")
        .setDescription("Check your level")
        .addUserOption((option) => option.setName("target").setDescription("The user whose level to check")),
    run: async function (interaction) {
        const target = interaction.options.getUser("target") || interaction.user;
        interaction.editReply({
            content: await generate_level_description(target),
        });
    },
    options: {
        server_cooldown: 0,
    },
};
async function generate_level_description(user) {
    let user_id = user.id;
    const user_stats = await get_currency_balance(user_id);
    let output = `
### ${user.displayName}'s Level
${user_stats.superprestige > 0
        ? `▸ Super Prestige: **${number_format_commas(user_stats.superprestige)}**`
        : ``} 
${user_stats.prestige > 0
        ? `▸ Prestige: **${number_format_commas(user_stats.prestige)}**`
        : ``} 
▸ Level: **${number_format_commas(level(user_stats.xp))}**
▸ XP: **${number_format_commas(Math.round(user_stats.xp))}**
▸ XP to next level: **${number_format_commas(Math.ceil(xp(level(user_stats.xp) + 1) - user_stats.xp))}**`;
    return output;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMveHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM1RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN2RSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FDYixjQUFjLENBQUMsa0JBQWtCLENBQUM7U0FDbEMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDeEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsK0JBQStCLENBQUMsQ0FDekU7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQWdEO1FBRW5FLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFHekUsV0FBVyxDQUFDLFNBQVMsQ0FBQztZQUNwQixPQUFPLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQyxNQUFNLENBQUM7U0FDbEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELE9BQU8sRUFBRTtRQUNQLGVBQWUsRUFBRSxDQUFDO0tBQ25CO0NBQ0YsQ0FBQztBQUVGLEtBQUssVUFBVSwwQkFBMEIsQ0FBQyxJQUFrQjtJQUMxRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sVUFBVSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkQsSUFBSSxNQUFNLEdBQUc7TUFDVCxJQUFJLENBQUMsV0FBVztFQUVwQixVQUFVLENBQUMsYUFBYSxHQUFHLENBQUM7UUFDMUIsQ0FBQyxDQUFDLHVCQUF1QixvQkFBb0IsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUk7UUFDM0UsQ0FBQyxDQUFDLEVBQ047RUFFRSxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUM7UUFDckIsQ0FBQyxDQUFDLGlCQUFpQixvQkFBb0IsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUk7UUFDaEUsQ0FBQyxDQUFDLEVBQ047YUFDYSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1VBQzdDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNqQyxvQkFBb0IsQ0FDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQ3hELElBQUksQ0FBQztJQUNOLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGxldmVsLCB4cCB9IGZyb20gXCIuLi9jdXJyZW5jeS9jb25maWd1cmVycy9sZXZlbGluZy9mb3JtdWxhLmpzXCI7XHJcbmltcG9ydCB7IGdldF9jdXJyZW5jeV9iYWxhbmNlIH0gZnJvbSBcIi4uL2N1cnJlbmN5L29wZXJhdGlvbnMvYXJpdGhtZXRpYy5qc1wiO1xyXG5pbXBvcnQgeyBudW1iZXJfZm9ybWF0X2NvbW1hcyB9IGZyb20gXCIuLi91dGlsL251bWJlcl9mb3JtYXRfY29tbWFzLmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwieHBcIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIkNoZWNrIHlvdXIgbGV2ZWxcIilcclxuICAgIC5hZGRVc2VyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvbi5zZXROYW1lKFwidGFyZ2V0XCIpLnNldERlc2NyaXB0aW9uKFwiVGhlIHVzZXIgd2hvc2UgbGV2ZWwgdG8gY2hlY2tcIilcclxuICAgICksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uKSB7XHJcbiAgICAvLyBHZXQgb3B0aW9uc1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwidGFyZ2V0XCIpIHx8IGludGVyYWN0aW9uLnVzZXI7XHJcbiAgICAvLyBHZXQgY3VycmVuY3kgYmFsYW5jZVxyXG4gICAgLy8gUmVwbHkgd2l0aCBsZXZlbFxyXG4gICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgY29udGVudDogYXdhaXQgZ2VuZXJhdGVfbGV2ZWxfZGVzY3JpcHRpb24odGFyZ2V0KSxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZV9sZXZlbF9kZXNjcmlwdGlvbih1c2VyOiBEaXNjb3JkLlVzZXIpIHtcclxuICBsZXQgdXNlcl9pZCA9IHVzZXIuaWQ7XHJcbiAgY29uc3QgdXNlcl9zdGF0cyA9IGF3YWl0IGdldF9jdXJyZW5jeV9iYWxhbmNlKHVzZXJfaWQpO1xyXG4gIGxldCBvdXRwdXQgPSBgXHJcbiMjIyAke3VzZXIuZGlzcGxheU5hbWV9J3MgTGV2ZWxcclxuJHtcclxuICB1c2VyX3N0YXRzLnN1cGVycHJlc3RpZ2UgPiAwXHJcbiAgICA/IGDilrggU3VwZXIgUHJlc3RpZ2U6ICoqJHtudW1iZXJfZm9ybWF0X2NvbW1hcyh1c2VyX3N0YXRzLnN1cGVycHJlc3RpZ2UpfSoqYFxyXG4gICAgOiBgYFxyXG59IFxyXG4ke1xyXG4gIHVzZXJfc3RhdHMucHJlc3RpZ2UgPiAwXHJcbiAgICA/IGDilrggUHJlc3RpZ2U6ICoqJHtudW1iZXJfZm9ybWF0X2NvbW1hcyh1c2VyX3N0YXRzLnByZXN0aWdlKX0qKmBcclxuICAgIDogYGBcclxufSBcclxu4pa4IExldmVsOiAqKiR7bnVtYmVyX2Zvcm1hdF9jb21tYXMobGV2ZWwodXNlcl9zdGF0cy54cCkpfSoqXHJcbuKWuCBYUDogKioke251bWJlcl9mb3JtYXRfY29tbWFzKE1hdGgucm91bmQodXNlcl9zdGF0cy54cCkpfSoqXHJcbuKWuCBYUCB0byBuZXh0IGxldmVsOiAqKiR7bnVtYmVyX2Zvcm1hdF9jb21tYXMoXHJcbiAgICBNYXRoLmNlaWwoeHAobGV2ZWwodXNlcl9zdGF0cy54cCkgKyAxKSAtIHVzZXJfc3RhdHMueHApXHJcbiAgKX0qKmA7XHJcbiAgcmV0dXJuIG91dHB1dDtcclxufVxyXG4iXX0=