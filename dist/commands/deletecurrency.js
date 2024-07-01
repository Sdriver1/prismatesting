import * as Discord from "discord.js";
import { delete_currency } from "../currency/configurers/currencies.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("deletecurrency")
        .setDescription("Delete a currency. Cannot be undone.")
        .addStringOption((option) => option
        .setName("currency")
        .setDescription("The currency to delete")
        .setRequired(true)),
    run: async function (interaction) {
        const currency_name = interaction.options.getString("currency");
        try {
            await delete_currency(currency_name);
            interaction.editReply({
                content: `Successfully deleted currency \`${currency_name}\` and all associated store items (if any).`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlY3VycmVuY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvZGVsZXRlY3VycmVuY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLGVBQWU7SUFDYixJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7U0FDcEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1NBQ3pCLGNBQWMsQ0FBQyxzQ0FBc0MsQ0FBQztTQUN0RCxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUNuQixjQUFjLENBQUMsd0JBQXdCLENBQUM7U0FDeEMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDckMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLG1DQUFtQyxhQUFhLDZDQUE2QzthQUN2RyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BCLE9BQU8sRUFBRSxHQUFHLEdBQUcsRUFBRTthQUNsQixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sRUFBRTtRQUNQLGVBQWUsRUFBRSxDQUFDO0tBQ25CO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IHsgZGVsZXRlX2N1cnJlbmN5IH0gZnJvbSBcIi4uL2N1cnJlbmN5L2NvbmZpZ3VyZXJzL2N1cnJlbmNpZXMuanNcIjtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6IG5ldyBEaXNjb3JkLlNsYXNoQ29tbWFuZEJ1aWxkZXIoKVxyXG4gICAgLnNldE5hbWUoXCJkZWxldGVjdXJyZW5jeVwiKVxyXG4gICAgLnNldERlc2NyaXB0aW9uKFwiRGVsZXRlIGEgY3VycmVuY3kuIENhbm5vdCBiZSB1bmRvbmUuXCIpXHJcbiAgICAuYWRkU3RyaW5nT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiY3VycmVuY3lcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgY3VycmVuY3kgdG8gZGVsZXRlXCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgY29uc3QgY3VycmVuY3lfbmFtZSA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiY3VycmVuY3lcIik7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBkZWxldGVfY3VycmVuY3koY3VycmVuY3lfbmFtZSk7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYFN1Y2Nlc3NmdWxseSBkZWxldGVkIGN1cnJlbmN5IFxcYCR7Y3VycmVuY3lfbmFtZX1cXGAgYW5kIGFsbCBhc3NvY2lhdGVkIHN0b3JlIGl0ZW1zIChpZiBhbnkpLmAsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYCR7ZXJyfWAsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==