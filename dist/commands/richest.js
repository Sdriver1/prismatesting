import * as Discord from "discord.js";
import { get_currency_leaderboard } from "../command_parts/generate_leaderboard.js";
import { number_format_commas } from "../util/number_format_commas.js";
import { random_embed_color } from "../util/random_embed_color.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("richest")
        .setDescription("See who the richest users are")
        .addStringOption((option) => option
        .setName("currency")
        .setDescription("The currency you want to view the leaderboard of (defaults to gold)"))
        .addNumberOption((option) => option
        .setName("page")
        .setDescription("The leaderboard page you want to view (defaults to 1)")),
    run: async function (interaction) {
        const currency = interaction.options.getString("currency") || "gold";
        const page = interaction.options.getNumber("page") || 1;
        if (page > 999 || !Number.isInteger(page) || page < 1) {
            interaction.editReply("Invalid page supplied! (Only whole number pages between 1 and 999 work)");
            return;
        }
        const indices = {
            max: page * 10,
            min: page * 10 - 10,
        };
        const data = {
            min_index: indices.min,
            max_index: indices.max,
            currency_id: currency,
        };
        let leaderboard;
        try {
            leaderboard = await get_currency_leaderboard(data);
        }
        catch (err) {
            interaction.editReply({ content: `${err}` });
            return;
        }
        let leaderboard_description = "";
        for (let row of leaderboard) {
            if (row)
                leaderboard_description += `<@${row.user_id}> ▸ **${number_format_commas(row.amount)}** ${data.currency_id}\n`;
        }
        if (!leaderboard_description)
            leaderboard_description =
                "Hmm, there's no data on this page! Try searching again! 🔍:t_rex:";
        let leaderboard_embed = new Discord.EmbedBuilder()
            .setColor(random_embed_color())
            .setTitle(`Leaderboard: ${data.currency_id}`)
            .setDescription(leaderboard_description)
            .setFooter({
            text: `Page ${number_format_commas(page)} ${page === 69 || page === 420 ? "(nice)" : ""}`,
        });
        interaction.editReply({ embeds: [leaderboard_embed] });
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9yaWNoZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxPQUFPLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ25FLGVBQWU7SUFDYixJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsbUJBQW1CLEVBQUU7U0FDcEMsT0FBTyxDQUFDLFNBQVMsQ0FBQztTQUNsQixjQUFjLENBQUMsK0JBQStCLENBQUM7U0FDL0MsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxVQUFVLENBQUM7U0FDbkIsY0FBYyxDQUNiLHFFQUFxRSxDQUN0RSxDQUNKO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTTtTQUNILE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDZixjQUFjLENBQUMsdURBQXVELENBQUMsQ0FDM0U7SUFDSCxHQUFHLEVBQUUsS0FBSyxXQUFXLFdBQWdEO1FBQ25FLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQztRQUNyRSxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEQsV0FBVyxDQUFDLFNBQVMsQ0FDbkIseUVBQXlFLENBQzFFLENBQUM7WUFDRixPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHO1lBQ2QsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFO1lBQ2QsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRTtTQUNwQixDQUFDO1FBQ0YsTUFBTSxJQUFJLEdBQUc7WUFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUc7WUFDdEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1lBQ3RCLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUM7UUFFRixJQUFJLFdBQVcsQ0FBQztRQUNoQixJQUFJLENBQUM7WUFDSCxXQUFXLEdBQUcsTUFBTSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0MsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztRQUNqQyxLQUFLLElBQUksR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQzVCLElBQUksR0FBRztnQkFDTCx1QkFBdUIsSUFBSSxLQUN6QixHQUFHLENBQUMsT0FDTixTQUFTLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUM7UUFDeEUsQ0FBQztRQUNELElBQUksQ0FBQyx1QkFBdUI7WUFDMUIsdUJBQXVCO2dCQUNyQixtRUFBbUUsQ0FBQztRQUN4RSxJQUFJLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTthQUMvQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUM5QixRQUFRLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUM1QyxjQUFjLENBQUMsdUJBQXVCLENBQUM7YUFDdkMsU0FBUyxDQUFDO1lBQ1QsSUFBSSxFQUFFLFFBQVEsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQ3RDLElBQUksS0FBSyxFQUFFLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUMzQyxFQUFFO1NBQ0gsQ0FBQyxDQUFDO1FBQ0wsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGdldF9jdXJyZW5jeV9sZWFkZXJib2FyZCB9IGZyb20gXCIuLi9jb21tYW5kX3BhcnRzL2dlbmVyYXRlX2xlYWRlcmJvYXJkLmpzXCI7XHJcbmltcG9ydCB7IG51bWJlcl9mb3JtYXRfY29tbWFzIH0gZnJvbSBcIi4uL3V0aWwvbnVtYmVyX2Zvcm1hdF9jb21tYXMuanNcIjtcclxuaW1wb3J0IHsgcmFuZG9tX2VtYmVkX2NvbG9yIH0gZnJvbSBcIi4uL3V0aWwvcmFuZG9tX2VtYmVkX2NvbG9yLmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwicmljaGVzdFwiKVxyXG4gICAgLnNldERlc2NyaXB0aW9uKFwiU2VlIHdobyB0aGUgcmljaGVzdCB1c2VycyBhcmVcIilcclxuICAgIC5hZGRTdHJpbmdPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJjdXJyZW5jeVwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcclxuICAgICAgICAgIFwiVGhlIGN1cnJlbmN5IHlvdSB3YW50IHRvIHZpZXcgdGhlIGxlYWRlcmJvYXJkIG9mIChkZWZhdWx0cyB0byBnb2xkKVwiXHJcbiAgICAgICAgKVxyXG4gICAgKVxyXG4gICAgLmFkZE51bWJlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcInBhZ2VcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgbGVhZGVyYm9hcmQgcGFnZSB5b3Ugd2FudCB0byB2aWV3IChkZWZhdWx0cyB0byAxKVwiKVxyXG4gICAgKSxcclxuICBydW46IGFzeW5jIGZ1bmN0aW9uIChpbnRlcmFjdGlvbjogRGlzY29yZC5DaGF0SW5wdXRDb21tYW5kSW50ZXJhY3Rpb24pIHtcclxuICAgIGNvbnN0IGN1cnJlbmN5ID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRTdHJpbmcoXCJjdXJyZW5jeVwiKSB8fCBcImdvbGRcIjtcclxuICAgIGNvbnN0IHBhZ2UgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcInBhZ2VcIikgfHwgMTtcclxuICAgIGlmIChwYWdlID4gOTk5IHx8ICFOdW1iZXIuaXNJbnRlZ2VyKHBhZ2UpIHx8IHBhZ2UgPCAxKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcclxuICAgICAgICBcIkludmFsaWQgcGFnZSBzdXBwbGllZCEgKE9ubHkgd2hvbGUgbnVtYmVyIHBhZ2VzIGJldHdlZW4gMSBhbmQgOTk5IHdvcmspXCJcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gMSBpcyBzdWJ0cmFjdGVkIHRvIG1hdGNoIHRoZSBhcnJheSBpbmRleFxyXG4gICAgY29uc3QgaW5kaWNlcyA9IHtcclxuICAgICAgbWF4OiBwYWdlICogMTAsXHJcbiAgICAgIG1pbjogcGFnZSAqIDEwIC0gMTAsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWluX2luZGV4OiBpbmRpY2VzLm1pbixcclxuICAgICAgbWF4X2luZGV4OiBpbmRpY2VzLm1heCxcclxuICAgICAgY3VycmVuY3lfaWQ6IGN1cnJlbmN5LFxyXG4gICAgfTtcclxuICAgIC8vIFRyeS9jYXRjaCBpbiBjYXNlIG9mIGVpdGhlciBlcnJvciB0aGUgZnVuY3Rpb24gdGhyb3dzIGlmIHRoZSBpbnB1dCBpcyB3cm9uZ1xyXG4gICAgbGV0IGxlYWRlcmJvYXJkO1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGVhZGVyYm9hcmQgPSBhd2FpdCBnZXRfY3VycmVuY3lfbGVhZGVyYm9hcmQoZGF0YSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHsgY29udGVudDogYCR7ZXJyfWAgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBsZWFkZXJib2FyZF9kZXNjcmlwdGlvbiA9IFwiXCI7XHJcbiAgICBmb3IgKGxldCByb3cgb2YgbGVhZGVyYm9hcmQpIHtcclxuICAgICAgaWYgKHJvdylcclxuICAgICAgICBsZWFkZXJib2FyZF9kZXNjcmlwdGlvbiArPSBgPEAke1xyXG4gICAgICAgICAgcm93LnVzZXJfaWRcclxuICAgICAgICB9PiDilrggKioke251bWJlcl9mb3JtYXRfY29tbWFzKHJvdy5hbW91bnQpfSoqICR7ZGF0YS5jdXJyZW5jeV9pZH1cXG5gO1xyXG4gICAgfVxyXG4gICAgaWYgKCFsZWFkZXJib2FyZF9kZXNjcmlwdGlvbilcclxuICAgICAgbGVhZGVyYm9hcmRfZGVzY3JpcHRpb24gPVxyXG4gICAgICAgIFwiSG1tLCB0aGVyZSdzIG5vIGRhdGEgb24gdGhpcyBwYWdlISBUcnkgc2VhcmNoaW5nIGFnYWluISDwn5SNOnRfcmV4OlwiO1xyXG4gICAgbGV0IGxlYWRlcmJvYXJkX2VtYmVkID0gbmV3IERpc2NvcmQuRW1iZWRCdWlsZGVyKClcclxuICAgICAgLnNldENvbG9yKHJhbmRvbV9lbWJlZF9jb2xvcigpKVxyXG4gICAgICAuc2V0VGl0bGUoYExlYWRlcmJvYXJkOiAke2RhdGEuY3VycmVuY3lfaWR9YClcclxuICAgICAgLnNldERlc2NyaXB0aW9uKGxlYWRlcmJvYXJkX2Rlc2NyaXB0aW9uKVxyXG4gICAgICAuc2V0Rm9vdGVyKHtcclxuICAgICAgICB0ZXh0OiBgUGFnZSAke251bWJlcl9mb3JtYXRfY29tbWFzKHBhZ2UpfSAke1xyXG4gICAgICAgICAgcGFnZSA9PT0gNjkgfHwgcGFnZSA9PT0gNDIwID8gXCIobmljZSlcIiA6IFwiXCJcclxuICAgICAgICB9YCxcclxuICAgICAgfSk7XHJcbiAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoeyBlbWJlZHM6IFtsZWFkZXJib2FyZF9lbWJlZF0gfSk7XHJcbiAgfSxcclxuICBvcHRpb25zOiB7XHJcbiAgICBzZXJ2ZXJfY29vbGRvd246IDAsXHJcbiAgfSxcclxufTtcclxuIl19