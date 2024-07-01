import * as Discord from "discord.js";
import { db } from "../startup/db.js";
import { activate_boost, generate_multiplier_warning, } from "../command_parts/xp_boosts.js";
import { get_user_xp_multiplier } from "../currency/operations/arithmetic.js";
import SQL from "sql-template-strings";
import config from "../configs/config.json" with { type: "json" };
import { get_available_boosts } from "../command_parts/xp_boosts.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("boosts")
        .setDescription("See all boosts available to you")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("The person whose inventory to view")),
    run: async function (interaction) {
        let target = interaction.options.getUser("target");
        if (!(target instanceof Discord.User))
            target = interaction.user;
        const show_select_menu = target.id === interaction.user.id ? true : false;
        let menu = {};
        menu.content =
            `## ${target.displayName}'s boosts\n` +
                (await list_available_boosts(target.id));
        if (show_select_menu && (await get_boost_selector(target.id)))
            menu.components = [await get_boost_selector(target.id)];
        interaction.editReply(menu).then(async (reply) => {
            const collector = await reply.createMessageComponentCollector({
                time: 10 * 60 * 1000,
            });
            collector.on("collect", async (menu_interaction) => {
                await use_boosts(interaction, menu_interaction);
            });
            collector.on("end", (collected) => {
                interaction.editReply({ components: [] });
            });
        });
    },
    options: {
        server_cooldown: 0,
    },
};
async function list_available_boosts(user_id) {
    let boosts = await get_available_boosts(user_id);
    if (!boosts[0])
        return "This user has no boosts :(";
    boosts = boosts.filter((boost) => boost.unclaimed_time_ms > 0 || boost.end_timestamp > Date.now());
    return boosts
        .map((boost) => `▸ ID \`${boost.id}\`: **${boost.multiplier}**x XP, **${boost.unclaimed_time_ms / 1000 / 60}** minutes available ${boost.end_timestamp && boost.end_timestamp > Date.now()
        ? `\| Active until <t:${Math.floor(boost.end_timestamp / 1000)}:F>`
        : ``}`)
        .join("\n");
}
async function get_boost_selector(user_id) {
    const boosts = (await get_available_boosts(user_id)).filter((boost) => boost.unclaimed_time_ms >= 10 * 60 * 1000);
    if (!boosts[0])
        return null;
    const boost_selector = new Discord.StringSelectMenuBuilder()
        .setPlaceholder("Use a boost for 10 minutes")
        .setCustomId("boost_selector")
        .setMinValues(1)
        .setMaxValues(boosts.length)
        .addOptions(boosts.map((boost) => ({
        label: `${boost.multiplier}x, ${boost.unclaimed_time_ms / 60 / 1000} mins available`,
        value: `${boost.id}`,
    })));
    return new Discord.ActionRowBuilder().addComponents(boost_selector);
}
async function use_boosts(interaction, menu_interaction) {
    const values = menu_interaction.values;
    let boosts = [];
    for (let id of values) {
        boosts.push(await db.get(SQL `SELECT * FROM xp_boosts WHERE id = ${id}`));
    }
    const attempted_multiplier = (await get_user_xp_multiplier(menu_interaction.user.id)) *
        boosts.reduce((total, boost) => total * boost.multiplier, 1);
    const multiplier_limit = menu_interaction.member
        .premiumSince
        ? config.server.leveling.max_xp_boost_multipliers.boosters
        : config.server.leveling.max_xp_boost_multipliers.default;
    if (attempted_multiplier < multiplier_limit) {
        for (let boost of boosts)
            await activate_boost(Number(boost.id), 10 * 60 * 1000);
        await interaction.editReply({
            content: `## ${menu_interaction.user.displayName}'s boosts\n` +
                (await list_available_boosts(menu_interaction.user.id)),
            components: [await get_boost_selector(menu_interaction.user.id)],
        });
        await menu_interaction.reply({
            ephemeral: true,
            content: `${menu_interaction.values.length > 1 ? `Boosts` : `Boost`} **successfully** activated!`,
        });
    }
    else {
        await menu_interaction.reply({
            ephemeral: true,
            content: await generate_multiplier_warning(attempted_multiplier, multiplier_limit, menu_interaction.member.premiumSince
                ? true
                : false),
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
        (await menu_interaction.fetchReply())
            .awaitMessageComponent({
            filter: (interaction) => interaction.isButton(),
            time: 60 * 1000,
        })
            .then(async (confirm_interaction) => {
            if (confirm_interaction.customId === "cancel") {
                menu_interaction.editReply({ content: "Cancelled", components: [] });
            }
            else {
                for (let boost of boosts) {
                    await activate_boost(Number(boost.id), 10 * 60 * 1000);
                }
                await interaction.editReply({
                    content: `## ${menu_interaction.user.displayName}'s boosts\n` +
                        (await list_available_boosts(menu_interaction.user.id)),
                    components: [],
                });
                await menu_interaction.editReply({
                    content: `${menu_interaction.values.length > 1 ? `Boosts` : `Boost`} **successfully** activated!`,
                    components: [],
                });
            }
        })
            .catch((err) => {
            console.log(err);
            menu_interaction.editReply({
                content: "I went ahead and canceled this for you since you waited quite a while to click a button.",
                components: [],
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Jvb3N0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDdEMsT0FBTyxFQUNMLGNBQWMsRUFDZCwyQkFBMkIsR0FDNUIsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5RSxPQUFPLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQztBQUN2QyxPQUFPLE1BQU0sTUFBTSx3QkFBd0IsQ0FBQyxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQVVyRSxlQUFlO0lBQ2IsSUFBSSxFQUFFLElBQUksT0FBTyxDQUFDLG1CQUFtQixFQUFFO1NBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUM7U0FDakIsY0FBYyxDQUFDLGlDQUFpQyxDQUFDO1NBQ2pELGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ3hCLE1BQU07U0FDSCxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ2pCLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUN4RDtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNqRSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxFQUFFLEtBQUssV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENB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V0FBVyxDQUFDLFNBQVMsQ0FBQztvQkFDMUIsT0FBTyxFQUNMLE1BQU0sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsYUFBYTt3QkFDcEQsQ0FBQyxNQUFNLHFCQUFxQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDekQsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQyxDQUFDO2dCQUNILE1BQU0sZ0JBQWdCLENBQUMsU0FBUyxDQUFDO29CQUMvQixPQUFPLEVBQUUsR0FDUCxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUNsRCw4QkFBOEI7b0JBQzlCLFVBQVUsRUFBRSxFQUFFO2lCQUNmLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2dCQUN6QixPQUFPLEVBQ0wsMEZBQTBGO2dCQUM1RixVQUFVLEVBQUUsRUFBRTthQUNmLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uL3N0YXJ0dXAvZGIuanNcIjtcclxuaW1wb3J0IHtcclxuICBhY3RpdmF0ZV9ib29zdCxcclxuICBnZW5lcmF0ZV9tdWx0aXBsaWVyX3dhcm5pbmcsXHJcbn0gZnJvbSBcIi4uL2NvbW1hbmRfcGFydHMveHBfYm9vc3RzLmpzXCI7XHJcbmltcG9ydCB7IGdldF91c2VyX3hwX211bHRpcGxpZXIgfSBmcm9tIFwiLi4vY3VycmVuY3kvb3BlcmF0aW9ucy9hcml0aG1ldGljLmpzXCI7XHJcbmltcG9ydCBTUUwgZnJvbSBcInNxbC10ZW1wbGF0ZS1zdHJpbmdzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5pbXBvcnQgeyBnZXRfYXZhaWxhYmxlX2Jvb3N0cyB9IGZyb20gXCIuLi9jb21tYW5kX3BhcnRzL3hwX2Jvb3N0cy5qc1wiO1xyXG5cclxuaW50ZXJmYWNlIFhQQm9vc3Qge1xyXG4gIG11bHRpcGxpZXI6IG51bWJlcjtcclxuICB1bmNsYWltZWRfdGltZV9tczogbnVtYmVyO1xyXG4gIG93bmVyX2lkOiBzdHJpbmc7XHJcbiAgZW5kX3RpbWVzdGFtcDogbnVtYmVyO1xyXG4gIGlkOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwiYm9vc3RzXCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJTZWUgYWxsIGJvb3N0cyBhdmFpbGFibGUgdG8geW91XCIpXHJcbiAgICAuYWRkVXNlck9wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcInRhcmdldFwiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSBwZXJzb24gd2hvc2UgaW52ZW50b3J5IHRvIHZpZXdcIilcclxuICAgICksXHJcbiAgcnVuOiBhc3luYyBmdW5jdGlvbiAoaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gaW50ZXJhY3Rpb24ub3B0aW9ucy5nZXRVc2VyKFwidGFyZ2V0XCIpO1xyXG4gICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgRGlzY29yZC5Vc2VyKSkgdGFyZ2V0ID0gaW50ZXJhY3Rpb24udXNlcjtcclxuICAgIGNvbnN0IHNob3dfc2VsZWN0X21lbnUgPSB0YXJnZXQuaWQgPT09IGludGVyYWN0aW9uLnVzZXIuaWQgPyB0cnVlIDogZmFsc2U7XHJcbiAgICBsZXQgbWVudTogYW55ID0ge307XHJcbiAgICBtZW51LmNvbnRlbnQgPVxyXG4gICAgICBgIyMgJHt0YXJnZXQuZGlzcGxheU5hbWV9J3MgYm9vc3RzXFxuYCArXHJcbiAgICAgIChhd2FpdCBsaXN0X2F2YWlsYWJsZV9ib29zdHModGFyZ2V0LmlkKSk7XHJcbiAgICBpZiAoc2hvd19zZWxlY3RfbWVudSAmJiAoYXdhaXQgZ2V0X2Jvb3N0X3NlbGVjdG9yKHRhcmdldC5pZCkpKVxyXG4gICAgICBtZW51LmNvbXBvbmVudHMgPSBbYXdhaXQgZ2V0X2Jvb3N0X3NlbGVjdG9yKHRhcmdldC5pZCldO1xyXG4gICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KG1lbnUpLnRoZW4oYXN5bmMgKHJlcGx5KSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbGxlY3RvciA9IGF3YWl0IHJlcGx5LmNyZWF0ZU1lc3NhZ2VDb21wb25lbnRDb2xsZWN0b3Ioe1xyXG4gICAgICAgIHRpbWU6IDEwICogNjAgKiAxMDAwLFxyXG4gICAgICB9KTtcclxuICAgICAgY29sbGVjdG9yLm9uKFwiY29sbGVjdFwiLCBhc3luYyAobWVudV9pbnRlcmFjdGlvbikgPT4ge1xyXG4gICAgICAgIGF3YWl0IHVzZV9ib29zdHMoXHJcbiAgICAgICAgICBpbnRlcmFjdGlvbixcclxuICAgICAgICAgIG1lbnVfaW50ZXJhY3Rpb24gYXMgRGlzY29yZC5TdHJpbmdTZWxlY3RNZW51SW50ZXJhY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgICB9KTtcclxuICAgICAgY29sbGVjdG9yLm9uKFwiZW5kXCIsIChjb2xsZWN0ZWQpID0+IHtcclxuICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoeyBjb21wb25lbnRzOiBbXSB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIG9wdGlvbnM6IHtcclxuICAgIHNlcnZlcl9jb29sZG93bjogMCxcclxuICB9LFxyXG59O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gbGlzdF9hdmFpbGFibGVfYm9vc3RzKHVzZXJfaWQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgbGV0IGJvb3N0cyA9IGF3YWl0IGdldF9hdmFpbGFibGVfYm9vc3RzKHVzZXJfaWQpO1xyXG4gIGlmICghYm9vc3RzWzBdKSByZXR1cm4gXCJUaGlzIHVzZXIgaGFzIG5vIGJvb3N0cyA6KFwiO1xyXG4gIGJvb3N0cyA9IGJvb3N0cy5maWx0ZXIoXHJcbiAgICAoYm9vc3QpID0+IGJvb3N0LnVuY2xhaW1lZF90aW1lX21zID4gMCB8fCBib29zdC5lbmRfdGltZXN0YW1wID4gRGF0ZS5ub3coKVxyXG4gICk7XHJcbiAgcmV0dXJuIGJvb3N0c1xyXG4gICAgLm1hcChcclxuICAgICAgKGJvb3N0KSA9PlxyXG4gICAgICAgIGDilrggSUQgXFxgJHtib29zdC5pZH1cXGA6ICoqJHtib29zdC5tdWx0aXBsaWVyfSoqeCBYUCwgKioke1xyXG4gICAgICAgICAgYm9vc3QudW5jbGFpbWVkX3RpbWVfbXMgLyAxMDAwIC8gNjBcclxuICAgICAgICB9KiogbWludXRlcyBhdmFpbGFibGUgJHtcclxuICAgICAgICAgIGJvb3N0LmVuZF90aW1lc3RhbXAgJiYgYm9vc3QuZW5kX3RpbWVzdGFtcCA+IERhdGUubm93KClcclxuICAgICAgICAgICAgPyBgXFx8IEFjdGl2ZSB1bnRpbCA8dDoke01hdGguZmxvb3IoYm9vc3QuZW5kX3RpbWVzdGFtcCAvIDEwMDApfTpGPmBcclxuICAgICAgICAgICAgOiBgYFxyXG4gICAgICAgIH1gXHJcbiAgICApXHJcbiAgICAuam9pbihcIlxcblwiKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0X2Jvb3N0X3NlbGVjdG9yKHVzZXJfaWQ6IHN0cmluZykge1xyXG4gIGNvbnN0IGJvb3N0cyA9IChhd2FpdCBnZXRfYXZhaWxhYmxlX2Jvb3N0cyh1c2VyX2lkKSkuZmlsdGVyKFxyXG4gICAgKGJvb3N0KSA9PiBib29zdC51bmNsYWltZWRfdGltZV9tcyA+PSAxMCAqIDYwICogMTAwMFxyXG4gICk7XHJcbiAgaWYgKCFib29zdHNbMF0pIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IGJvb3N0X3NlbGVjdG9yID0gbmV3IERpc2NvcmQuU3RyaW5nU2VsZWN0TWVudUJ1aWxkZXIoKVxyXG4gICAgLnNldFBsYWNlaG9sZGVyKFwiVXNlIGEgYm9vc3QgZm9yIDEwIG1pbnV0ZXNcIilcclxuICAgIC5zZXRDdXN0b21JZChcImJvb3N0X3NlbGVjdG9yXCIpXHJcbiAgICAuc2V0TWluVmFsdWVzKDEpXHJcbiAgICAuc2V0TWF4VmFsdWVzKGJvb3N0cy5sZW5ndGgpXHJcbiAgICAuYWRkT3B0aW9ucyhcclxuICAgICAgYm9vc3RzLm1hcCgoYm9vc3QpID0+ICh7XHJcbiAgICAgICAgbGFiZWw6IGAke2Jvb3N0Lm11bHRpcGxpZXJ9eCwgJHtcclxuICAgICAgICAgIGJvb3N0LnVuY2xhaW1lZF90aW1lX21zIC8gNjAgLyAxMDAwXHJcbiAgICAgICAgfSBtaW5zIGF2YWlsYWJsZWAsXHJcbiAgICAgICAgdmFsdWU6IGAke2Jvb3N0LmlkfWAsXHJcbiAgICAgIH0pKVxyXG4gICAgKTtcclxuICByZXR1cm4gbmV3IERpc2NvcmQuQWN0aW9uUm93QnVpbGRlcjxEaXNjb3JkLlN0cmluZ1NlbGVjdE1lbnVCdWlsZGVyPigpLmFkZENvbXBvbmVudHMoXHJcbiAgICBib29zdF9zZWxlY3RvclxyXG4gICk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHVzZV9ib29zdHMoXHJcbiAgaW50ZXJhY3Rpb246IERpc2NvcmQuQ2hhdElucHV0Q29tbWFuZEludGVyYWN0aW9uLFxyXG4gIG1lbnVfaW50ZXJhY3Rpb246IERpc2NvcmQuU3RyaW5nU2VsZWN0TWVudUludGVyYWN0aW9uXHJcbikge1xyXG4gIGNvbnN0IHZhbHVlcyA9IG1lbnVfaW50ZXJhY3Rpb24udmFsdWVzO1xyXG4gIGxldCBib29zdHMgPSBbXTtcclxuICBmb3IgKGxldCBpZCBvZiB2YWx1ZXMpIHtcclxuICAgIGJvb3N0cy5wdXNoKGF3YWl0IGRiLmdldChTUUxgU0VMRUNUICogRlJPTSB4cF9ib29zdHMgV0hFUkUgaWQgPSAke2lkfWApKTtcclxuICB9XHJcbiAgY29uc3QgYXR0ZW1wdGVkX211bHRpcGxpZXIgPVxyXG4gICAgKGF3YWl0IGdldF91c2VyX3hwX211bHRpcGxpZXIobWVudV9pbnRlcmFjdGlvbi51c2VyLmlkKSkgKlxyXG4gICAgYm9vc3RzLnJlZHVjZSgodG90YWwsIGJvb3N0KSA9PiB0b3RhbCAqIGJvb3N0Lm11bHRpcGxpZXIsIDEpO1xyXG4gIGNvbnN0IG11bHRpcGxpZXJfbGltaXQgPSAobWVudV9pbnRlcmFjdGlvbi5tZW1iZXIgYXMgRGlzY29yZC5HdWlsZE1lbWJlcilcclxuICAgIC5wcmVtaXVtU2luY2VcclxuICAgID8gY29uZmlnLnNlcnZlci5sZXZlbGluZy5tYXhfeHBfYm9vc3RfbXVsdGlwbGllcnMuYm9vc3RlcnNcclxuICAgIDogY29uZmlnLnNlcnZlci5sZXZlbGluZy5tYXhfeHBfYm9vc3RfbXVsdGlwbGllcnMuZGVmYXVsdDtcclxuICBpZiAoYXR0ZW1wdGVkX211bHRpcGxpZXIgPCBtdWx0aXBsaWVyX2xpbWl0KSB7XHJcbiAgICBmb3IgKGxldCBib29zdCBvZiBib29zdHMpXHJcbiAgICAgIGF3YWl0IGFjdGl2YXRlX2Jvb3N0KE51bWJlcihib29zdC5pZCksIDEwICogNjAgKiAxMDAwKTtcclxuICAgIGF3YWl0IGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgIGNvbnRlbnQ6XHJcbiAgICAgICAgYCMjICR7bWVudV9pbnRlcmFjdGlvbi51c2VyLmRpc3BsYXlOYW1lfSdzIGJvb3N0c1xcbmAgK1xyXG4gICAgICAgIChhd2FpdCBsaXN0X2F2YWlsYWJsZV9ib29zdHMobWVudV9pbnRlcmFjdGlvbi51c2VyLmlkKSksXHJcbiAgICAgIGNvbXBvbmVudHM6IFthd2FpdCBnZXRfYm9vc3Rfc2VsZWN0b3IobWVudV9pbnRlcmFjdGlvbi51c2VyLmlkKV0sXHJcbiAgICB9KTtcclxuICAgIGF3YWl0IG1lbnVfaW50ZXJhY3Rpb24ucmVwbHkoe1xyXG4gICAgICBlcGhlbWVyYWw6IHRydWUsXHJcbiAgICAgIGNvbnRlbnQ6IGAke1xyXG4gICAgICAgIG1lbnVfaW50ZXJhY3Rpb24udmFsdWVzLmxlbmd0aCA+IDEgPyBgQm9vc3RzYCA6IGBCb29zdGBcclxuICAgICAgfSAqKnN1Y2Nlc3NmdWxseSoqIGFjdGl2YXRlZCFgLFxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGF3YWl0IG1lbnVfaW50ZXJhY3Rpb24ucmVwbHkoe1xyXG4gICAgICBlcGhlbWVyYWw6IHRydWUsXHJcbiAgICAgIGNvbnRlbnQ6IGF3YWl0IGdlbmVyYXRlX211bHRpcGxpZXJfd2FybmluZyhcclxuICAgICAgICBhdHRlbXB0ZWRfbXVsdGlwbGllcixcclxuICAgICAgICBtdWx0aXBsaWVyX2xpbWl0LFxyXG4gICAgICAgIChtZW51X2ludGVyYWN0aW9uLm1lbWJlciBhcyBEaXNjb3JkLkd1aWxkTWVtYmVyKS5wcmVtaXVtU2luY2VcclxuICAgICAgICAgID8gdHJ1ZVxyXG4gICAgICAgICAgOiBmYWxzZVxyXG4gICAgICApLFxyXG4gICAgICBjb21wb25lbnRzOiBbXHJcbiAgICAgICAgbmV3IERpc2NvcmQuQWN0aW9uUm93QnVpbGRlcjxEaXNjb3JkLkJ1dHRvbkJ1aWxkZXI+KCkuYWRkQ29tcG9uZW50cyhcclxuICAgICAgICAgIG5ldyBEaXNjb3JkLkJ1dHRvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuc2V0Q3VzdG9tSWQoXCJjYW5jZWxcIilcclxuICAgICAgICAgICAgLnNldExhYmVsKFwiQ2FuY2VsIHRoaXMgY29tbWFuZFwiKVxyXG4gICAgICAgICAgICAuc2V0U3R5bGUoRGlzY29yZC5CdXR0b25TdHlsZS5QcmltYXJ5KSxcclxuICAgICAgICAgIG5ldyBEaXNjb3JkLkJ1dHRvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuc2V0Q3VzdG9tSWQoXCJ1c2VfYW55d2F5XCIpXHJcbiAgICAgICAgICAgIC5zZXRMYWJlbChcIlVzZSBhbnl3YXlcIilcclxuICAgICAgICAgICAgLnNldFN0eWxlKERpc2NvcmQuQnV0dG9uU3R5bGUuU2Vjb25kYXJ5KVxyXG4gICAgICAgICksXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuICAgIChhd2FpdCBtZW51X2ludGVyYWN0aW9uLmZldGNoUmVwbHkoKSlcclxuICAgICAgLmF3YWl0TWVzc2FnZUNvbXBvbmVudCh7XHJcbiAgICAgICAgZmlsdGVyOiAoaW50ZXJhY3Rpb24pID0+IGludGVyYWN0aW9uLmlzQnV0dG9uKCksXHJcbiAgICAgICAgdGltZTogNjAgKiAxMDAwLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihhc3luYyAoY29uZmlybV9pbnRlcmFjdGlvbikgPT4ge1xyXG4gICAgICAgIGlmIChjb25maXJtX2ludGVyYWN0aW9uLmN1c3RvbUlkID09PSBcImNhbmNlbFwiKSB7XHJcbiAgICAgICAgICBtZW51X2ludGVyYWN0aW9uLmVkaXRSZXBseSh7IGNvbnRlbnQ6IFwiQ2FuY2VsbGVkXCIsIGNvbXBvbmVudHM6IFtdIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBib29zdCBvZiBib29zdHMpIHtcclxuICAgICAgICAgICAgYXdhaXQgYWN0aXZhdGVfYm9vc3QoTnVtYmVyKGJvb3N0LmlkKSwgMTAgKiA2MCAqIDEwMDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYXdhaXQgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICAgICAgY29udGVudDpcclxuICAgICAgICAgICAgICBgIyMgJHttZW51X2ludGVyYWN0aW9uLnVzZXIuZGlzcGxheU5hbWV9J3MgYm9vc3RzXFxuYCArXHJcbiAgICAgICAgICAgICAgKGF3YWl0IGxpc3RfYXZhaWxhYmxlX2Jvb3N0cyhtZW51X2ludGVyYWN0aW9uLnVzZXIuaWQpKSxcclxuICAgICAgICAgICAgY29tcG9uZW50czogW10sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGF3YWl0IG1lbnVfaW50ZXJhY3Rpb24uZWRpdFJlcGx5KHtcclxuICAgICAgICAgICAgY29udGVudDogYCR7XHJcbiAgICAgICAgICAgICAgbWVudV9pbnRlcmFjdGlvbi52YWx1ZXMubGVuZ3RoID4gMSA/IGBCb29zdHNgIDogYEJvb3N0YFxyXG4gICAgICAgICAgICB9ICoqc3VjY2Vzc2Z1bGx5KiogYWN0aXZhdGVkIWAsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IFtdLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgbWVudV9pbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgICAgY29udGVudDpcclxuICAgICAgICAgICAgXCJJIHdlbnQgYWhlYWQgYW5kIGNhbmNlbGVkIHRoaXMgZm9yIHlvdSBzaW5jZSB5b3Ugd2FpdGVkIHF1aXRlIGEgd2hpbGUgdG8gY2xpY2sgYSBidXR0b24uXCIsXHJcbiAgICAgICAgICBjb21wb25lbnRzOiBbXSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==