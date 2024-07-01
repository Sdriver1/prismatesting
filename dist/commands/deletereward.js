import * as Discord from "discord.js";
import SQL from "sql-template-strings";
import { db } from "../startup/db.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("deletereward")
        .setDescription("Delete a reward (based on monthlymessages)")
        .addNumberOption((option) => option
        .setName("messages")
        .setDescription("The # of messages this reward is given at")
        .setRequired(true)),
    run: async function (interaction) {
        const messages = interaction.options.getNumber("messages");
        await db.all(SQL `DELETE FROM rewards WHERE messages = ${messages}`);
        interaction.editReply("Done!");
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlcmV3YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2RlbGV0ZXJld2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFdEMsZUFBZTtJQUNiLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtTQUNwQyxPQUFPLENBQUMsY0FBYyxDQUFDO1NBQ3ZCLGNBQWMsQ0FBQyw0Q0FBNEMsQ0FBQztTQUM1RCxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUNuQixjQUFjLENBQUMsMkNBQTJDLENBQUM7U0FDM0QsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFDbkUsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0QsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQSx3Q0FBd0MsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNwRSxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxPQUFPLEVBQUU7UUFDUCxlQUFlLEVBQUUsQ0FBQztLQUNuQjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCBTUUwgZnJvbSBcInNxbC10ZW1wbGF0ZS1zdHJpbmdzXCI7XHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uL3N0YXJ0dXAvZGIuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXRhOiBuZXcgRGlzY29yZC5TbGFzaENvbW1hbmRCdWlsZGVyKClcclxuICAgIC5zZXROYW1lKFwiZGVsZXRlcmV3YXJkXCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJEZWxldGUgYSByZXdhcmQgKGJhc2VkIG9uIG1vbnRobHltZXNzYWdlcylcIilcclxuICAgIC5hZGROdW1iZXJPcHRpb24oKG9wdGlvbikgPT5cclxuICAgICAgb3B0aW9uXHJcbiAgICAgICAgLnNldE5hbWUoXCJtZXNzYWdlc1wiKVxyXG4gICAgICAgIC5zZXREZXNjcmlwdGlvbihcIlRoZSAjIG9mIG1lc3NhZ2VzIHRoaXMgcmV3YXJkIGlzIGdpdmVuIGF0XCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgY29uc3QgbWVzc2FnZXMgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldE51bWJlcihcIm1lc3NhZ2VzXCIpO1xyXG4gICAgYXdhaXQgZGIuYWxsKFNRTGBERUxFVEUgRlJPTSByZXdhcmRzIFdIRVJFIG1lc3NhZ2VzID0gJHttZXNzYWdlc31gKTtcclxuICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcIkRvbmUhXCIpO1xyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==