import * as Discord from "discord.js";
import { add_currency, get_currency_balance, } from "../currency/operations/arithmetic.js";
import { get_currency_config } from "../currency/configurers/currencies.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Give currency to another user from your own balance")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("The user to transfer the currency to")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("currency")
        .setDescription("The currency to transfer")
        .setRequired(true))
        .addNumberOption((option) => option
        .setName("amount")
        .setDescription("The amount to give. Must be a positive integer.")
        .setRequired(true))
        .addBooleanOption((option) => option
        .setName("private")
        .setDescription("Whether to hide the chat message I will send showing this transfer happened")),
    run: async function (interaction) {
        const target = interaction.options.getUser("target");
        const currency = interaction.options.getString("currency");
        const amount = interaction.options.getNumber("amount") ||
            (await get_currency_balance(interaction.user.id, currency));
        const hide_transfer = interaction.options.getBoolean("private");
        const balance = await get_currency_balance(interaction.user.id, currency);
        if (!Number.isInteger(amount) || Number.isNaN(amount)) {
            interaction.editReply("Hey! Use a valid amount of currency (no decimals or non-numbers)! (  •̀ ᴖ •́  )");
            return;
        }
        if (target.bot) {
            interaction.editReply("Hey! Stop trying to add currency to bots! (  •̀ ᴖ •́  )");
            return;
        }
        try {
            if (balance < amount) {
                interaction.editReply({
                    content: `You don't have enough ${currency} to do this!`,
                });
                return;
            }
        }
        catch (err) {
            interaction.editReply({
                content: `An error occured while checking your balance of ${currency}: ${err}`,
            });
            return;
        }
        if (amount <= 0) {
            interaction.editReply({
                content: `Hey! Stop trying to transfer people negative money! That's rude! (  •̀ ᴖ •́  )`,
            });
            return;
        }
        try {
            const config = await get_currency_config(currency);
            if (!config.transferrable) {
                interaction.editReply({
                    content: `You can't transfer ${currency}!`,
                });
                return;
            }
        }
        catch (err) {
            interaction.editReply({
                content: `An error occured while checking if ${currency} is transferrable: ${err}`,
            });
            return;
        }
        try {
            await add_currency(interaction.user.id, currency, -amount, "User transfer");
            await add_currency(target.id, currency, amount, "User transfer");
            interaction.editReply({
                content: `Successfully transferred ${amount} ${currency} to ${target.username}`,
            });
            if (!hide_transfer) {
                let transfer_message = `:money_with_wings: <@${interaction.user.id}> transferred **${amount}** ${currency} to <@${target.id}>!`;
                if (target.id === interaction.user.id)
                    transfer_message += " What was the point of that, though?";
                interaction.channel.send({
                    content: transfer_message,
                });
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvdHJhbnNmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUNMLFlBQVksRUFDWixvQkFBb0IsR0FDckIsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM1RSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxVQUFVLENBQUM7U0FDbkIsY0FBYyxDQUFDLHFEQUFxRCxDQUFDO1NBQ3JFLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3hCLE1BQU07U0FDSCxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ2pCLGNBQWMsQ0FBQyxzQ0FBc0MsQ0FBQztTQUN0RCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxVQUFVLENBQUM7U0FDbkIsY0FBYyxDQUFDLDBCQUEwQixDQUFDO1NBQzFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUNqQixjQUFjLENBQUMsaURBQWlELENBQUM7U0FDakUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtTQUNBLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDM0IsTUFBTTtTQUNILE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDbEIsY0FBYyxDQUNiLDZFQUE2RSxDQUM5RSxDQUNKO0lBQ0gsR0FBRyxFQUFFLEtBQUssV0FBVyxXQUFnRDtRQUVuRSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FDVixXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDdkMsQ0FBQyxNQUFNLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDdEQsV0FBVyxDQUFDLFNBQVMsQ0FDbkIsaUZBQWlGLENBQ2xGLENBQUM7WUFDRixPQUFPO1FBQ1QsQ0FBQztRQUNELElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2YsV0FBVyxDQUFDLFNBQVMsQ0FDbkIseURBQXlELENBQzFELENBQUM7WUFDRixPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILElBQUksT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDO2dCQUNyQixXQUFXLENBQUMsU0FBUyxDQUFDO29CQUNwQixPQUFPLEVBQUUseUJBQXlCLFFBQVEsY0FBYztpQkFDekQsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDVCxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsbURBQW1ELFFBQVEsS0FBSyxHQUFHLEVBQUU7YUFDL0UsQ0FBQyxDQUFDO1lBQ0gsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNoQixXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsZ0ZBQWdGO2FBQzFGLENBQUMsQ0FBQztZQUNILE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUMxQixXQUFXLENBQUMsU0FBUyxDQUFDO29CQUNwQixPQUFPLEVBQUUsc0JBQXNCLFFBQVEsR0FBRztpQkFDM0MsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDVCxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsc0NBQXNDLFFBQVEsc0JBQXNCLEdBQUcsRUFBRTthQUNuRixDQUFDLENBQUM7WUFDSCxPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQztZQUNILE1BQU0sWUFBWSxDQUNoQixXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFDbkIsUUFBUSxFQUNSLENBQUMsTUFBTSxFQUNQLGVBQWUsQ0FDaEIsQ0FBQztZQUNGLE1BQU0sWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNqRSxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsNEJBQTRCLE1BQU0sSUFBSSxRQUFRLE9BQU8sTUFBTSxDQUFDLFFBQVEsRUFBRTthQUNoRixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ25CLElBQUksZ0JBQWdCLEdBQUcsd0JBQXdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxtQkFBbUIsTUFBTSxNQUFNLFFBQVEsU0FBUyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUM7Z0JBQ2hJLElBQUksTUFBTSxDQUFDLEVBQUUsS0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ25DLGdCQUFnQixJQUFJLHNDQUFzQyxDQUFDO2dCQUM3RCxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLGdCQUFnQjtpQkFDMUIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7UUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLEdBQUcsR0FBRyxFQUFFO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsZUFBZSxFQUFFLENBQUM7S0FDbkI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRGlzY29yZCBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5pbXBvcnQge1xyXG4gIGFkZF9jdXJyZW5jeSxcclxuICBnZXRfY3VycmVuY3lfYmFsYW5jZSxcclxufSBmcm9tIFwiLi4vY3VycmVuY3kvb3BlcmF0aW9ucy9hcml0aG1ldGljLmpzXCI7XHJcbmltcG9ydCB7IGdldF9jdXJyZW5jeV9jb25maWcgfSBmcm9tIFwiLi4vY3VycmVuY3kvY29uZmlndXJlcnMvY3VycmVuY2llcy5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcInRyYW5zZmVyXCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJHaXZlIGN1cnJlbmN5IHRvIGFub3RoZXIgdXNlciBmcm9tIHlvdXIgb3duIGJhbGFuY2VcIilcclxuICAgIC5hZGRVc2VyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwidGFyZ2V0XCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIHVzZXIgdG8gdHJhbnNmZXIgdGhlIGN1cnJlbmN5IHRvXCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiY3VycmVuY3lcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgY3VycmVuY3kgdG8gdHJhbnNmZXJcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJhbW91bnRcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgYW1vdW50IHRvIGdpdmUuIE11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKVxyXG4gICAgICAgIC5zZXRSZXF1aXJlZCh0cnVlKVxyXG4gICAgKVxyXG4gICAgLmFkZEJvb2xlYW5PcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJwcml2YXRlXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFxyXG4gICAgICAgICAgXCJXaGV0aGVyIHRvIGhpZGUgdGhlIGNoYXQgbWVzc2FnZSBJIHdpbGwgc2VuZCBzaG93aW5nIHRoaXMgdHJhbnNmZXIgaGFwcGVuZWRcIlxyXG4gICAgICAgIClcclxuICAgICksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uKSB7XHJcbiAgICAvLyBHZXQgb3B0aW9uc1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwidGFyZ2V0XCIpO1xyXG4gICAgY29uc3QgY3VycmVuY3kgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImN1cnJlbmN5XCIpO1xyXG4gICAgY29uc3QgYW1vdW50ID1cclxuICAgICAgaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJhbW91bnRcIikgfHxcclxuICAgICAgKGF3YWl0IGdldF9jdXJyZW5jeV9iYWxhbmNlKGludGVyYWN0aW9uLnVzZXIuaWQsIGN1cnJlbmN5KSk7XHJcbiAgICBjb25zdCBoaWRlX3RyYW5zZmVyID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRCb29sZWFuKFwicHJpdmF0ZVwiKTtcclxuICAgIGNvbnN0IGJhbGFuY2UgPSBhd2FpdCBnZXRfY3VycmVuY3lfYmFsYW5jZShpbnRlcmFjdGlvbi51c2VyLmlkLCBjdXJyZW5jeSk7XHJcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoYW1vdW50KSB8fCBOdW1iZXIuaXNOYU4oYW1vdW50KSkge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgICAgXCJIZXkhIFVzZSBhIHZhbGlkIGFtb3VudCBvZiBjdXJyZW5jeSAobm8gZGVjaW1hbHMgb3Igbm9uLW51bWJlcnMpISAoICDigKLMgCDhtJYg4oCizIEgIClcIlxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodGFyZ2V0LmJvdCkge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgICAgXCJIZXkhIFN0b3AgdHJ5aW5nIHRvIGFkZCBjdXJyZW5jeSB0byBib3RzISAoICDigKLMgCDhtJYg4oCizIEgIClcIlxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIHVzZXIgaGFzIGVub3VnaCBtb25leSB0byBkbyB0aGlzXHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoYmFsYW5jZSA8IGFtb3VudCkge1xyXG4gICAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgICBjb250ZW50OiBgWW91IGRvbid0IGhhdmUgZW5vdWdoICR7Y3VycmVuY3l9IHRvIGRvIHRoaXMhYCxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGBBbiBlcnJvciBvY2N1cmVkIHdoaWxlIGNoZWNraW5nIHlvdXIgYmFsYW5jZSBvZiAke2N1cnJlbmN5fTogJHtlcnJ9YCxcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgdXNlciBpc24ndCB0cmFuc2ZlcnJpbmcgbmVnYXRpdmUgbW9uZXlcclxuICAgIGlmIChhbW91bnQgPD0gMCkge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGBIZXkhIFN0b3AgdHJ5aW5nIHRvIHRyYW5zZmVyIHBlb3BsZSBuZWdhdGl2ZSBtb25leSEgVGhhdCdzIHJ1ZGUhICggIOKAosyAIOG0liDigKLMgSAgKWAsXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIGN1cnJlbmN5IGlzIHRyYW5zZmVycmFibGVcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IGdldF9jdXJyZW5jeV9jb25maWcoY3VycmVuY3kpO1xyXG4gICAgICBpZiAoIWNvbmZpZy50cmFuc2ZlcnJhYmxlKSB7XHJcbiAgICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICAgIGNvbnRlbnQ6IGBZb3UgY2FuJ3QgdHJhbnNmZXIgJHtjdXJyZW5jeX0hYCxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGBBbiBlcnJvciBvY2N1cmVkIHdoaWxlIGNoZWNraW5nIGlmICR7Y3VycmVuY3l9IGlzIHRyYW5zZmVycmFibGU6ICR7ZXJyfWAsXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgY3VycmVuY3kgdG8gdXNlclxyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgYWRkX2N1cnJlbmN5KFxyXG4gICAgICAgIGludGVyYWN0aW9uLnVzZXIuaWQsXHJcbiAgICAgICAgY3VycmVuY3ksXHJcbiAgICAgICAgLWFtb3VudCxcclxuICAgICAgICBcIlVzZXIgdHJhbnNmZXJcIlxyXG4gICAgICApO1xyXG4gICAgICBhd2FpdCBhZGRfY3VycmVuY3kodGFyZ2V0LmlkLCBjdXJyZW5jeSwgYW1vdW50LCBcIlVzZXIgdHJhbnNmZXJcIik7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYFN1Y2Nlc3NmdWxseSB0cmFuc2ZlcnJlZCAke2Ftb3VudH0gJHtjdXJyZW5jeX0gdG8gJHt0YXJnZXQudXNlcm5hbWV9YCxcclxuICAgICAgfSk7XHJcbiAgICAgIGlmICghaGlkZV90cmFuc2Zlcikge1xyXG4gICAgICAgIGxldCB0cmFuc2Zlcl9tZXNzYWdlID0gYDptb25leV93aXRoX3dpbmdzOiA8QCR7aW50ZXJhY3Rpb24udXNlci5pZH0+IHRyYW5zZmVycmVkICoqJHthbW91bnR9KiogJHtjdXJyZW5jeX0gdG8gPEAke3RhcmdldC5pZH0+IWA7XHJcbiAgICAgICAgaWYgKHRhcmdldC5pZCA9PT0gaW50ZXJhY3Rpb24udXNlci5pZClcclxuICAgICAgICAgIHRyYW5zZmVyX21lc3NhZ2UgKz0gXCIgV2hhdCB3YXMgdGhlIHBvaW50IG9mIHRoYXQsIHRob3VnaD9cIjtcclxuICAgICAgICBpbnRlcmFjdGlvbi5jaGFubmVsLnNlbmQoe1xyXG4gICAgICAgICAgY29udGVudDogdHJhbnNmZXJfbWVzc2FnZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYCR7ZXJyfWAsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==