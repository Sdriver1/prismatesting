import * as Discord from "discord.js";
import { reset_currency } from "../currency/operations/arithmetic.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("resetcurrency")
        .setDescription("Set everyone's balance of a currency to 0")
        .addStringOption((option) => option
        .setName("currency")
        .setDescription("The currency you wish to reset")
        .setRequired(true)),
    run: async function (interaction) {
        const currency = interaction.options.getString("currency");
        try {
            await reset_currency(currency);
            interaction.editReply({
                content: `Successfully reset everyone's balance of ${currency} to 0`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXRjdXJyZW5jeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9yZXNldGN1cnJlbmN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxPQUFPLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDeEIsY0FBYyxDQUFDLDJDQUEyQyxDQUFDO1NBQzNELGVBQWUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQzFCLE1BQU07U0FDSCxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ25CLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztTQUNoRCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO0lBQ0gsR0FBRyxFQUFFLEtBQUssV0FBVyxXQUFnRDtRQUNuRSxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUM7WUFDSCxNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsNENBQTRDLFFBQVEsT0FBTzthQUNyRSxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BCLE9BQU8sRUFBRSxHQUFHLEdBQUcsRUFBRTthQUNsQixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sRUFBRTtRQUNQLGVBQWUsRUFBRSxDQUFDO0tBQ25CO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgcmVzZXRfY3VycmVuY3kgfSBmcm9tIFwiLi4vY3VycmVuY3kvb3BlcmF0aW9ucy9hcml0aG1ldGljLmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwicmVzZXRjdXJyZW5jeVwiKVxyXG4gICAgLnNldERlc2NyaXB0aW9uKFwiU2V0IGV2ZXJ5b25lJ3MgYmFsYW5jZSBvZiBhIGN1cnJlbmN5IHRvIDBcIilcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJjdXJyZW5jeVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBjdXJyZW5jeSB5b3Ugd2lzaCB0byByZXNldFwiKVxyXG4gICAgICAgIC5zZXRSZXF1aXJlZCh0cnVlKVxyXG4gICAgKSxcclxuICBydW46IGFzeW5jIGZ1bmN0aW9uIChpbnRlcmFjdGlvbjogRGlzY29yZC5DaGF0SW5wdXRDb21tYW5kSW50ZXJhY3Rpb24pIHtcclxuICAgIGNvbnN0IGN1cnJlbmN5ID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJjdXJyZW5jeVwiKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHJlc2V0X2N1cnJlbmN5KGN1cnJlbmN5KTtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgU3VjY2Vzc2Z1bGx5IHJlc2V0IGV2ZXJ5b25lJ3MgYmFsYW5jZSBvZiAke2N1cnJlbmN5fSB0byAwYCxcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgJHtlcnJ9YCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvcHRpb25zOiB7XHJcbiAgICBzZXJ2ZXJfY29vbGRvd246IDAsXHJcbiAgfSxcclxufTtcclxuIl19