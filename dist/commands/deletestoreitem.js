import * as Discord from "discord.js";
import { delete_store_item } from "../currency/configurers/storeitems.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("deletestoreitem")
        .setDescription("Delete an item from any currency's store")
        .addStringOption((option) => option
        .setName("item_name")
        .setDescription("The name of the item you want to delete")
        .setRequired(true)),
    run: async function (interaction) {
        const item_name = interaction.options.getString("item_name");
        try {
            delete_store_item(item_name);
            interaction.editReply({
                content: `Successfully deleted item \`${item_name}\``,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlc3RvcmVpdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2RlbGV0ZXN0b3JlaXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUUxRSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztTQUMxQixjQUFjLENBQUMsMENBQTBDLENBQUM7U0FDMUQsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxXQUFXLENBQUM7U0FDcEIsY0FBYyxDQUFDLHlDQUF5QyxDQUFDO1NBQ3pELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDckI7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQVc7UUFDOUIsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDO1lBQ0gsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFLCtCQUErQixTQUFTLElBQUk7YUFDdEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixPQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUU7YUFDbEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGRlbGV0ZV9zdG9yZV9pdGVtIH0gZnJvbSBcIi4uL2N1cnJlbmN5L2NvbmZpZ3VyZXJzL3N0b3JlaXRlbXMuanNcIjtcclxuLy8gRGVsZXRlIHN0b3JlIGl0ZW1cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGRhdGE6IG5ldyBEaXNjb3JkLlNsYXNoQ29tbWFuZEJ1aWxkZXIoKVxyXG4gICAgLnNldE5hbWUoXCJkZWxldGVzdG9yZWl0ZW1cIilcclxuICAgIC5zZXREZXNjcmlwdGlvbihcIkRlbGV0ZSBhbiBpdGVtIGZyb20gYW55IGN1cnJlbmN5J3Mgc3RvcmVcIilcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJpdGVtX25hbWVcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgbmFtZSBvZiB0aGUgaXRlbSB5b3Ugd2FudCB0byBkZWxldGVcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQodHJ1ZSlcclxuICAgICksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb24pIHtcclxuICAgIGNvbnN0IGl0ZW1fbmFtZSA9IGludGVyYWN0aW9uLm9wdGlvbnMuZ2V0U3RyaW5nKFwiaXRlbV9uYW1lXCIpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgZGVsZXRlX3N0b3JlX2l0ZW0oaXRlbV9uYW1lKTtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICBjb250ZW50OiBgU3VjY2Vzc2Z1bGx5IGRlbGV0ZWQgaXRlbSBcXGAke2l0ZW1fbmFtZX1cXGBgLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgIGNvbnRlbnQ6IGAke2Vycn1gLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMCxcclxuICB9LFxyXG59O1xyXG4iXX0=