import * as Discord from "discord.js";
import { get_commands } from "../startup/commands.js";
import { db } from "../startup/db.js";
import SQL from "sql-template-strings";
let commands = [];
export async function interactionCreate(interaction) {
    if (interaction instanceof Discord.ChatInputCommandInteraction ||
        interaction instanceof Discord.ContextMenuCommandInteraction) {
        if (!commands[0]) {
            try {
                commands = await get_commands();
            }
            catch (err) {
                console.log(err);
            }
        }
        const command = commands.find((c) => c.data.name === interaction.commandName);
        if (command.options.server_cooldown) {
            let next_available_timestamp = await get_command_cooldown(interaction.commandName);
            if (next_available_timestamp > Date.now()) {
                interaction.editReply({
                    content: `# This command is on cooldown :(\n▸ It will be available <t:${Math.round(next_available_timestamp / 1000)}:R>`,
                });
                return;
            }
        }
        try {
            await command.run(interaction);
        }
        catch (err) {
            interaction.editReply({
                content: `### :bug: You've reached The Failsafe
▸ The Failsafe is a place where you end up when your command errors and it's caught by the bot's failsafe instead of the command itself.
▸ Here's the error. If it doesn't make sense, let a developer know what the message is and how you got here.
\`\`\`${err}\`\`\``,
            });
        }
        if (command.options.server_cooldown)
            set_command_cooldown(interaction.commandName, Date.now() + command.options.server_cooldown);
    }
}
async function get_command_cooldown(command_name) {
    const cooldown_data = await db.get(SQL `SELECT next_available_timestamp from server_command_cooldowns WHERE name = ${command_name}`);
    if (!cooldown_data)
        return 0;
    return cooldown_data.next_available_timestamp;
}
async function set_command_cooldown(command_name, timestamp) {
    const cooldown_data = await db.get(SQL `SELECT next_available_timestamp from server_command_cooldowns WHERE name = ${command_name}`);
    if (cooldown_data == undefined)
        await db.run(SQL `INSERT INTO server_command_cooldowns (name, next_available_timestamp) VALUES (${command_name}, ${timestamp})`);
    else {
        await db.run(SQL `UPDATE server_command_cooldowns SET next_available_timestamp = ${timestamp} WHERE name = ${command_name}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJhY3Rpb25DcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2ludGVyYWN0aW9uQ3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxPQUFPLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDdEMsT0FBTyxHQUFHLE1BQU0sc0JBQXNCLENBQUM7QUFDdkMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBRWxCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsaUJBQWlCLENBQUMsV0FBZ0M7SUFDdEUsSUFDRSxXQUFXLFlBQVksT0FBTyxDQUFDLDJCQUEyQjtRQUMxRCxXQUFXLFlBQVksT0FBTyxDQUFDLDZCQUE2QixFQUM1RCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQztnQkFDSCxRQUFRLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQztZQUNsQyxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FDM0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxXQUFXLENBQy9DLENBQUM7UUFDRixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDcEMsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLG9CQUFvQixDQUN2RCxXQUFXLENBQUMsV0FBVyxDQUN4QixDQUFDO1lBQ0YsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDMUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztvQkFDcEIsT0FBTyxFQUFFLCtEQUErRCxJQUFJLENBQUMsS0FBSyxDQUNoRix3QkFBd0IsR0FBRyxJQUFJLENBQ2hDLEtBQUs7aUJBQ1AsQ0FBQyxDQUFDO2dCQUNILE9BQU87WUFDVCxDQUFDO1FBQ0gsQ0FBQztRQUNELElBQUksQ0FBQztZQUNILE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQ3BCLE9BQU8sRUFBRTs7O1FBR1QsR0FBRyxRQUFRO2FBQ1osQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlO1lBQ2pDLG9CQUFvQixDQUNsQixXQUFXLENBQUMsV0FBVyxFQUN2QixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQzdDLENBQUM7SUFDTixDQUFDO0FBQ0gsQ0FBQztBQUVELEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxZQUFvQjtJQUN0RCxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQ2hDLEdBQUcsQ0FBQSw4RUFBOEUsWUFBWSxFQUFFLENBQ2hHLENBQUM7SUFDRixJQUFJLENBQUMsYUFBYTtRQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLE9BQU8sYUFBYSxDQUFDLHdCQUF3QixDQUFDO0FBQ2hELENBQUM7QUFFRCxLQUFLLFVBQVUsb0JBQW9CLENBQUMsWUFBb0IsRUFBRSxTQUFpQjtJQUN6RSxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQ2hDLEdBQUcsQ0FBQSw4RUFBOEUsWUFBWSxFQUFFLENBQ2hHLENBQUM7SUFDRixJQUFJLGFBQWEsSUFBSSxTQUFTO1FBQzVCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDVixHQUFHLENBQUEsaUZBQWlGLFlBQVksS0FBSyxTQUFTLEdBQUcsQ0FDbEgsQ0FBQztTQUNDLENBQUM7UUFDSixNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQ1YsR0FBRyxDQUFBLGtFQUFrRSxTQUFTLGlCQUFpQixZQUFZLEVBQUUsQ0FDOUcsQ0FBQztJQUNKLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRGlzY29yZCBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5pbXBvcnQgeyBnZXRfY29tbWFuZHMgfSBmcm9tIFwiLi4vc3RhcnR1cC9jb21tYW5kcy5qc1wiO1xyXG5pbXBvcnQgeyBkYiB9IGZyb20gXCIuLi9zdGFydHVwL2RiLmpzXCI7XHJcbmltcG9ydCBTUUwgZnJvbSBcInNxbC10ZW1wbGF0ZS1zdHJpbmdzXCI7XHJcbmxldCBjb21tYW5kcyA9IFtdO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGludGVyYWN0aW9uQ3JlYXRlKGludGVyYWN0aW9uOiBEaXNjb3JkLkludGVyYWN0aW9uKSB7XHJcbiAgaWYgKFxyXG4gICAgaW50ZXJhY3Rpb24gaW5zdGFuY2VvZiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbiB8fFxyXG4gICAgaW50ZXJhY3Rpb24gaW5zdGFuY2VvZiBEaXNjb3JkLkNvbnRleHRNZW51Q29tbWFuZEludGVyYWN0aW9uXHJcbiAgKSB7XHJcbiAgICBpZiAoIWNvbW1hbmRzWzBdKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29tbWFuZHMgPSBhd2FpdCBnZXRfY29tbWFuZHMoKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY29tbWFuZCA9IGNvbW1hbmRzLmZpbmQoXHJcbiAgICAgIChjKSA9PiBjLmRhdGEubmFtZSA9PT0gaW50ZXJhY3Rpb24uY29tbWFuZE5hbWVcclxuICAgICk7XHJcbiAgICBpZiAoY29tbWFuZC5vcHRpb25zLnNlcnZlcl9jb29sZG93bikge1xyXG4gICAgICBsZXQgbmV4dF9hdmFpbGFibGVfdGltZXN0YW1wID0gYXdhaXQgZ2V0X2NvbW1hbmRfY29vbGRvd24oXHJcbiAgICAgICAgaW50ZXJhY3Rpb24uY29tbWFuZE5hbWVcclxuICAgICAgKTtcclxuICAgICAgaWYgKG5leHRfYXZhaWxhYmxlX3RpbWVzdGFtcCA+IERhdGUubm93KCkpIHtcclxuICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoe1xyXG4gICAgICAgICAgY29udGVudDogYCMgVGhpcyBjb21tYW5kIGlzIG9uIGNvb2xkb3duIDooXFxu4pa4IEl0IHdpbGwgYmUgYXZhaWxhYmxlIDx0OiR7TWF0aC5yb3VuZChcclxuICAgICAgICAgICAgbmV4dF9hdmFpbGFibGVfdGltZXN0YW1wIC8gMTAwMFxyXG4gICAgICAgICAgKX06Uj5gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgY29tbWFuZC5ydW4oaW50ZXJhY3Rpb24pO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseSh7XHJcbiAgICAgICAgY29udGVudDogYCMjIyA6YnVnOiBZb3UndmUgcmVhY2hlZCBUaGUgRmFpbHNhZmVcclxu4pa4IFRoZSBGYWlsc2FmZSBpcyBhIHBsYWNlIHdoZXJlIHlvdSBlbmQgdXAgd2hlbiB5b3VyIGNvbW1hbmQgZXJyb3JzIGFuZCBpdCdzIGNhdWdodCBieSB0aGUgYm90J3MgZmFpbHNhZmUgaW5zdGVhZCBvZiB0aGUgY29tbWFuZCBpdHNlbGYuXHJcbuKWuCBIZXJlJ3MgdGhlIGVycm9yLiBJZiBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UsIGxldCBhIGRldmVsb3BlciBrbm93IHdoYXQgdGhlIG1lc3NhZ2UgaXMgYW5kIGhvdyB5b3UgZ290IGhlcmUuXHJcblxcYFxcYFxcYCR7ZXJyfVxcYFxcYFxcYGAsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbW1hbmQub3B0aW9ucy5zZXJ2ZXJfY29vbGRvd24pXHJcbiAgICAgIHNldF9jb21tYW5kX2Nvb2xkb3duKFxyXG4gICAgICAgIGludGVyYWN0aW9uLmNvbW1hbmROYW1lLFxyXG4gICAgICAgIERhdGUubm93KCkgKyBjb21tYW5kLm9wdGlvbnMuc2VydmVyX2Nvb2xkb3duXHJcbiAgICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRfY29tbWFuZF9jb29sZG93bihjb21tYW5kX25hbWU6IHN0cmluZykge1xyXG4gIGNvbnN0IGNvb2xkb3duX2RhdGEgPSBhd2FpdCBkYi5nZXQoXHJcbiAgICBTUUxgU0VMRUNUIG5leHRfYXZhaWxhYmxlX3RpbWVzdGFtcCBmcm9tIHNlcnZlcl9jb21tYW5kX2Nvb2xkb3ducyBXSEVSRSBuYW1lID0gJHtjb21tYW5kX25hbWV9YFxyXG4gICk7XHJcbiAgaWYgKCFjb29sZG93bl9kYXRhKSByZXR1cm4gMDtcclxuICByZXR1cm4gY29vbGRvd25fZGF0YS5uZXh0X2F2YWlsYWJsZV90aW1lc3RhbXA7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHNldF9jb21tYW5kX2Nvb2xkb3duKGNvbW1hbmRfbmFtZTogc3RyaW5nLCB0aW1lc3RhbXA6IG51bWJlcikge1xyXG4gIGNvbnN0IGNvb2xkb3duX2RhdGEgPSBhd2FpdCBkYi5nZXQoXHJcbiAgICBTUUxgU0VMRUNUIG5leHRfYXZhaWxhYmxlX3RpbWVzdGFtcCBmcm9tIHNlcnZlcl9jb21tYW5kX2Nvb2xkb3ducyBXSEVSRSBuYW1lID0gJHtjb21tYW5kX25hbWV9YFxyXG4gICk7XHJcbiAgaWYgKGNvb2xkb3duX2RhdGEgPT0gdW5kZWZpbmVkKVxyXG4gICAgYXdhaXQgZGIucnVuKFxyXG4gICAgICBTUUxgSU5TRVJUIElOVE8gc2VydmVyX2NvbW1hbmRfY29vbGRvd25zIChuYW1lLCBuZXh0X2F2YWlsYWJsZV90aW1lc3RhbXApIFZBTFVFUyAoJHtjb21tYW5kX25hbWV9LCAke3RpbWVzdGFtcH0pYFxyXG4gICAgKTtcclxuICBlbHNlIHtcclxuICAgIGF3YWl0IGRiLnJ1bihcclxuICAgICAgU1FMYFVQREFURSBzZXJ2ZXJfY29tbWFuZF9jb29sZG93bnMgU0VUIG5leHRfYXZhaWxhYmxlX3RpbWVzdGFtcCA9ICR7dGltZXN0YW1wfSBXSEVSRSBuYW1lID0gJHtjb21tYW5kX25hbWV9YFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19