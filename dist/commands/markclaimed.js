import * as Discord from "discord.js";
export default {
    data: new Discord.SlashCommandBuilder()
        .setName("markclaimed")
        .setDescription("Mark a reward message as claimed")
        .addStringOption((option) => option
        .setName("message_id")
        .setDescription("The ID of the reward message")
        .setRequired(true)),
    run: async function (interaction) {
        const message_id = interaction.options.getString("message_id");
        const message = await interaction.channel.messages
            .fetch(message_id)
            .catch((err) => {
            interaction.editReply("Message not found! Make sure you're in the same channel as the message.");
            return;
        });
        if (!message)
            return;
        if (message.author.id !== interaction.client.user.id) {
            interaction.editReply("I cannot edit this message!");
            return;
        }
        const new_message_content = message.content + "\n\nA moderator has claimed this for you.";
        if (new_message_content.length > 2000) {
            interaction.editReply("I'm interested in the fact that you test for edge cases like this. Nice try, but no.");
            return;
        }
        else {
            message.edit({
                content: new_message_content,
                components: [],
            });
            interaction.editReply("Done!");
        }
    },
    options: {
        server_cooldown: 0,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2NsYWltZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbWFya2NsYWltZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsZUFBZTtJQUNiLElBQUksRUFBRSxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtTQUNwQyxPQUFPLENBQUMsYUFBYSxDQUFDO1NBQ3RCLGNBQWMsQ0FBQyxrQ0FBa0MsQ0FBQztTQUNsRCxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUMxQixNQUFNO1NBQ0gsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUNyQixjQUFjLENBQUMsOEJBQThCLENBQUM7U0FDOUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNyQjtJQUNILEdBQUcsRUFBRSxLQUFLLFdBQVcsV0FBZ0Q7UUFFbkUsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDL0MsS0FBSyxDQUFDLFVBQVUsQ0FBQzthQUNqQixLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLFdBQVcsQ0FBQyxTQUFTLENBQ25CLHlFQUF5RSxDQUMxRSxDQUFDO1lBQ0YsT0FBTztRQUNULENBQUMsQ0FBQyxDQUFDO1FBQ0wsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQ3JCLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDckQsV0FBVyxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3JELE9BQU87UUFDVCxDQUFDO1FBQ0QsTUFBTSxtQkFBbUIsR0FDdkIsT0FBTyxDQUFDLE9BQU8sR0FBRywyQ0FBMkMsQ0FBQztRQUNoRSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUN0QyxXQUFXLENBQUMsU0FBUyxDQUNuQixzRkFBc0YsQ0FDdkYsQ0FBQztZQUNGLE9BQU87UUFDVCxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUM7WUFDSCxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsZUFBZSxFQUFFLENBQUM7S0FDbkI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRGlzY29yZCBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YTogbmV3IERpc2NvcmQuU2xhc2hDb21tYW5kQnVpbGRlcigpXHJcbiAgICAuc2V0TmFtZShcIm1hcmtjbGFpbWVkXCIpXHJcbiAgICAuc2V0RGVzY3JpcHRpb24oXCJNYXJrIGEgcmV3YXJkIG1lc3NhZ2UgYXMgY2xhaW1lZFwiKVxyXG4gICAgLmFkZFN0cmluZ09wdGlvbigob3B0aW9uKSA9PlxyXG4gICAgICBvcHRpb25cclxuICAgICAgICAuc2V0TmFtZShcIm1lc3NhZ2VfaWRcIilcclxuICAgICAgICAuc2V0RGVzY3JpcHRpb24oXCJUaGUgSUQgb2YgdGhlIHJld2FyZCBtZXNzYWdlXCIpXHJcbiAgICAgICAgLnNldFJlcXVpcmVkKHRydWUpXHJcbiAgICApLFxyXG4gIHJ1bjogYXN5bmMgZnVuY3Rpb24gKGludGVyYWN0aW9uOiBEaXNjb3JkLkNoYXRJbnB1dENvbW1hbmRJbnRlcmFjdGlvbikge1xyXG4gICAgLy8gR2V0IG9wdGlvbnNcclxuICAgIGNvbnN0IG1lc3NhZ2VfaWQgPSBpbnRlcmFjdGlvbi5vcHRpb25zLmdldFN0cmluZyhcIm1lc3NhZ2VfaWRcIik7XHJcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgaW50ZXJhY3Rpb24uY2hhbm5lbC5tZXNzYWdlc1xyXG4gICAgICAuZmV0Y2gobWVzc2FnZV9pZClcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICBpbnRlcmFjdGlvbi5lZGl0UmVwbHkoXHJcbiAgICAgICAgICBcIk1lc3NhZ2Ugbm90IGZvdW5kISBNYWtlIHN1cmUgeW91J3JlIGluIHRoZSBzYW1lIGNoYW5uZWwgYXMgdGhlIG1lc3NhZ2UuXCJcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfSk7XHJcbiAgICBpZiAoIW1lc3NhZ2UpIHJldHVybjtcclxuICAgIGlmIChtZXNzYWdlLmF1dGhvci5pZCAhPT0gaW50ZXJhY3Rpb24uY2xpZW50LnVzZXIuaWQpIHtcclxuICAgICAgaW50ZXJhY3Rpb24uZWRpdFJlcGx5KFwiSSBjYW5ub3QgZWRpdCB0aGlzIG1lc3NhZ2UhXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdfbWVzc2FnZV9jb250ZW50ID1cclxuICAgICAgbWVzc2FnZS5jb250ZW50ICsgXCJcXG5cXG5BIG1vZGVyYXRvciBoYXMgY2xhaW1lZCB0aGlzIGZvciB5b3UuXCI7XHJcbiAgICBpZiAobmV3X21lc3NhZ2VfY29udGVudC5sZW5ndGggPiAyMDAwKSB7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcclxuICAgICAgICBcIkknbSBpbnRlcmVzdGVkIGluIHRoZSBmYWN0IHRoYXQgeW91IHRlc3QgZm9yIGVkZ2UgY2FzZXMgbGlrZSB0aGlzLiBOaWNlIHRyeSwgYnV0IG5vLlwiXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1lc3NhZ2UuZWRpdCh7XHJcbiAgICAgICAgY29udGVudDogbmV3X21lc3NhZ2VfY29udGVudCxcclxuICAgICAgICBjb21wb25lbnRzOiBbXSxcclxuICAgICAgfSk7XHJcbiAgICAgIGludGVyYWN0aW9uLmVkaXRSZXBseShcIkRvbmUhXCIpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb3B0aW9uczoge1xyXG4gICAgc2VydmVyX2Nvb2xkb3duOiAwLFxyXG4gIH0sXHJcbn07XHJcbiJdfQ==