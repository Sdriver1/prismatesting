import * as Discord from "discord.js";
import { does_currency_exist } from "../currency/operations/does_currency_exist.js";
import { run_minigame } from "../util/minigames.js";
import config from "../configs/config.json" with { type: "json" };
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("newminigame")
        .setDescription("Summon a custom minigame")
        .addStringOption((option) => option
        .setName("instructions")
        .setDescription("The instructions for the minigame")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("clue")
        .setDescription("The clue for the minigame")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("answer")
        .setDescription("The correct answer")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("prize_currency_id")
        .setDescription("The currency ID of the prize")
        .setRequired(true))
        .addNumberOption((option) => option
        .setName("prize_amount_min")
        .setDescription("The minimum amount of the prize currency"))
        .addNumberOption((option) => option
        .setName("prize_amount_max")
        .setDescription("The maximum amount of the prize currency")),
    run: async function (interaction) {
        const prize_data = {
            prize_currency_id: interaction.options.getString("prize_currency_id"),
            prize_amount_min: interaction.options.getNumber("prize_amount_min") ??
                config.server.minigames.default_prize_data.prize_amount_min,
            prize_amount_max: interaction.options.getNumber("prize_amount_max") ??
                config.server.minigames.default_prize_data.prize_amount_max,
        };
        if (!(await does_currency_exist(prize_data.prize_currency_id)))
            interaction.editReply({
                content: `This currency does not exist!`,
            });
        if (prize_data.prize_amount_max < prize_data.prize_amount_min)
            interaction.editReply({
                content: `I don't think your minimum prize amount is supposed to be higher than your maximum prize amount there, buddy. Try again`,
            });
        const minigame_data = {
            instructions: interaction.options.getString("instructions"),
            clue: interaction.options.getString("clue"),
            correct_answers: [interaction.options.getString("answer")],
        };
        run_minigame(interaction.channel, minigame_data, prize_data);
        interaction.editReply({ content: "Success" });
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3bWluaWdhbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbmV3bWluaWdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDcEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3BELE9BQU8sTUFBTSxNQUFNLHdCQUF3QixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BFLGVBQWU7SUFDYixJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7U0FDcEMsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUN0QixjQUFjLENBQUMsMEJBQTBCLENBQUM7U0FDMUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxjQUFjLENBQUM7U0FDdkIsY0FBYyxDQUFDLG1DQUFtQyxDQUFDO1NBQ25ELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUNmLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQztTQUMzQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FDakIsY0FBYyxDQUFDLG9CQUFvQixDQUFDO1NBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLG1CQUFtQixDQUFDO1NBQzVCLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQztTQUM5QyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztTQUMzQixjQUFjLENBQUMsMENBQTBDLENBQUMsQ0FDOUQ7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1NBQzNCLGNBQWMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUM5RDtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsTUFBTSxVQUFVLEdBQUc7WUFDakIsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUM7WUFDckUsZ0JBQWdCLEVBQ2QsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQjtZQUM3RCxnQkFBZ0IsRUFDZCxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCO1NBQzlELENBQUM7UUFDRixJQUFJLENBQUMsQ0FBQyxNQUFNLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzVELFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BCLE9BQU8sRUFBRSwrQkFBK0I7YUFDekMsQ0FBQyxDQUFDO1FBQ0wsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLGdCQUFnQjtZQUMzRCxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUseUhBQXlIO2FBQ25JLENBQUMsQ0FBQztRQUNMLE1BQU0sYUFBYSxHQUFHO1lBQ3BCLFlBQVksRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7WUFDM0QsSUFBSSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUMzQyxlQUFlLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMzRCxDQUFDO1FBQ0YsWUFBWSxDQUNWLFdBQVcsQ0FBQyxPQUE4QixFQUMxQyxhQUFhLEVBQ2IsVUFBVSxDQUNYLENBQUM7UUFDRixXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELE9BQU8sRUFBRTtRQUNQLGVBQWUsRUFBRSxDQUFDO0tBQ25CO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgZG9lc19jdXJyZW5jeV9leGlzdCB9IGZyb20gXCIuLi9jdXJyZW5jeS9vcGVyYXRpb25zL2RvZXNfY3VycmVuY3lfZXhpc3QuanNcIjtcclxuaW1wb3J0IHsgcnVuX21pbmlnYW1lIH0gZnJvbSBcIi4uL3V0aWwvbWluaWdhbWVzLmpzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcIm5ld21pbmlnYW1lXCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJTdW1tb24gYSBjdXN0b20gbWluaWdhbWVcIilcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJpbnN0cnVjdGlvbnNcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgaW5zdHJ1Y3Rpb25zIGZvciB0aGUgbWluaWdhbWVcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgIClcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJjbHVlXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIGNsdWUgZm9yIHRoZSBtaW5pZ2FtZVwiKVxyXG4gICAgICAgIC5zZXRSZXF1aXJlZCh0cnVlKVxyXG4gICAgKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcImFuc3dlclwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBjb3JyZWN0IGFuc3dlclwiKVxyXG4gICAgICAgIC5zZXRSZXF1aXJlZCh0cnVlKVxyXG4gICAgKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcInByaXplX2N1cnJlbmN5X2lkXCIpXHJcbiAgICAgICAgLnNldERlc2NyaXB0aW9uKFwiVGhlIGN1cnJlbmN5IElEIG9mIHRoZSBwcml6ZVwiKVxyXG4gICAgICAgIC5zZXRSZXF1aXJlZCh0cnVlKVxyXG4gICAgKVxyXG4gICAgLmFkZE51bWJlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcInByaXplX2Ftb3VudF9taW5cIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgbWluaW11bSBhbW91bnQgb2YgdGhlIHByaXplIGN1cnJlbmN5XCIpXHJcbiAgICApXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwicHJpemVfYW1vdW50X21heFwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBtYXhpbXVtIGFtb3VudCBvZiB0aGUgcHJpemUgY3VycmVuY3lcIilcclxuICAgICksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uKSB7XHJcbiAgICBjb25zdCBwcml6ZV9kYXRhID0ge1xyXG4gICAgICBwcml6ZV9jdXJyZW5jeV9pZDogaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJwcml6ZV9jdXJyZW5jeV9pZFwiKSxcclxuICAgICAgcHJpemVfYW1vdW50X21pbjpcclxuICAgICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcInByaXplX2Ftb3VudF9taW5cIikgPz9cclxuICAgICAgICBjb25maWcuc2VydmVyLm1pbmlnYW1lcy5kZWZhdWx0X3ByaXplX2RhdGEucHJpemVfYW1vdW50X21pbixcclxuICAgICAgcHJpemVfYW1vdW50X21heDpcclxuICAgICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcInByaXplX2Ftb3VudF9tYXhcIikgPz9cclxuICAgICAgICBjb25maWcuc2VydmVyLm1pbmlnYW1lcy5kZWZhdWx0X3ByaXplX2RhdGEucHJpemVfYW1vdW50X21heCxcclxuICAgIH07XHJcbiAgICBpZiAoIShhd2FpdCBkb2VzX2N1cnJlbmN5X2V4aXN0KHByaXplX2RhdGEucHJpemVfY3VycmVuY3lfaWQpKSlcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgVGhpcyBjdXJyZW5jeSBkb2VzIG5vdCBleGlzdCFgLFxyXG4gICAgICB9KTtcclxuICAgIGlmIChwcml6ZV9kYXRhLnByaXplX2Ftb3VudF9tYXggPCBwcml6ZV9kYXRhLnByaXplX2Ftb3VudF9taW4pXHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYEkgZG9uJ3QgdGhpbmsgeW91ciBtaW5pbXVtIHByaXplIGFtb3VudCBpcyBzdXBwb3NlZCB0byBiZSBoaWdoZXIgdGhhbiB5b3VyIG1heGltdW0gcHJpemUgYW1vdW50IHRoZXJlLCBidWRkeS4gVHJ5IGFnYWluYCxcclxuICAgICAgfSk7XHJcbiAgICBjb25zdCBtaW5pZ2FtZV9kYXRhID0ge1xyXG4gICAgICBpbnN0cnVjdGlvbnM6IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiaW5zdHJ1Y3Rpb25zXCIpLFxyXG4gICAgICBjbHVlOiBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcImNsdWVcIiksXHJcbiAgICAgIGNvcnJlY3RfYW5zd2VyczogW2ludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiYW5zd2VyXCIpXSxcclxuICAgIH07XHJcbiAgICBydW5fbWluaWdhbWUoXHJcbiAgICAgIGludGVyYWN0aW9uLmNoYW5uZWwgYXMgRGlzY29yZC5UZXh0Q2hhbm5lbCxcclxuICAgICAgbWluaWdhbWVfZGF0YSxcclxuICAgICAgcHJpemVfZGF0YVxyXG4gICAgKTtcclxuICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7IGNvbnRlbnQ6IFwiU3VjY2Vzc1wiIH0pO1xyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==