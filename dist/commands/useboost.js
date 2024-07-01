import * as Discord from "discord.js";
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
import config from "../configs/config.json" with { type: "json" };
import { get_user_xp_multiplier } from "../currency/operations/arithmetic.js";
import { activate_boost, get_available_boosts, } from "../command_parts/xp_boosts.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("useboost")
        .setDescription("Activate an XP boost available to you")
        .addNumberOption((option) => option
        .setName("id")
        .setDescription("The ID of the boost (see /boosts)")
        .setRequired(false))
        .addNumberOption((option) => option.setName("hours").setDescription("Hours to use the boost for"))
        .addNumberOption((option) => option.setName("minutes").setDescription("Minutes to use the boost for")),
    run: async function (interaction) {
        if (!interaction.options.getNumber("id")) {
            interaction.editReply({
                content: `### Use all your boosts
▸ Are you sure you want to use all your boosts for their entire durations?
▸ If you want to use one boost, run this command again but specify one of your boost IDs.`,
                components: [
                    new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel("Yes")
                        .setCustomId("yes")),
                ],
            });
            (await interaction.fetchReply())
                .awaitMessageComponent({ time: 10 * 60 * 1000 })
                .then(async (i) => {
                let boosts = await get_available_boosts(interaction.user.id);
                for (let boost of boosts) {
                    await activate_boost(boost.id, boost.unclaimed_time_ms);
                }
                interaction.editReply({
                    content: `### All boosts activated!
▸ Now go rake in that XP! ᕙ(  •̀ ᗜ •́  )ᕗ`,
                    components: [],
                });
            })
                .catch((err) => {
                return;
            });
        }
        else {
            let id = interaction.options.getNumber("id");
            if (!id) {
                interaction.editReply("You must specify a boost ID!");
                return;
            }
            let duration_ms = interaction.options.getNumber("hours") * 60 * 60 * 1000 +
                interaction.options.getNumber("minutes") * 60 * 1000;
            if (!Number.isInteger(duration_ms) || Number.isNaN(duration_ms)) {
                interaction.editReply("Hey! Use a valid amount of time (no decimals or non-numbers)! (  •̀ ᴖ •́  )");
                return;
            }
            const user_boosts = await db.all(SQL `SELECT * FROM xp_boosts WHERE owner_id = ${interaction.user.id}`);
            const selected_boost = user_boosts.find((boost) => boost.id === id);
            if (!selected_boost)
                return interaction.editReply({
                    content: "The ID you provided is not a boost you own!",
                });
            if (duration_ms > selected_boost.unclaimed_time_ms)
                return interaction.editReply({
                    content: "You don't have that much time left on your boost!",
                });
            if (!duration_ms || duration_ms <= 0)
                duration_ms = selected_boost.unclaimed_time_ms;
            const boost_ms_remaining = selected_boost.unclaimed_time_ms - duration_ms;
            const current_timestamp = Date.now();
            const existing_end_timestamp = selected_boost.end_timestamp;
            const new_end_timestamp = Math.max(existing_end_timestamp || 0, current_timestamp) + duration_ms;
            const user_boost_multiplier = await get_user_xp_multiplier(interaction.user.id);
            const new_user_boost_mutliplier = user_boost_multiplier * selected_boost.multiplier;
            const max_boost_mutliplier = interaction.member
                .premiumSince
                ? config.server.leveling.max_xp_boost_multipliers.boosters
                : config.server.leveling.max_xp_boost_multipliers.default;
            if (new_user_boost_mutliplier <= max_boost_mutliplier) {
                await db.all(SQL `UPDATE xp_boosts SET unclaimed_time_ms = ${boost_ms_remaining}, end_timestamp = ${new_end_timestamp} WHERE id = ${id}`);
                interaction.editReply({
                    content: redemption_success_message(new_end_timestamp),
                });
            }
            else {
                const reply = await interaction.editReply({
                    content: max_boost_explainer(new_user_boost_mutliplier, max_boost_mutliplier, interaction.member.premiumSince
                        ? false
                        : true),
                    components: [
                        new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                            .setCustomId("cancel")
                            .setLabel("Cancel this command")
                            .setStyle(Discord.ButtonStyle.Primary), new Discord.ButtonBuilder()
                            .setCustomId("use_anyway")
                            .setLabel("Use anyway")
                            .setStyle(Discord.ButtonStyle.Secondary)),
                    ],
                });
                let cancelled = false;
                await reply
                    .awaitMessageComponent({
                    filter: (interaction) => interaction.isButton(),
                    time: 60 * 1000,
                })
                    .then((i) => {
                    if (i.customId === "cancel") {
                        interaction.editReply({ content: "Cancelled", components: [] });
                        cancelled = true;
                    }
                })
                    .catch((err) => {
                    interaction.editReply({
                        content: "I went ahead and canceled this for you since you waited quite a while to click a button.",
                        components: [],
                    });
                });
                if (cancelled)
                    return;
                await db.all(SQL `UPDATE xp_boosts SET unclaimed_time_ms = ${boost_ms_remaining}, end_timestamp = ${new_end_timestamp} WHERE id = ${id}`);
                interaction.editReply({
                    content: redemption_success_message(new_end_timestamp),
                    components: [],
                });
            }
        }
    },
    options: {
        server_cooldown: 0,
    },
};
const redemption_success_message = (timestamp) => `### ⚡ Redemption successful!\n\n▸ Boost activated until <t:${Math.floor(timestamp / 1000)}:F>!\n▸ Godspeed! ᕙ(  •̀ ᗜ •́  )ᕗ`;
const max_boost_explainer = (attempted_multiplier, max_multiplier, show_boost_ad) => `### Woah there!
▸ After using this boost, your multiplier would be **${attempted_multiplier}x**, which exceeds the limit of **${max_multiplier}x**.
▸ While you can still use the boost, your multiplier won't go any higher than **${max_multiplier}x**, so it's probably not a good idea to use it now.` +
    (show_boost_ad
        ? `\n▸ If you were boosting, your maximum would be **${config.server.leveling.max_xp_boost_multipliers.boosters}x** XP!`
        : ``);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlYm9vc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvdXNlYm9vc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RDLE9BQU8sR0FBRyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZDLE9BQU8sTUFBTSxNQUFNLHdCQUF3QixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFDTCxjQUFjLEVBQ2Qsb0JBQW9CLEdBQ3JCLE1BQU0sK0JBQStCLENBQUM7QUFFdkMsZUFBZTtJQUNiLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtTQUNwQyxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ25CLGNBQWMsQ0FBQyx1Q0FBdUMsQ0FBQztTQUN2RCxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQztTQUNiLGNBQWMsQ0FBQyxtQ0FBbUMsQ0FBQztTQUNuRCxXQUFXLENBQUMsS0FBSyxDQUFDLENBQ3RCO1NBQ0EsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FDckU7U0FDQSxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUN6RTtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDekMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDcEIsT0FBTyxFQUFFOzswRkFFeUU7Z0JBQ2xGLFVBQVUsRUFBRTtvQkFDVixJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBeUIsQ0FBQyxhQUFhLENBQ2pFLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTt5QkFDeEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO3lCQUNyQyxRQUFRLENBQUMsS0FBSyxDQUFDO3lCQUNmLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FDdEI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxDQUFDLE1BQU0sV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUM3QixxQkFBcUIsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO2lCQUMvQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoQixJQUFJLE1BQU0sR0FBRyxNQUFNLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzdELEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7b0JBQ3pCLE1BQU0sY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzFELENBQUM7Z0JBQ0QsV0FBVyxDQUFDLFNBQVMsQ0FBQztvQkFDcEIsT0FBTyxFQUFFOzBDQUNxQjtvQkFDOUIsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLE9BQU87WUFDVCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNSLFdBQVcsQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQztnQkFDdEQsT0FBTztZQUNULENBQUM7WUFDRCxJQUFJLFdBQVcsR0FDYixXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUk7Z0JBQ3ZELFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2dCQUNoRSxXQUFXLENBQUMsU0FBUyxDQUNuQiw2RUFBNkUsQ0FDOUUsQ0FBQztnQkFDRixPQUFPO1lBQ1QsQ0FBQztZQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDOUIsR0FBRyxDQUFBLDRDQUE0QyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUNyRSxDQUFDO1lBQ0YsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsY0FBYztnQkFDakIsT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFDO29CQUMzQixPQUFPLEVBQUUsNkNBQTZDO2lCQUN2RCxDQUFDLENBQUM7WUFDTCxJQUFJLFdBQVcsR0FBRyxjQUFjLENBQUMsaUJBQWlCO2dCQUNoRCxPQUFPLFdBQVcsQ0FBQyxTQUFTLENBQUM7b0JBQzNCLE9BQU8sRUFBRSxtREFBbUQ7aUJBQzdELENBQUMsQ0FBQztZQUNMLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxJQUFJLENBQUM7Z0JBQ2xDLFdBQVcsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUM7WUFDakQsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDO1lBQzFFLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDLGFBQWEsQ0FBQztZQUM1RCxNQUFNLGlCQUFpQixHQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLHNCQUFzQixJQUFJLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUN6RSxNQUFNLHFCQUFxQixHQUFHLE1BQU0sc0JBQXNCLENBQ3hELFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNwQixDQUFDO1lBQ0YsTUFBTSx5QkFBeUIsR0FDN0IscUJBQXFCLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQztZQUNwRCxNQUFNLG9CQUFvQixHQUFJLFdBQVcsQ0FBQyxNQUE4QjtpQkFDckUsWUFBWTtnQkFDYixDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsUUFBUTtnQkFDMUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQztZQUM1RCxJQUFJLHlCQUF5QixJQUFJLG9CQUFvQixFQUFFLENBQUM7Z0JBQ3RELE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDVixHQUFHLENBQUEsNENBQTRDLGtCQUFrQixxQkFBcUIsaUJBQWlCLGVBQWUsRUFBRSxFQUFFLENBQzNILENBQUM7Z0JBQ0YsV0FBVyxDQUFDLFNBQVMsQ0FBQztvQkFDcEIsT0FBTyxFQUFFLDBCQUEwQixDQUFDLGlCQUFpQixDQUFDO2lCQUN2RCxDQUFDLENBQUM7WUFDTCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sTUFBTSxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUMsU0FBUyxDQUFDO29CQUN4QyxPQUFPLEVBQUUsbUJBQW1CLENBQzFCLHlCQUF5QixFQUN6QixvQkFBb0IsRUFDbkIsV0FBVyxDQUFDLE1BQThCLENBQUMsWUFBWTt3QkFDdEQsQ0FBQyxDQUFDLEtBQUs7d0JBQ1AsQ0FBQyxDQUFDLElBQUksQ0FDVDtvQkFDRCxVQUFVLEVBQUU7d0JBQ1YsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQXlCLENBQUMsYUFBYSxDQUNqRSxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7NkJBQ3hCLFdBQVcsQ0FBQyxRQUFRLENBQUM7NkJBQ3JCLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQzs2QkFDL0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQ3hDLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTs2QkFDeEIsV0FBVyxDQUFDLFlBQVksQ0FBQzs2QkFDekIsUUFBUSxDQUFDLFlBQVksQ0FBQzs2QkFDdEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQzNDO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLE1BQU0sS0FBSztxQkFDUixxQkFBcUIsQ0FBQztvQkFDckIsTUFBTSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO29CQUMvQyxJQUFJLEVBQUUsRUFBRSxHQUFHLElBQUk7aUJBQ2hCLENBQUM7cUJBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ1YsSUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRSxDQUFDO3dCQUM1QixXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDaEUsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDbkIsQ0FBQztnQkFDSCxDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQ2IsV0FBVyxDQUFDLFNBQVMsQ0FBQzt3QkFDcEIsT0FBTyxFQUNMLDBGQUEwRjt3QkFDNUYsVUFBVSxFQUFFLEVBQUU7cUJBQ2YsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNMLElBQUksU0FBUztvQkFBRSxPQUFPO2dCQUN0QixNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQ1YsR0FBRyxDQUFBLDRDQUE0QyxrQkFBa0IscUJBQXFCLGlCQUFpQixlQUFlLEVBQUUsRUFBRSxDQUMzSCxDQUFDO2dCQUNGLFdBQVcsQ0FBQyxTQUFTLENBQUM7b0JBQ3BCLE9BQU8sRUFBRSwwQkFBMEIsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDdEQsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsZUFBZSxFQUFFLENBQUM7S0FDbkI7Q0FDRixDQUFDO0FBRUYsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQy9DLDhEQUE4RCxJQUFJLENBQUMsS0FBSyxDQUN0RSxTQUFTLEdBQUcsSUFBSSxDQUNqQixtQ0FBbUMsQ0FBQztBQUN2QyxNQUFNLG1CQUFtQixHQUFHLENBQzFCLG9CQUFvQixFQUNwQixjQUFjLEVBQ2QsYUFBYSxFQUNiLEVBQUUsQ0FDRjt1REFDcUQsb0JBQW9CLHFDQUFxQyxjQUFjO2tGQUM1QyxjQUFjLHNEQUFzRDtJQUNwSixDQUFDLGFBQWE7UUFDWixDQUFDLENBQUMscURBQXFELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsU0FBUztRQUN4SCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uL3N0YXJ0dXAvZGIuanNcIjtcclxuaW1wb3J0IFNRTCBmcm9tIFwic3FsLXRlbXBsYXRlLXN0cmluZ3NcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlncy9jb25maWcuanNvblwiIGFzc2VydCB7IHR5cGU6IFwianNvblwiIH07XHJcbmltcG9ydCB7IGdldF91c2VyX3hwX211bHRpcGxpZXIgfSBmcm9tIFwiLi4vY3VycmVuY3kvb3BlcmF0aW9ucy9hcml0aG1ldGljLmpzXCI7XHJcbmltcG9ydCB7XHJcbiAgYWN0aXZhdGVfYm9vc3QsXHJcbiAgZ2V0X2F2YWlsYWJsZV9ib29zdHMsXHJcbn0gZnJvbSBcIi4uL2NvbW1hbmRfcGFydHMveHBfYm9vc3RzLmpzXCI7XHJcbmltcG9ydCB7IGludGVyYWN0aW9uQ3JlYXRlIH0gZnJvbSBcIi4uL2V2ZW50cy9pbnRlcmFjdGlvbkNyZWF0ZS5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcInVzZWJvb3N0XCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJBY3RpdmF0ZSBhbiBYUCBib29zdCBhdmFpbGFibGUgdG8geW91XCIpXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvblxyXG4gICAgICAgIC5zZXROYW1lKFwiaWRcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgSUQgb2YgdGhlIGJvb3N0IChzZWUgL2Jvb3N0cylcIilcclxuICAgICAgICAuc2V0UmVxdWlyZWQoZmFsc2UpXHJcbiAgICApXHJcbiAgICAuYWRkTnVtYmVyT3B0aW9uKChvcHRpb24pID0+XHJcbiAgICAgIG9wdGlvbi5zZXROYW1lKFwiaG91cnNcIikuc2V0RGVzY3JpcHRpb24oXCJIb3VycyB0byB1c2UgdGhlIGJvb3N0IGZvclwiKVxyXG4gICAgKVxyXG4gICAgLmFkZE51bWJlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb24uc2V0TmFtZShcIm1pbnV0ZXNcIikuc2V0RGVzY3JpcHRpb24oXCJNaW51dGVzIHRvIHVzZSB0aGUgYm9vc3QgZm9yXCIpXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgaWYgKCFpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcImlkXCIpKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYCMjIyBVc2UgYWxsIHlvdXIgYm9vc3RzXHJcbuKWuCBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gdXNlIGFsbCB5b3VyIGJvb3N0cyBmb3IgdGhlaXIgZW50aXJlIGR1cmF0aW9ucz9cclxu4pa4IElmIHlvdSB3YW50IHRvIHVzZSBvbmUgYm9vc3QsIHJ1biB0aGlzIGNvbW1hbmQgYWdhaW4gYnV0IHNwZWNpZnkgb25lIG9mIHlvdXIgYm9vc3QgSURzLmAsXHJcbiAgICAgICAgY29tcG9uZW50czogW1xyXG4gICAgICAgICAgbmV3IERpc2NvcmQuQWN0aW9uUm93QnVpbGRlcjxEaXNjb3JkLkJ1dHRvbkJ1aWxkZXI+KCkuYWRkQ29tcG9uZW50cyhcclxuICAgICAgICAgICAgbmV3IERpc2NvcmQuQnV0dG9uQnVpbGRlcigpXHJcbiAgICAgICAgICAgICAgLnNldFN0eWxlKERpc2NvcmQuQnV0dG9uU3R5bGUuUHJpbWFyeSlcclxuICAgICAgICAgICAgICAuc2V0TGFiZWwoXCJZZXNcIilcclxuICAgICAgICAgICAgICAuc2V0Q3VzdG9tSWQoXCJ5ZXNcIilcclxuICAgICAgICAgICksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSk7XHJcbiAgICAgIChhd2FpdCBpbnRlcmFjdGlvbi5mZXRjaFJlcGx5KCkpXHJcbiAgICAgICAgLmF3YWl0TWVzc2FnZUNvbXBvbmVudCh7IHRpbWU6IDEwICogNjAgKiAxMDAwIH0pXHJcbiAgICAgICAgLnRoZW4oYXN5bmMgKGkpID0+IHtcclxuICAgICAgICAgIGxldCBib29zdHMgPSBhd2FpdCBnZXRfYXZhaWxhYmxlX2Jvb3N0cyhpbnRlcmFjdGlvbi51c2VyLmlkKTtcclxuICAgICAgICAgIGZvciAobGV0IGJvb3N0IG9mIGJvb3N0cykge1xyXG4gICAgICAgICAgICBhd2FpdCBhY3RpdmF0ZV9ib29zdChib29zdC5pZCwgYm9vc3QudW5jbGFpbWVkX3RpbWVfbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICAgICAgY29udGVudDogYCMjIyBBbGwgYm9vc3RzIGFjdGl2YXRlZCFcclxu4pa4IE5vdyBnbyByYWtlIGluIHRoYXQgWFAhIOGVmSggIOKAosyAIOGXnCDigKLMgSAgKeGVl2AsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IFtdLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGlkID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJpZFwiKTtcclxuICAgICAgaWYgKCFpZCkge1xyXG4gICAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcIllvdSBtdXN0IHNwZWNpZnkgYSBib29zdCBJRCFcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBkdXJhdGlvbl9tcyA9XHJcbiAgICAgICAgaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXROdW1iZXIoXCJob3Vyc1wiKSAqIDYwICogNjAgKiAxMDAwICtcclxuICAgICAgICBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcIm1pbnV0ZXNcIikgKiA2MCAqIDEwMDA7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihkdXJhdGlvbl9tcykgfHwgTnVtYmVyLmlzTmFOKGR1cmF0aW9uX21zKSkge1xyXG4gICAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcclxuICAgICAgICAgIFwiSGV5ISBVc2UgYSB2YWxpZCBhbW91bnQgb2YgdGltZSAobm8gZGVjaW1hbHMgb3Igbm9uLW51bWJlcnMpISAoICDigKLMgCDhtJYg4oCizIEgIClcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHVzZXJfYm9vc3RzID0gYXdhaXQgZGIuYWxsKFxyXG4gICAgICAgIFNRTGBTRUxFQ1QgKiBGUk9NIHhwX2Jvb3N0cyBXSEVSRSBvd25lcl9pZCA9ICR7aW50ZXJhY3Rpb24udXNlci5pZH1gXHJcbiAgICAgICk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkX2Jvb3N0ID0gdXNlcl9ib29zdHMuZmluZCgoYm9vc3QpID0+IGJvb3N0LmlkID09PSBpZCk7XHJcbiAgICAgIGlmICghc2VsZWN0ZWRfYm9vc3QpXHJcbiAgICAgICAgcmV0dXJuIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgICBjb250ZW50OiBcIlRoZSBJRCB5b3UgcHJvdmlkZWQgaXMgbm90IGEgYm9vc3QgeW91IG93biFcIixcclxuICAgICAgICB9KTtcclxuICAgICAgaWYgKGR1cmF0aW9uX21zID4gc2VsZWN0ZWRfYm9vc3QudW5jbGFpbWVkX3RpbWVfbXMpXHJcbiAgICAgICAgcmV0dXJuIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgICBjb250ZW50OiBcIllvdSBkb24ndCBoYXZlIHRoYXQgbXVjaCB0aW1lIGxlZnQgb24geW91ciBib29zdCFcIixcclxuICAgICAgICB9KTtcclxuICAgICAgaWYgKCFkdXJhdGlvbl9tcyB8fCBkdXJhdGlvbl9tcyA8PSAwKVxyXG4gICAgICAgIGR1cmF0aW9uX21zID0gc2VsZWN0ZWRfYm9vc3QudW5jbGFpbWVkX3RpbWVfbXM7XHJcbiAgICAgIGNvbnN0IGJvb3N0X21zX3JlbWFpbmluZyA9IHNlbGVjdGVkX2Jvb3N0LnVuY2xhaW1lZF90aW1lX21zIC0gZHVyYXRpb25fbXM7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRfdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuICAgICAgY29uc3QgZXhpc3RpbmdfZW5kX3RpbWVzdGFtcCA9IHNlbGVjdGVkX2Jvb3N0LmVuZF90aW1lc3RhbXA7XHJcbiAgICAgIGNvbnN0IG5ld19lbmRfdGltZXN0YW1wID1cclxuICAgICAgICBNYXRoLm1heChleGlzdGluZ19lbmRfdGltZXN0YW1wIHx8IDAsIGN1cnJlbnRfdGltZXN0YW1wKSArIGR1cmF0aW9uX21zO1xyXG4gICAgICBjb25zdCB1c2VyX2Jvb3N0X211bHRpcGxpZXIgPSBhd2FpdCBnZXRfdXNlcl94cF9tdWx0aXBsaWVyKFxyXG4gICAgICAgIGludGVyYWN0aW9uLnVzZXIuaWRcclxuICAgICAgKTtcclxuICAgICAgY29uc3QgbmV3X3VzZXJfYm9vc3RfbXV0bGlwbGllciA9XHJcbiAgICAgICAgdXNlcl9ib29zdF9tdWx0aXBsaWVyICogc2VsZWN0ZWRfYm9vc3QubXVsdGlwbGllcjtcclxuICAgICAgY29uc3QgbWF4X2Jvb3N0X211dGxpcGxpZXIgPSAoaW50ZXJhY3Rpb24ubWVtYmVyIGFzIERpc2NvcmQuR3VpbGRNZW1iZXIpXHJcbiAgICAgICAgLnByZW1pdW1TaW5jZVxyXG4gICAgICAgID8gY29uZmlnLnNlcnZlci5sZXZlbGluZy5tYXhfeHBfYm9vc3RfbXVsdGlwbGllcnMuYm9vc3RlcnNcclxuICAgICAgICA6IGNvbmZpZy5zZXJ2ZXIubGV2ZWxpbmcubWF4X3hwX2Jvb3N0X211bHRpcGxpZXJzLmRlZmF1bHQ7XHJcbiAgICAgIGlmIChuZXdfdXNlcl9ib29zdF9tdXRsaXBsaWVyIDw9IG1heF9ib29zdF9tdXRsaXBsaWVyKSB7XHJcbiAgICAgICAgYXdhaXQgZGIuYWxsKFxyXG4gICAgICAgICAgU1FMYFVQREFURSB4cF9ib29zdHMgU0VUIHVuY2xhaW1lZF90aW1lX21zID0gJHtib29zdF9tc19yZW1haW5pbmd9LCBlbmRfdGltZXN0YW1wID0gJHtuZXdfZW5kX3RpbWVzdGFtcH0gV0hFUkUgaWQgPSAke2lkfWBcclxuICAgICAgICApO1xyXG4gICAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgICBjb250ZW50OiByZWRlbXB0aW9uX3N1Y2Nlc3NfbWVzc2FnZShuZXdfZW5kX3RpbWVzdGFtcCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgICAgY29udGVudDogbWF4X2Jvb3N0X2V4cGxhaW5lcihcclxuICAgICAgICAgICAgbmV3X3VzZXJfYm9vc3RfbXV0bGlwbGllcixcclxuICAgICAgICAgICAgbWF4X2Jvb3N0X211dGxpcGxpZXIsXHJcbiAgICAgICAgICAgIChpbnRlcmFjdGlvbi5tZW1iZXIgYXMgRGlzY29yZC5HdWlsZE1lbWJlcikucHJlbWl1bVNpbmNlXHJcbiAgICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIGNvbXBvbmVudHM6IFtcclxuICAgICAgICAgICAgbmV3IERpc2NvcmQuQWN0aW9uUm93QnVpbGRlcjxEaXNjb3JkLkJ1dHRvbkJ1aWxkZXI+KCkuYWRkQ29tcG9uZW50cyhcclxuICAgICAgICAgICAgICBuZXcgRGlzY29yZC5CdXR0b25CdWlsZGVyKClcclxuICAgICAgICAgICAgICAgIC5zZXRDdXN0b21JZChcImNhbmNlbFwiKVxyXG4gICAgICAgICAgICAgICAgLnNldExhYmVsKFwiQ2FuY2VsIHRoaXMgY29tbWFuZFwiKVxyXG4gICAgICAgICAgICAgICAgLnNldFN0eWxlKERpc2NvcmQuQnV0dG9uU3R5bGUuUHJpbWFyeSksXHJcbiAgICAgICAgICAgICAgbmV3IERpc2NvcmQuQnV0dG9uQnVpbGRlcigpXHJcbiAgICAgICAgICAgICAgICAuc2V0Q3VzdG9tSWQoXCJ1c2VfYW55d2F5XCIpXHJcbiAgICAgICAgICAgICAgICAuc2V0TGFiZWwoXCJVc2UgYW55d2F5XCIpXHJcbiAgICAgICAgICAgICAgICAuc2V0U3R5bGUoRGlzY29yZC5CdXR0b25TdHlsZS5TZWNvbmRhcnkpXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcclxuICAgICAgICBhd2FpdCByZXBseVxyXG4gICAgICAgICAgLmF3YWl0TWVzc2FnZUNvbXBvbmVudCh7XHJcbiAgICAgICAgICAgIGZpbHRlcjogKGludGVyYWN0aW9uKSA9PiBpbnRlcmFjdGlvbi5pc0J1dHRvbigpLFxyXG4gICAgICAgICAgICB0aW1lOiA2MCAqIDEwMDAsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4oKGkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkuY3VzdG9tSWQgPT09IFwiY2FuY2VsXCIpIHtcclxuICAgICAgICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoeyBjb250ZW50OiBcIkNhbmNlbGxlZFwiLCBjb21wb25lbnRzOiBbXSB9KTtcclxuICAgICAgICAgICAgICBjYW5jZWxsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICAgICAgICBjb250ZW50OlxyXG4gICAgICAgICAgICAgICAgXCJJIHdlbnQgYWhlYWQgYW5kIGNhbmNlbGVkIHRoaXMgZm9yIHlvdSBzaW5jZSB5b3Ugd2FpdGVkIHF1aXRlIGEgd2hpbGUgdG8gY2xpY2sgYSBidXR0b24uXCIsXHJcbiAgICAgICAgICAgICAgY29tcG9uZW50czogW10sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xyXG4gICAgICAgIGF3YWl0IGRiLmFsbChcclxuICAgICAgICAgIFNRTGBVUERBVEUgeHBfYm9vc3RzIFNFVCB1bmNsYWltZWRfdGltZV9tcyA9ICR7Ym9vc3RfbXNfcmVtYWluaW5nfSwgZW5kX3RpbWVzdGFtcCA9ICR7bmV3X2VuZF90aW1lc3RhbXB9IFdIRVJFIGlkID0gJHtpZH1gXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgICAgY29udGVudDogcmVkZW1wdGlvbl9zdWNjZXNzX21lc3NhZ2UobmV3X2VuZF90aW1lc3RhbXApLFxyXG4gICAgICAgICAgY29tcG9uZW50czogW10sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMCxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgcmVkZW1wdGlvbl9zdWNjZXNzX21lc3NhZ2UgPSAodGltZXN0YW1wKSA9PlxyXG4gIGAjIyMg4pqhIFJlZGVtcHRpb24gc3VjY2Vzc2Z1bCFcXG5cXG7ilrggQm9vc3QgYWN0aXZhdGVkIHVudGlsIDx0OiR7TWF0aC5mbG9vcihcclxuICAgIHRpbWVzdGFtcCAvIDEwMDBcclxuICApfTpGPiFcXG7ilrggR29kc3BlZWQhIOGVmSggIOKAosyAIOGXnCDigKLMgSAgKeGVl2A7XHJcbmNvbnN0IG1heF9ib29zdF9leHBsYWluZXIgPSAoXHJcbiAgYXR0ZW1wdGVkX211bHRpcGxpZXIsXHJcbiAgbWF4X211bHRpcGxpZXIsXHJcbiAgc2hvd19ib29zdF9hZFxyXG4pID0+XHJcbiAgYCMjIyBXb2FoIHRoZXJlIVxyXG7ilrggQWZ0ZXIgdXNpbmcgdGhpcyBib29zdCwgeW91ciBtdWx0aXBsaWVyIHdvdWxkIGJlICoqJHthdHRlbXB0ZWRfbXVsdGlwbGllcn14KiosIHdoaWNoIGV4Y2VlZHMgdGhlIGxpbWl0IG9mICoqJHttYXhfbXVsdGlwbGllcn14KiouXHJcbuKWuCBXaGlsZSB5b3UgY2FuIHN0aWxsIHVzZSB0aGUgYm9vc3QsIHlvdXIgbXVsdGlwbGllciB3b24ndCBnbyBhbnkgaGlnaGVyIHRoYW4gKioke21heF9tdWx0aXBsaWVyfXgqKiwgc28gaXQncyBwcm9iYWJseSBub3QgYSBnb29kIGlkZWEgdG8gdXNlIGl0IG5vdy5gICtcclxuICAoc2hvd19ib29zdF9hZFxyXG4gICAgPyBgXFxu4pa4IElmIHlvdSB3ZXJlIGJvb3N0aW5nLCB5b3VyIG1heGltdW0gd291bGQgYmUgKioke2NvbmZpZy5zZXJ2ZXIubGV2ZWxpbmcubWF4X3hwX2Jvb3N0X211bHRpcGxpZXJzLmJvb3N0ZXJzfXgqKiBYUCFgXHJcbiAgICA6IGBgKTtcclxuIl19