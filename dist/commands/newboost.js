import * as Discord from "discord.js";
import { generate_xp_boost } from "../currency/configurers/xp_boosts.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("newboost")
        .setDescription("Generate an XP boost for a user")
        .addNumberOption((option) => option
        .setName("multiplier")
        .setDescription("The factor XP is multiplied by while the boost is active")
        .setRequired(true))
        .addNumberOption((option) => option
        .setName("duration")
        .setDescription("The duration (in minutes)")
        .setRequired(true))
        .addUserOption((option) => option
        .setName("owner")
        .setDescription("The user who owns the boost")
        .setRequired(true)),
    run: async function (interaction) {
        const multiplier = interaction.options.getNumber("multiplier");
        const duration = interaction.options.getNumber("duration") * 60 * 1000;
        const owner = interaction.options.getUser("owner");
        try {
            await generate_xp_boost({
                multiplier: multiplier,
                unclaimed_time_ms: duration,
                owner_id: owner.id,
            });
            interaction.editReply({
                content: "Successfuly generated boost.",
            });
        }
        catch (err) {
            interaction.editReply(`**Rats!** I couldn't generate that boost. Error: ${err}`);
        }
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3Ym9vc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbmV3Ym9vc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDekUsZUFBZTtJQUNiLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtTQUNwQyxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ25CLGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBQztTQUNqRCxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUNyQixjQUFjLENBQ2IsMERBQTBELENBQzNEO1NBQ0EsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtTQUNBLGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ25CLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQztTQUMzQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDeEIsTUFBTTtTQUNILE9BQU8sQ0FBQyxPQUFPLENBQUM7U0FDaEIsY0FBYyxDQUFDLDZCQUE2QixDQUFDO1NBQzdDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQWdEO1FBQ25FLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9ELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDdkUsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDO1lBQ0gsTUFBTSxpQkFBaUIsQ0FBQztnQkFDdEIsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLGlCQUFpQixFQUFFLFFBQVE7Z0JBQzNCLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTthQUNuQixDQUFDLENBQUM7WUFDSCxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsOEJBQThCO2FBQ3hDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsV0FBVyxDQUFDLFNBQVMsQ0FDbkIsb0RBQW9ELEdBQUcsRUFBRSxDQUMxRCxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGdlbmVyYXRlX3hwX2Jvb3N0IH0gZnJvbSBcIi4uL2N1cnJlbmN5L2NvbmZpZ3VyZXJzL3hwX2Jvb3N0cy5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcIm5ld2Jvb3N0XCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJHZW5lcmF0ZSBhbiBYUCBib29zdCBmb3IgYSB1c2VyXCIpXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwibXVsdGlwbGllclwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcclxuICAgICAgICAgIFwiVGhlIGZhY3RvciBYUCBpcyBtdWx0aXBsaWVkIGJ5IHdoaWxlIHRoZSBib29zdCBpcyBhY3RpdmVcIlxyXG4gICAgICAgIClcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJkdXJhdGlvblwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBkdXJhdGlvbiAoaW4gbWludXRlcylcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGRVc2VyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwib3duZXJcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgdXNlciB3aG8gb3ducyB0aGUgYm9vc3RcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgICksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uKSB7XHJcbiAgICBjb25zdCBtdWx0aXBsaWVyID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJtdWx0aXBsaWVyXCIpO1xyXG4gICAgY29uc3QgZHVyYXRpb24gPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcImR1cmF0aW9uXCIpICogNjAgKiAxMDAwO1xyXG4gICAgY29uc3Qgb3duZXIgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFVzZXIoXCJvd25lclwiKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGdlbmVyYXRlX3hwX2Jvb3N0KHtcclxuICAgICAgICBtdWx0aXBsaWVyOiBtdWx0aXBsaWVyLFxyXG4gICAgICAgIHVuY2xhaW1lZF90aW1lX21zOiBkdXJhdGlvbixcclxuICAgICAgICBvd25lcl9pZDogb3duZXIuaWQsXHJcbiAgICAgIH0pO1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IFwiU3VjY2Vzc2Z1bHkgZ2VuZXJhdGVkIGJvb3N0LlwiLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgICAgYCoqUmF0cyEqKiBJIGNvdWxkbid0IGdlbmVyYXRlIHRoYXQgYm9vc3QuIEVycm9yOiAke2Vycn1gXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvcHRpb25zOiB7XHJcbiAgICBzZXJ2ZXJfY29vbGRvd246IDAsXHJcbiAgfSxcclxufTtcclxuIl19