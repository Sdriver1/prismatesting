import * as Discord from "discord.js";
import { create_currency } from "../currency/configurers/currencies.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("newcurrency")
        .setDescription("Add a currency to the database")
        .addStringOption((option) => option
        .setName("currency")
        .setDescription("The name of the currency")
        .setRequired(true)),
    run: async function (interaction) {
        const currency_name = interaction.options.getString("currency");
        try {
            await create_currency(currency_name);
            interaction.editReply({
                content: `Successfully created currency \`${currency_name}\``,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3Y3VycmVuY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbmV3Y3VycmVuY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLGVBQWU7SUFDYixJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7U0FDcEMsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUN0QixjQUFjLENBQUMsZ0NBQWdDLENBQUM7U0FDaEQsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxVQUFVLENBQUM7U0FDbkIsY0FBYyxDQUFDLDBCQUEwQixDQUFDO1NBQzFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQWdEO1FBQ25FLE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQztZQUNILE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3JDLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BCLE9BQU8sRUFBRSxtQ0FBbUMsYUFBYSxJQUFJO2FBQzlELENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLEdBQUcsR0FBRyxFQUFFO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsZUFBZSxFQUFFLENBQUM7S0FDbkI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRGlzY29yZCBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVfY3VycmVuY3kgfSBmcm9tIFwiLi4vY3VycmVuY3kvY29uZmlndXJlcnMvY3VycmVuY2llcy5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcIm5ld2N1cnJlbmN5XCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJBZGQgYSBjdXJyZW5jeSB0byB0aGUgZGF0YWJhc2VcIilcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJjdXJyZW5jeVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBuYW1lIG9mIHRoZSBjdXJyZW5jeVwiKVxyXG4gICAgICAgIC5zZXRSZXF1aXJlZCh0cnVlKVxyXG4gICAgKSxcclxuICBydW46IGFzeW5jIGZ1bmN0aW9uIChpbnRlcmFjdGlvbjogRGlzY29yZC5DaGF0SW5wdXRDb21tYW5kSW50ZXJhY3Rpb24pIHtcclxuICAgIGNvbnN0IGN1cnJlbmN5X25hbWUgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImN1cnJlbmN5XCIpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgY3JlYXRlX2N1cnJlbmN5KGN1cnJlbmN5X25hbWUpO1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGBTdWNjZXNzZnVsbHkgY3JlYXRlZCBjdXJyZW5jeSBcXGAke2N1cnJlbmN5X25hbWV9XFxgYCxcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgJHtlcnJ9YCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvcHRpb25zOiB7XHJcbiAgICBzZXJ2ZXJfY29vbGRvd246IDAsXHJcbiAgfSxcclxufTtcclxuIl19