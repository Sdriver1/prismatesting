import * as Discord from "discord.js";
import { get_store_item } from "../currency/operations/storeitems.js";
import { configure_store_item } from "../currency/configurers/storeitems.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("editstoreitem")
        .setDescription("Edit an item in any currency's store")
        .addStringOption((option) => option
        .setName("item_name")
        .setDescription("The name of the item you want to edit")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("currency_required")
        .setDescription("The currency used to buy this item"))
        .addNumberOption((option) => option
        .setName("price")
        .setDescription("The amount, in currency, the item costs"))
        .addStringOption((option) => option
        .setName("description")
        .setDescription("The item's description shown in /shop"))
        .addRoleOption((option) => option
        .setName("role_to_give")
        .setDescription("The role (if any) to give to the user when they buy this item"))
        .addNumberOption((option) => option
        .setName("role_duration")
        .setDescription("How long (in minutes) the user should keep the role (blank = infinite)"))
        .addStringOption((option) => option
        .setName("currency_to_give")
        .setDescription("The currency the user should get when tehy buy this item"))
        .addNumberOption((option) => option
        .setName("currency_to_give_amount")
        .setDescription("The amount of currency the user should get when they buy this item")),
    run: async function (interaction) {
        const item_name = interaction.options.getString("item_name");
        const existing_store_item_config = await get_store_item(item_name);
        const currency_required = interaction.options.getString("currency_required") ||
            existing_store_item_config.currency_required;
        const price = interaction.options.getNumber("price") ||
            existing_store_item_config.price;
        const description = interaction.options.getString("description") ||
            existing_store_item_config.description;
        const role_to_give = interaction.options.getRole("role_to_give") ||
            existing_store_item_config.role_to_give;
        const role_duration = interaction.options.getNumber("role_duration") ||
            existing_store_item_config.role_duration;
        const currency_to_give = interaction.options.getString("currency_to_give") ||
            existing_store_item_config.currency_to_give;
        const currency_to_give_amount = interaction.options.getNumber("currency_to_give_amount") ||
            existing_store_item_config.currency_to_give_amount;
        if (item_name && !get_store_item(item_name)) {
            interaction.editReply({
                content: `Hey! Give me a real item! (  •̀ ᴖ •́  )`,
            });
            return;
        }
        if (currency_required && !(await does_currency_exist(currency_required))) {
            interaction.editReply({
                content: `Hey! Give me a real currency! (  •̀ ᴖ •́  )`,
            });
            return;
        }
        let role_to_give_id = role_to_give ? role_to_give.id : undefined;
        try {
            await configure_store_item({
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
                content: `Successfully configured store item \`${item_name}\``,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdHN0b3JlaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9lZGl0c3RvcmVpdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxPQUFPLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNwRixlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDeEIsY0FBYyxDQUFDLHNDQUFzQyxDQUFDO1NBQ3RELGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsV0FBVyxDQUFDO1NBQ3BCLGNBQWMsQ0FBQyx1Q0FBdUMsQ0FBQztTQUN2RCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztTQUM1QixjQUFjLENBQUMsb0NBQW9DLENBQUMsQ0FDeEQ7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQztTQUNoQixjQUFjLENBQUMseUNBQXlDLENBQUMsQ0FDN0Q7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUN0QixjQUFjLENBQUMsdUNBQXVDLENBQUMsQ0FDM0Q7U0FDQSxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUN4QixNQUFNO1NB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LEdBQUcsRUFBRSxDQUFDO1lBQ2IsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLEdBQUcsR0FBRyxFQUFFO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsZUFBZSxFQUFFLENBQUM7S0FDbkI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRGlzY29yZCBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5pbXBvcnQgeyBnZXRfc3RvcmVfaXRlbSB9IGZyb20gXCIuLi9jdXJyZW5jeS9vcGVyYXRpb25zL3N0b3JlaXRlbXMuanNcIjtcclxuaW1wb3J0IHsgY29uZmlndXJlX3N0b3JlX2l0ZW0gfSBmcm9tIFwiLi4vY3VycmVuY3kvY29uZmlndXJlcnMvc3RvcmVpdGVtcy5qc1wiO1xyXG5pbXBvcnQgeyBkb2VzX2N1cnJlbmN5X2V4aXN0IH0gZnJvbSBcIi4uL2N1cnJlbmN5L29wZXJhdGlvbnMvZG9lc19jdXJyZW5jeV9leGlzdC5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcImVkaXRzdG9yZWl0ZW1cIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIkVkaXQgYW4gaXRlbSBpbiBhbnkgY3VycmVuY3kncyBzdG9yZVwiKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcIml0ZW1fbmFtZVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBuYW1lIG9mIHRoZSBpdGVtIHlvdSB3YW50IHRvIGVkaXRcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJjdXJyZW5jeV9yZXF1aXJlZFwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBjdXJyZW5jeSB1c2VkIHRvIGJ1eSB0aGlzIGl0ZW1cIilcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJwcmljZVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBhbW91bnQsIGluIGN1cnJlbmN5LCB0aGUgaXRlbSBjb3N0c1wiKVxyXG4gICAgKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImRlc2NyaXB0aW9uXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIGl0ZW0ncyBkZXNjcmlwdGlvbiBzaG93biBpbiAvc2hvcFwiKVxyXG4gICAgKVxyXG4gICAgLmFkZFJvbGVPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJyb2xlX3RvX2dpdmVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXHJcbiAgICAgICAgICBcIlRoZSByb2xlIChpZiBhbnkpIHRvIGdpdmUgdG8gdGhlIHVzZXIgd2hlbiB0aGV5IGJ1eSB0aGlzIGl0ZW1cIlxyXG4gICAgICAgIClcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJyb2xlX2R1cmF0aW9uXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFxyXG4gICAgICAgICAgXCJIb3cgbG9uZyAoaW4gbWludXRlcykgdGhlIHVzZXIgc2hvdWxkIGtlZXAgdGhlIHJvbGUgKGJsYW5rID0gaW5maW5pdGUpXCJcclxuICAgICAgICApXHJcbiAgICApXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiY3VycmVuY3lfdG9fZ2l2ZVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcclxuICAgICAgICAgIFwiVGhlIGN1cnJlbmN5IHRoZSB1c2VyIHNob3VsZCBnZXQgd2hlbiB0ZWh5IGJ1eSB0aGlzIGl0ZW1cIlxyXG4gICAgICAgIClcclxuICAgIClcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJjdXJyZW5jeV90b19naXZlX2Ftb3VudFwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcclxuICAgICAgICAgIFwiVGhlIGFtb3VudCBvZiBjdXJyZW5jeSB0aGUgdXNlciBzaG91bGQgZ2V0IHdoZW4gdGhleSBidXkgdGhpcyBpdGVtXCJcclxuICAgICAgICApXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uKSB7XHJcbiAgICAvLyBHZXQgb3B0aW9uc1xyXG4gICAgY29uc3QgaXRlbV9uYW1lID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJpdGVtX25hbWVcIik7XHJcbiAgICBjb25zdCBleGlzdGluZ19zdG9yZV9pdGVtX2NvbmZpZyA9IGF3YWl0IGdldF9zdG9yZV9pdGVtKGl0ZW1fbmFtZSk7XHJcblxyXG4gICAgY29uc3QgY3VycmVuY3lfcmVxdWlyZWQgPVxyXG4gICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImN1cnJlbmN5X3JlcXVpcmVkXCIpIHx8XHJcbiAgICAgIGV4aXN0aW5nX3N0b3JlX2l0ZW1fY29uZmlnLmN1cnJlbmN5X3JlcXVpcmVkO1xyXG4gICAgY29uc3QgcHJpY2UgPVxyXG4gICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcInByaWNlXCIpIHx8XHJcbiAgICAgIGV4aXN0aW5nX3N0b3JlX2l0ZW1fY29uZmlnLnByaWNlO1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPVxyXG4gICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImRlc2NyaXB0aW9uXCIpIHx8XHJcbiAgICAgIGV4aXN0aW5nX3N0b3JlX2l0ZW1fY29uZmlnLmRlc2NyaXB0aW9uO1xyXG4gICAgY29uc3Qgcm9sZV90b19naXZlID1cclxuICAgICAgaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRSb2xlKFwicm9sZV90b19naXZlXCIpIHx8XHJcbiAgICAgIGV4aXN0aW5nX3N0b3JlX2l0ZW1fY29uZmlnLnJvbGVfdG9fZ2l2ZTtcclxuICAgIGNvbnN0IHJvbGVfZHVyYXRpb24gPVxyXG4gICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcInJvbGVfZHVyYXRpb25cIikgfHxcclxuICAgICAgZXhpc3Rpbmdfc3RvcmVfaXRlbV9jb25maWcucm9sZV9kdXJhdGlvbjtcclxuICAgIGNvbnN0IGN1cnJlbmN5X3RvX2dpdmUgPVxyXG4gICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImN1cnJlbmN5X3RvX2dpdmVcIikgfHxcclxuICAgICAgZXhpc3Rpbmdfc3RvcmVfaXRlbV9jb25maWcuY3VycmVuY3lfdG9fZ2l2ZTtcclxuICAgIGNvbnN0IGN1cnJlbmN5X3RvX2dpdmVfYW1vdW50ID1cclxuICAgICAgaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJjdXJyZW5jeV90b19naXZlX2Ftb3VudFwiKSB8fFxyXG4gICAgICBleGlzdGluZ19zdG9yZV9pdGVtX2NvbmZpZy5jdXJyZW5jeV90b19naXZlX2Ftb3VudDtcclxuICAgIGlmIChpdGVtX25hbWUgJiYgIWdldF9zdG9yZV9pdGVtKGl0ZW1fbmFtZSkpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgSGV5ISBHaXZlIG1lIGEgcmVhbCBpdGVtISAoICDigKLMgCDhtJYg4oCizIEgIClgLFxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGN1cnJlbmN5X3JlcXVpcmVkICYmICEoYXdhaXQgZG9lc19jdXJyZW5jeV9leGlzdChjdXJyZW5jeV9yZXF1aXJlZCkpKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYEhleSEgR2l2ZSBtZSBhIHJlYWwgY3VycmVuY3khICggIOKAosyAIOG0liDigKLMgSAgKWAsXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBDb25maWd1cmUgc3RvcmUgaXRlbVxyXG4gICAgbGV0IHJvbGVfdG9fZ2l2ZV9pZCA9IHJvbGVfdG9fZ2l2ZSA/IHJvbGVfdG9fZ2l2ZS5pZCA6IHVuZGVmaW5lZDtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGNvbmZpZ3VyZV9zdG9yZV9pdGVtKHtcclxuICAgICAgICBpdGVtX25hbWUsXHJcbiAgICAgICAgY3VycmVuY3lfcmVxdWlyZWQsXHJcbiAgICAgICAgcHJpY2UsXHJcbiAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgcm9sZV90b19naXZlX2lkLFxyXG4gICAgICAgIHJvbGVfZHVyYXRpb24sXHJcbiAgICAgICAgY3VycmVuY3lfdG9fZ2l2ZSxcclxuICAgICAgICBjdXJyZW5jeV90b19naXZlX2Ftb3VudCxcclxuICAgICAgfSk7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYFN1Y2Nlc3NmdWxseSBjb25maWd1cmVkIHN0b3JlIGl0ZW0gXFxgJHtpdGVtX25hbWV9XFxgYCxcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgJHtlcnJ9YCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvcHRpb25zOiB7XHJcbiAgICBzZXJ2ZXJfY29vbGRvd246IDAsXHJcbiAgfSxcclxufTtcclxuIl19