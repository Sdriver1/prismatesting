import * as Discord from "discord.js";
import { buy_item } from "../command_parts/buy_item.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item")
        .addStringOption((option) => option
        .setName("item_name")
        .setDescription("The item you want to buy")
        .setRequired(true))
        .addUserOption((option) => option
        .setName("gift_to")
        .setDescription("The user you want to gift the item to"))
        .addBooleanOption((option) => option
        .setName("gift_anonymously")
        .setDescription("Whether or not you want the recipient to know who sent this"))
        .addStringOption((option) => option
        .setName("gift_message")
        .setDescription("The message the bot should pass along with your gift")),
    run: async function (interaction) {
        try {
            await buy_item({
                buyer: interaction.user,
                item_name: interaction.options.getString("item_name"),
                gift_anonymously: interaction.options.getBoolean("gift_anonymously"),
                gift_receiver: interaction.options.getUser("gift_to"),
                gift_message: interaction.options.getString("gift_message"),
            });
        }
        catch (err) {
            interaction.editReply({ content: `${err.message}` });
            return;
        }
        interaction.editReply(`# Purchase successful!\n▸ Thanks for shopping with Prismatic :)\n> ▸ Not like we have any competition!`);
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2J1eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFeEQsZUFBZTtJQUNiLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtTQUNwQyxPQUFPLENBQUMsS0FBSyxDQUFDO1NBQ2QsY0FBYyxDQUFDLGFBQWEsQ0FBQztTQUM3QixlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFdBQVcsQ0FBQztTQUNwQixjQUFjLENBQUMsMEJBQTBCLENBQUM7U0FDMUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtTQUNBLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3hCLE1BQU07U0FDSCxPQUFPLENBQUMsU0FBUyxDQUFDO1NBQ2xCLGNBQWMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUMzRDtTQUNBLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDM0IsTUFBTTtTQUNILE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztTQUMzQixjQUFjLENBQ2IsNkRBQTZELENBQzlELENBQ0o7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLGNBQWMsQ0FBQztTQUN2QixjQUFjLENBQUMsc0RBQXNELENBQUMsQ0FDMUU7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQWdEO1FBQ25FLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxDQUFDO2dCQUNiLEtBQUssRUFBRSxXQUFXLENBQUMsSUFBSTtnQkFDdkIsU0FBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDckQsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3BFLGFBQWEsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7Z0JBQ3JELFlBQVksRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7YUFDNUQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyRCxPQUFPO1FBQ1QsQ0FBQztRQUNELFdBQVcsQ0FBQyxTQUFTLENBQ25CLHdHQUF3RyxDQUN6RyxDQUFDO0lBQ0osQ0FBQztJQUNELE9BQU8sRUFBRTtRQUNQLGVBQWUsRUFBRSxDQUFDO0tBQ25CO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgYnV5X2l0ZW0gfSBmcm9tIFwiLi4vY29tbWFuZF9wYXJ0cy9idXlfaXRlbS5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6IG5ldyBEaXNjb3JkLlNsYXNoQ29tbWFuZEJ1aWxkZXIoKVxyXG4gICAgLnNldE5hbWUoXCJidXlcIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIkJ1eSBhbiBpdGVtXCIpXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiaXRlbV9uYW1lXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIGl0ZW0geW91IHdhbnQgdG8gYnV5XCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApXHJcbiAgICAuYWRkVXNlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImdpZnRfdG9cIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgdXNlciB5b3Ugd2FudCB0byBnaWZ0IHRoZSBpdGVtIHRvXCIpXHJcbiAgICApXHJcbiAgICAuYWRkQm9vbGVhbk9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImdpZnRfYW5vbnltb3VzbHlcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIldoZXRoZXIgb3Igbm90IHlvdSB3YW50IHRoZSByZWNpcGllbnQgdG8ga25vdyB3aG8gc2VudCB0aGlzXCJcclxuICAgICAgICApXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiZ2lmdF9tZXNzYWdlXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIG1lc3NhZ2UgdGhlIGJvdCBzaG91bGQgcGFzcyBhbG9uZyB3aXRoIHlvdXIgZ2lmdFwiKVxyXG4gICAgKSxcclxuICBydW46IGFzeW5jIGZ1bmN0aW9uIChpbnRlcmFjdGlvbjogRGlzY29yZC5DaGF0SW5wdXRDb21tYW5kSW50ZXJhY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGJ1eV9pdGVtKHtcclxuICAgICAgICBidXllcjogaW50ZXJhY3Rpb24udXNlcixcclxuICAgICAgICBpdGVtX25hbWU6IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiaXRlbV9uYW1lXCIpLFxyXG4gICAgICAgIGdpZnRfYW5vbnltb3VzbHk6IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0Qm9vbGVhbihcImdpZnRfYW5vbnltb3VzbHlcIiksXHJcbiAgICAgICAgZ2lmdF9yZWNlaXZlcjogaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwiZ2lmdF90b1wiKSxcclxuICAgICAgICBnaWZ0X21lc3NhZ2U6IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiZ2lmdF9tZXNzYWdlXCIpLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoeyBjb250ZW50OiBgJHtlcnIubWVzc2FnZX1gIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgIGAjIFB1cmNoYXNlIHN1Y2Nlc3NmdWwhXFxu4pa4IFRoYW5rcyBmb3Igc2hvcHBpbmcgd2l0aCBQcmlzbWF0aWMgOilcXG4+IOKWuCBOb3QgbGlrZSB3ZSBoYXZlIGFueSBjb21wZXRpdGlvbiFgXHJcbiAgICApO1xyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==