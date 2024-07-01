import * as Discord from "discord.js";
import { create_store_item } from "../currency/configurers/storeitems.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("newstoreitem")
        .setDescription("Add a new item to any currency's store")
        .addStringOption((option) => option
        .setName("item_name")
        .setDescription("The name of the item you want to add. Must be unique.")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("currency_required")
        .setDescription("The currency used to buy this item")
        .setRequired(true))
        .addNumberOption((option) => option
        .setName("price")
        .setDescription("The amount, in currency, the item costs")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("description")
        .setDescription("The item's description shown in /shop")
        .setRequired(true))
        .addRoleOption((option) => option
        .setName("role_to_give")
        .setDescription("The role (if any) to give to the user when they buy this item"))
        .addNumberOption((option) => option
        .setName("role_duration")
        .setDescription("How long (in minutes) the user should keep the role (blank = infinite)"))
        .addStringOption((option) => option
        .setName("currency_to_give")
        .setDescription("The currency the user should get when they buy this item"))
        .addNumberOption((option) => option
        .setName("currency_to_give_amount")
        .setDescription("The amount of currency the user should get when they buy this item")),
    run: async function (interaction) {
        const item_name = interaction.options.getString("item_name");
        const currency_required = interaction.options.getString("currency_required");
        const price = interaction.options.getNumber("price");
        const description = interaction.options.getString("description");
        const role_to_give = interaction.options.getRole("role_to_give");
        const role_duration = interaction.options.getNumber("role_duration");
        const currency_to_give = interaction.options.getString("currency_to_give");
        const currency_to_give_amount = interaction.options.getNumber("currency_to_give_amount");
        if (price < 0) {
            interaction.editReply({
                content: "Negative prices? Real funny there. How the fuck do you think an interaction like this would go in real life? You go to the grocery store, buy your stuff, and the cashier hands you your shit and $100?!?!? You fucking wish. (  •̀ ᴖ •́  )",
            });
            return;
        }
        if (!(await does_currency_exist(currency_required))) {
            interaction.editReply({
                content: "Every day, I get more and more tired of people like you who think it's funny to try to break the bot. How the fuck do you think this interaction would play out? You go to the grocery store, buy your shit, and the cashier tries to charge you 49 Snorgles for your fucking food?!?! It's not so funny when the joke is played on you, is it? Stop trying to make store items that charge currency that doesn't exist. (  •̀ ᴖ •́  )",
            });
            return;
        }
        let role_to_give_id = role_to_give ? role_to_give.id : undefined;
        try {
            await create_store_item({
                item_name,
                currency_required,
                price,
                description,
                role_to_give_id,
                role_duration,
                currency_to_give,
                currency_to_give_amount,
            });
            interaction.editReply({
                content: `Successfully created store item \`${item_name}\``,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3c3RvcmVpdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL25ld3N0b3JlaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNwRixlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxjQUFjLENBQUM7U0FDdkIsY0FBYyxDQUFDLHdDQUF3QyxDQUFDO1NBQ3hELGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3BCLGNBQWMsQ0FBQyx1REFBdUQsQ0FBQztTQUN2RSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztTQUM1QixjQUFjLENBQUMsb0NBQW9DLENBQUM7U0FDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtTQUNBLGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ2hCLGNBQWMsQ0FBQyx5Q0FBeUMsQ0FBQztTQUN6RCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxhQUFhLENBQUM7U0FDdEIsY0FBYyxDQUFDLHVDQUF1QyxDQUFDO1NBQ3ZELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7U0FDQSxhQUFhLENBQUMs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XG5pbXBvcnQgeyBjcmVhdGVfc3RvcmVfaXRlbSB9IGZyb20gXCIuLi9jdXJyZW5jeS9jb25maWd1cmVycy9zdG9yZWl0ZW1zLmpzXCI7XHJcbmltcG9ydCB7IGRvZXNfY3VycmVuY3lfZXhpc3QgfSBmcm9tIFwiLi4vY3VycmVuY3kvb3BlcmF0aW9ucy9kb2VzX2N1cnJlbmN5X2V4aXN0LmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwibmV3c3RvcmVpdGVtXCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJBZGQgYSBuZXcgaXRlbSB0byBhbnkgY3VycmVuY3kncyBzdG9yZVwiKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcIml0ZW1fbmFtZVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBuYW1lIG9mIHRoZSBpdGVtIHlvdSB3YW50IHRvIGFkZC4gTXVzdCBiZSB1bmlxdWUuXCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiY3VycmVuY3lfcmVxdWlyZWRcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgY3VycmVuY3kgdXNlZCB0byBidXkgdGhpcyBpdGVtXCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwicHJpY2VcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgYW1vdW50LCBpbiBjdXJyZW5jeSwgdGhlIGl0ZW0gY29zdHNcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJkZXNjcmlwdGlvblwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBpdGVtJ3MgZGVzY3JpcHRpb24gc2hvd24gaW4gL3Nob3BcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGRSb2xlT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwicm9sZV90b19naXZlXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFxyXG4gICAgICAgICAgXCJUaGUgcm9sZSAoaWYgYW55KSB0byBnaXZlIHRvIHRoZSB1c2VyIHdoZW4gdGhleSBidXkgdGhpcyBpdGVtXCJcclxuICAgICAgICApXHJcbiAgICApXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwicm9sZV9kdXJhdGlvblwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcclxuICAgICAgICAgIFwiSG93IGxvbmcgKGluIG1pbnV0ZXMpIHRoZSB1c2VyIHNob3VsZCBrZWVwIHRoZSByb2xlIChibGFuayA9IGluZmluaXRlKVwiXHJcbiAgICAgICAgKVxyXG4gICAgKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImN1cnJlbmN5X3RvX2dpdmVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIlRoZSBjdXJyZW5jeSB0aGUgdXNlciBzaG91bGQgZ2V0IHdoZW4gdGhleSBidXkgdGhpcyBpdGVtXCJcclxuICAgICAgICApXHJcbiAgICApXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiY3VycmVuY3lfdG9fZ2l2ZV9hbW91bnRcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIlRoZSBhbW91bnQgb2YgY3VycmVuY3kgdGhlIHVzZXIgc2hvdWxkIGdldCB3aGVuIHRoZXkgYnV5IHRoaXMgaXRlbVwiXHJcbiAgICAgICAgKVxyXG4gICAgKSxcclxuICBydW46IGFzeW5jIGZ1bmN0aW9uIChpbnRlcmFjdGlvbjogRGlzY29yZC5DaGF0SW5wdXRDb21tYW5kSW50ZXJhY3Rpb24pIHtcclxuICAgIC8vLyBHZXQgZXZlcnkgb3B0aW9uXHJcbiAgICBjb25zdCBpdGVtX25hbWUgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcIml0ZW1fbmFtZVwiKTtcclxuICAgIGNvbnN0IGN1cnJlbmN5X3JlcXVpcmVkID1cclxuICAgICAgaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJjdXJyZW5jeV9yZXF1aXJlZFwiKTtcclxuICAgIGNvbnN0IHByaWNlID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJwcmljZVwiKTtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJkZXNjcmlwdGlvblwiKTtcclxuICAgIGNvbnN0IHJvbGVfdG9fZ2l2ZSA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0Um9sZShcInJvbGVfdG9fZ2l2ZVwiKTtcclxuICAgIGNvbnN0IHJvbGVfZHVyYXRpb24gPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcInJvbGVfZHVyYXRpb25cIik7XHJcbiAgICBjb25zdCBjdXJyZW5jeV90b19naXZlID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJjdXJyZW5jeV90b19naXZlXCIpO1xyXG4gICAgY29uc3QgY3VycmVuY3lfdG9fZ2l2ZV9hbW91bnQgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcclxuICAgICAgXCJjdXJyZW5jeV90b19naXZlX2Ftb3VudFwiXHJcbiAgICApO1xyXG4gICAgaWYgKHByaWNlIDwgMCkge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6XHJcbiAgICAgICAgICBcIk5lZ2F0aXZlIHByaWNlcz8gUmVhbCBmdW5ueSB0aGVyZS4gSG93IHRoZSBmdWNrIGRvIHlvdSB0aGluayBhbiBpbnRlcmFjdGlvbiBsaWtlIHRoaXMgd291bGQgZ28gaW4gcmVhbCBsaWZlPyBZb3UgZ28gdG8gdGhlIGdyb2Nlcnkgc3RvcmUsIGJ1eSB5b3VyIHN0dWZmLCBhbmQgdGhlIGNhc2hpZXIgaGFuZHMgeW91IHlvdXIgc2hpdCBhbmQgJDEwMD8hPyE/IFlvdSBmdWNraW5nIHdpc2guICggIOKAosyAIOG0liDigKLMgSAgKVwiLFxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCEoYXdhaXQgZG9lc19jdXJyZW5jeV9leGlzdChjdXJyZW5jeV9yZXF1aXJlZCkpKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDpcclxuICAgICAgICAgIFwiRXZlcnkgZGF5LCBJIGdldCBtb3JlIGFuZCBtb3JlIHRpcmVkIG9mIHBlb3BsZSBsaWtlIHlvdSB3aG8gdGhpbmsgaXQncyBmdW5ueSB0byB0cnkgdG8gYnJlYWsgdGhlIGJvdC4gSG93IHRoZSBmdWNrIGRvIHlvdSB0aGluayB0aGlzIGludGVyYWN0aW9uIHdvdWxkIHBsYXkgb3V0PyBZb3UgZ28gdG8gdGhlIGdyb2Nlcnkgc3RvcmUsIGJ1eSB5b3VyIHNoaXQsIGFuZCB0aGUgY2FzaGllciB0cmllcyB0byBjaGFyZ2UgeW91IDQ5IFNub3JnbGVzIGZvciB5b3VyIGZ1Y2tpbmcgZm9vZD8hPyEgSXQncyBub3Qgc28gZnVubnkgd2hlbiB0aGUgam9rZSBpcyBwbGF5ZWQgb24geW91LCBpcyBpdD8gU3RvcCB0cnlpbmcgdG8gbWFrZSBzdG9yZSBpdGVtcyB0aGF0IGNoYXJnZSBjdXJyZW5jeSB0aGF0IGRvZXNuJ3QgZXhpc3QuICggIOKAosyAIOG0liDigKLMgSAgKVwiLFxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzdG9yZSBpdGVtXHJcbiAgICBsZXQgcm9sZV90b19naXZlX2lkID0gcm9sZV90b19naXZlID8gcm9sZV90b19naXZlLmlkIDogdW5kZWZpbmVkO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgY3JlYXRlX3N0b3JlX2l0ZW0oe1xyXG4gICAgICAgIGl0ZW1fbmFtZSxcclxuICAgICAgICBjdXJyZW5jeV9yZXF1aXJlZCxcclxuICAgICAgICBwcmljZSxcclxuICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICByb2xlX3RvX2dpdmVfaWQsXHJcbiAgICAgICAgcm9sZV9kdXJhdGlvbixcclxuICAgICAgICBjdXJyZW5jeV90b19naXZlLFxyXG4gICAgICAgIGN1cnJlbmN5X3RvX2dpdmVfYW1vdW50LFxyXG4gICAgICB9KTtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgU3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgc3RvcmUgaXRlbSBcXGAke2l0ZW1fbmFtZX1cXGBgLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGAke2Vycn1gLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMCxcclxuICB9LFxyXG59O1xyXG4iXX0=