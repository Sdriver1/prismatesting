import * as Discord from "discord.js";
import { edit_xp_boost } from "../currency/configurers/xp_boosts.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("editboost")
        .setDescription("Configure a currency's transferrable, auto give, & negative settings")
        .addStringOption((option) => option
        .setName("boost_id")
        .setDescription("The ID of the boost you want to edit")
        .setRequired(true))
        .addUserOption((option) => option
        .setName("new_owner")
        .setDescription("The new boost owner (takes boost from existing owner)"))
        .addNumberOption((option) => option
        .setName("new_duration")
        .setDescription("The new duration in minutes (overrides existing duration)"))
        .addNumberOption((option) => option.setName("new_multiplier").setDescription("The new multiplier")),
    run: async function (interaction) {
        const boost_id = interaction.options.getString("boost_id");
        let new_owner = interaction.options.getUser("new_owner")
            ? interaction.options.getUser("new_owner").id
            : undefined;
        let new_duration = interaction.options.getNumber("new_duration");
        const new_multiplier = interaction.options.getNumber("new_multiplier");
        try {
            await edit_xp_boost({
                id: boost_id,
                owner_id: new_owner,
                unclaimed_time_ms: new_duration * 60 * 1000,
                multiplier: new_multiplier,
            });
            interaction.editReply({
                content: `Successfully edited boost \`${boost_id}\`.`,
            });
        }
        catch (err) {
            interaction.editReply({
                content: `${err}`,
            });
        }
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGJvb3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2VkaXRib29zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsZUFBZTtJQUNiLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtTQUNwQyxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3BCLGNBQWMsQ0FDYixzRUFBc0UsQ0FDdkU7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUNuQixjQUFjLENBQUMsc0NBQXNDLENBQUM7U0FDdEQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtTQUNBLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3hCLE1BQU07U0FDSCxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3BCLGNBQWMsQ0FBQyx1REFBdUQsQ0FBQyxDQUMzRTtTQUNBLGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsY0FBYyxDQUFDO1NBQ3ZCLGNBQWMsQ0FDYiwyREFBMkQsQ0FDNUQsQ0FDSjtTQUNBLGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FDdEU7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQWdEO1FBRW5FLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUN0RCxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRTtZQUM3QyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2QsSUFBSSxZQUFZLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakUsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUV2RSxJQUFJLENBQUM7WUFDSCxNQUFNLGFBQWEsQ0FBQztnQkFDbEIsRUFBRSxFQUFFLFFBQVE7Z0JBQ1osUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLGlCQUFpQixFQUFFLFlBQVksR0FBRyxFQUFFLEdBQUcsSUFBSTtnQkFDM0MsVUFBVSxFQUFFLGNBQWM7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLCtCQUErQixRQUFRLEtBQUs7YUFDdEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUU7YUFDbEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGVkaXRfeHBfYm9vc3QgfSBmcm9tIFwiLi4vY3VycmVuY3kvY29uZmlndXJlcnMveHBfYm9vc3RzLmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwiZWRpdGJvb3N0XCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgIFwiQ29uZmlndXJlIGEgY3VycmVuY3kncyB0cmFuc2ZlcnJhYmxlLCBhdXRvIGdpdmUsICYgbmVnYXRpdmUgc2V0dGluZ3NcIlxyXG4gICAgKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImJvb3N0X2lkXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIElEIG9mIHRoZSBib29zdCB5b3Ugd2FudCB0byBlZGl0XCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApXHJcbiAgICAuYWRkVXNlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcIm5ld19vd25lclwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBuZXcgYm9vc3Qgb3duZXIgKHRha2VzIGJvb3N0IGZyb20gZXhpc3Rpbmcgb3duZXIpXCIpXHJcbiAgICApXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwibmV3X2R1cmF0aW9uXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFxyXG4gICAgICAgICAgXCJUaGUgbmV3IGR1cmF0aW9uIGluIG1pbnV0ZXMgKG92ZXJyaWRlcyBleGlzdGluZyBkdXJhdGlvbilcIlxyXG4gICAgICAgIClcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uLnNldE5hbWUoXCJuZXdfbXVsdGlwbGllclwiKS5zZXREZXNjcmlwdGlvbihcIlRoZSBuZXcgbXVsdGlwbGllclwiKVxyXG4gICAgKSxcclxuICBydW46IGFzeW5jIGZ1bmN0aW9uIChpbnRlcmFjdGlvbjogRGlzY29yZC5DaGF0SW5wdXRDb21tYW5kSW50ZXJhY3Rpb24pIHtcclxuICAgIC8vIEdldCBvcHRpb25zXHJcbiAgICBjb25zdCBib29zdF9pZCA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiYm9vc3RfaWRcIik7XHJcbiAgICBsZXQgbmV3X293bmVyID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwibmV3X293bmVyXCIpXHJcbiAgICAgID8gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwibmV3X293bmVyXCIpLmlkXHJcbiAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgbGV0IG5ld19kdXJhdGlvbiA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0TnVtYmVyKFwibmV3X2R1cmF0aW9uXCIpO1xyXG4gICAgY29uc3QgbmV3X211bHRpcGxpZXIgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcIm5ld19tdWx0aXBsaWVyXCIpO1xyXG4gICAgLy8gQ29uZmlndXJlIGN1cnJlbmN5XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBlZGl0X3hwX2Jvb3N0KHtcclxuICAgICAgICBpZDogYm9vc3RfaWQsXHJcbiAgICAgICAgb3duZXJfaWQ6IG5ld19vd25lcixcclxuICAgICAgICB1bmNsYWltZWRfdGltZV9tczogbmV3X2R1cmF0aW9uICogNjAgKiAxMDAwLFxyXG4gICAgICAgIG11bHRpcGxpZXI6IG5ld19tdWx0aXBsaWVyLFxyXG4gICAgICB9KTtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgU3VjY2Vzc2Z1bGx5IGVkaXRlZCBib29zdCBcXGAke2Jvb3N0X2lkfVxcYC5gLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGAke2Vycn1gLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMCxcclxuICB9LFxyXG59O1xyXG4iXX0=