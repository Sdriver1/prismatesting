import * as Discord from "discord.js";
import config from "../configs/config.json" with { type: "json" };
import { client } from "../startup/client.js";
const automod = {
    scanners: {
        contains_bad_words: (string) => {
            const bad_words = config.server.automod.bad_words;
            for (const word of bad_words) {
                if (string.includes(word)) {
                    return true;
                }
            }
            return false;
        },
        is_correct_count(old_number, new_number) {
            if (old_number + 1 === new_number)
                return false;
            return true;
        },
    },
    actions: {
        warn_user(user, reason, moderator_name, embed_color) {
            try {
                user.send({
                    embeds: [
                        embeds.offense_documentation_embed({
                            reason: `${reason}`,
                            mod_action: "Warning",
                            moderator_name: `${moderator_name}`,
                            user_name: `${user.username}`,
                            embed_color: `${embed_color}`,
                            include_mod_action_threat: true,
                        }),
                    ],
                });
            }
            catch { }
        },
        log_offense(user, mod_action, reason, moderator_name, embed_color) {
            const log_channel = client.channels.cache.get(config.server.channels.modlogs);
            if (!log_channel || !log_channel.isTextBased())
                throw new Error("Automod log channel is configured improperly -- must be a text channel that the bot has permissions to view.");
            try {
                log_channel.send({
                    embeds: [
                        embeds.offense_documentation_embed({
                            reason: `${reason}`,
                            mod_action: `${mod_action}`,
                            moderator_name: `${moderator_name}`,
                            user_name: `${user.username}`,
                            embed_color: `${embed_color}`,
                            include_mod_action_threat: false,
                        }),
                    ],
                });
            }
            catch {
                throw new Error("The bot cannot type in the automod log channel.");
            }
        },
    },
};
const embeds = {
    offense_documentation_embed({ reason, mod_action, user_name, moderator_name, embed_color, include_mod_action_threat, }) {
        let embed_description = "▸ Reason: " + reason + "\n";
        embed_description += "▸ Moderator: " + moderator_name + "\n";
        if (include_mod_action_threat)
            embed_description +=
                "▸ This warning has been documented and recorded. If you fail to correct your behavior, increasingly severe mod action will be taken on you.";
        let warning_embed = new Discord.EmbedBuilder()
            .setTitle(`${mod_action} documentation for ${user_name}`)
            .setDescription(embed_description)
            .setColor(embed_color);
        return warning_embed;
    },
};
export { automod };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b21vZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2F1dG9tb2QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxNQUFNLE1BQU0sd0JBQXdCLENBQUMsU0FBUyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDcEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRTlDLE1BQU0sT0FBTyxHQUFHO0lBQ2QsUUFBUSxFQUFFO1FBQ1Isa0JBQWtCLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtZQUNyQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEQsS0FBSyxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQzFCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7WUFDSCxDQUFDO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBQ0QsZ0JBQWdCLENBQUMsVUFBa0IsRUFBRSxVQUFrQjtZQUNyRCxJQUFJLFVBQVUsR0FBRyxDQUFDLEtBQUssVUFBVTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUNoRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FDRjtJQUNELE9BQU8sRUFBRTtRQUNQLFNBQVMsQ0FDUCxJQUFrQixFQUNsQixNQUFjLEVBQ2QsY0FBc0IsRUFDdEIsV0FBbUM7WUFFbkMsSUFBSSxDQUFDO2dCQUNILElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ1IsTUFBTSxFQUFFO3dCQUNOLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQzs0QkFDakMsTUFBTSxFQUFFLEdBQUcsTUFBTSxFQUFFOzRCQUNuQixVQUFVLEVBQUUsU0FBUzs0QkFDckIsY0FBYyxFQUFFLEdBQUcsY0FBYyxFQUFFOzRCQUNuQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUM3QixXQUFXLEVBQUUsR0FBRyxXQUFXLEVBQUU7NEJBQzdCLHlCQUF5QixFQUFFLElBQUk7eUJBQ2hDLENBQUM7cUJBQ0g7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7UUFDWixDQUFDO1FBQ0QsV0FBVyxDQUNULElBQWtCLEVBQ2xCLFVBQWtCLEVBQ2xCLE1BQWMsRUFDZCxjQUFzQixFQUN0QixXQUFtQztZQUVuQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FDL0IsQ0FBQztZQUNGLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFO2dCQUM1QyxNQUFNLElBQUksS0FBSyxDQUNiLDhHQUE4RyxDQUMvRyxDQUFDO1lBQ0osSUFBSSxDQUFDO2dCQUNILFdBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQ2YsTUFBTSxFQUFFO3dCQUNOLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQzs0QkFDakMsTUFBTSxFQUFFLEdBQUcsTUFBTSxFQUFFOzRCQUNuQixVQUFVLEVBQUUsR0FBRyxVQUFVLEVBQUU7NEJBQzNCLGNBQWMsRUFBRSxHQUFHLGNBQWMsRUFBRTs0QkFDbkMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDN0IsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFFOzRCQUM3Qix5QkFBeUIsRUFBRSxLQUFLO3lCQUNqQyxDQUFDO3FCQUNIO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxNQUFNLENBQUM7Z0JBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBQ3JFLENBQUM7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBQ0YsTUFBTSxNQUFNLEdBQUc7SUFDYiwyQkFBMkIsQ0FBQyxFQUMxQixNQUFNLEVBQ04sVUFBVSxFQUNWLFNBQVMsRUFDVCxjQUFjLEVBQ2QsV0FBVyxFQUNYLHlCQUF5QixHQVExQjtRQUNDLElBQUksaUJBQWlCLEdBQUcsWUFBWSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDckQsaUJBQWlCLElBQUksZUFBZSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDN0QsSUFBSSx5QkFBeUI7WUFDM0IsaUJBQWlCO2dCQUNmLDZJQUE2SSxDQUFDO1FBQ2xKLElBQUksYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTthQUMzQyxRQUFRLENBQUMsR0FBRyxVQUFVLHNCQUFzQixTQUFTLEVBQUUsQ0FBQzthQUN4RCxjQUFjLENBQUMsaUJBQWlCLENBQUM7YUFDakMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRixDQUFDO0FBQ0YsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgRGlzY29yZCBmcm9tIFwiZGlzY29yZC5qc1wiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdzL2NvbmZpZy5qc29uXCIgYXNzZXJ0IHsgdHlwZTogXCJqc29uXCIgfTtcclxuaW1wb3J0IHsgY2xpZW50IH0gZnJvbSBcIi4uL3N0YXJ0dXAvY2xpZW50LmpzXCI7XHJcblxyXG5jb25zdCBhdXRvbW9kID0ge1xyXG4gIHNjYW5uZXJzOiB7XHJcbiAgICBjb250YWluc19iYWRfd29yZHM6IChzdHJpbmc6IHN0cmluZykgPT4ge1xyXG4gICAgICBjb25zdCBiYWRfd29yZHMgPSBjb25maWcuc2VydmVyLmF1dG9tb2QuYmFkX3dvcmRzO1xyXG4gICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgYmFkX3dvcmRzKSB7XHJcbiAgICAgICAgaWYgKHN0cmluZy5pbmNsdWRlcyh3b3JkKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBpc19jb3JyZWN0X2NvdW50KG9sZF9udW1iZXI6IG51bWJlciwgbmV3X251bWJlcjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmIChvbGRfbnVtYmVyICsgMSA9PT0gbmV3X251bWJlcikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBhY3Rpb25zOiB7XHJcbiAgICB3YXJuX3VzZXIoXHJcbiAgICAgIHVzZXI6IERpc2NvcmQuVXNlcixcclxuICAgICAgcmVhc29uOiBzdHJpbmcsXHJcbiAgICAgIG1vZGVyYXRvcl9uYW1lOiBzdHJpbmcsXHJcbiAgICAgIGVtYmVkX2NvbG9yOiBEaXNjb3JkLkhleENvbG9yU3RyaW5nXHJcbiAgICApIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICB1c2VyLnNlbmQoe1xyXG4gICAgICAgICAgZW1iZWRzOiBbXHJcbiAgICAgICAgICAgIGVtYmVkcy5vZmZlbnNlX2RvY3VtZW50YXRpb25fZW1iZWQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogYCR7cmVhc29ufWAsXHJcbiAgICAgICAgICAgICAgbW9kX2FjdGlvbjogXCJXYXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgbW9kZXJhdG9yX25hbWU6IGAke21vZGVyYXRvcl9uYW1lfWAsXHJcbiAgICAgICAgICAgICAgdXNlcl9uYW1lOiBgJHt1c2VyLnVzZXJuYW1lfWAsXHJcbiAgICAgICAgICAgICAgZW1iZWRfY29sb3I6IGAke2VtYmVkX2NvbG9yfWAsXHJcbiAgICAgICAgICAgICAgaW5jbHVkZV9tb2RfYWN0aW9uX3RocmVhdDogdHJ1ZSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIHt9XHJcbiAgICB9LFxyXG4gICAgbG9nX29mZmVuc2UoXHJcbiAgICAgIHVzZXI6IERpc2NvcmQuVXNlcixcclxuICAgICAgbW9kX2FjdGlvbjogc3RyaW5nLFxyXG4gICAgICByZWFzb246IHN0cmluZyxcclxuICAgICAgbW9kZXJhdG9yX25hbWU6IHN0cmluZyxcclxuICAgICAgZW1iZWRfY29sb3I6IERpc2NvcmQuSGV4Q29sb3JTdHJpbmdcclxuICAgICkge1xyXG4gICAgICBjb25zdCBsb2dfY2hhbm5lbCA9IGNsaWVudC5jaGFubmVscy5jYWNoZS5nZXQoXHJcbiAgICAgICAgY29uZmlnLnNlcnZlci5jaGFubmVscy5tb2Rsb2dzXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICghbG9nX2NoYW5uZWwgfHwgIWxvZ19jaGFubmVsLmlzVGV4dEJhc2VkKCkpXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgXCJBdXRvbW9kIGxvZyBjaGFubmVsIGlzIGNvbmZpZ3VyZWQgaW1wcm9wZXJseSAtLSBtdXN0IGJlIGEgdGV4dCBjaGFubmVsIHRoYXQgdGhlIGJvdCBoYXMgcGVybWlzc2lvbnMgdG8gdmlldy5cIlxyXG4gICAgICAgICk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbG9nX2NoYW5uZWwuc2VuZCh7XHJcbiAgICAgICAgICBlbWJlZHM6IFtcclxuICAgICAgICAgICAgZW1iZWRzLm9mZmVuc2VfZG9jdW1lbnRhdGlvbl9lbWJlZCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBgJHtyZWFzb259YCxcclxuICAgICAgICAgICAgICBtb2RfYWN0aW9uOiBgJHttb2RfYWN0aW9ufWAsXHJcbiAgICAgICAgICAgICAgbW9kZXJhdG9yX25hbWU6IGAke21vZGVyYXRvcl9uYW1lfWAsXHJcbiAgICAgICAgICAgICAgdXNlcl9uYW1lOiBgJHt1c2VyLnVzZXJuYW1lfWAsXHJcbiAgICAgICAgICAgICAgZW1iZWRfY29sb3I6IGAke2VtYmVkX2NvbG9yfWAsXHJcbiAgICAgICAgICAgICAgaW5jbHVkZV9tb2RfYWN0aW9uX3RocmVhdDogZmFsc2UsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGJvdCBjYW5ub3QgdHlwZSBpbiB0aGUgYXV0b21vZCBsb2cgY2hhbm5lbC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuY29uc3QgZW1iZWRzID0ge1xyXG4gIG9mZmVuc2VfZG9jdW1lbnRhdGlvbl9lbWJlZCh7XHJcbiAgICByZWFzb24sXHJcbiAgICBtb2RfYWN0aW9uLFxyXG4gICAgdXNlcl9uYW1lLFxyXG4gICAgbW9kZXJhdG9yX25hbWUsXHJcbiAgICBlbWJlZF9jb2xvcixcclxuICAgIGluY2x1ZGVfbW9kX2FjdGlvbl90aHJlYXQsXHJcbiAgfToge1xyXG4gICAgcmVhc29uOiBzdHJpbmc7XHJcbiAgICBtb2RfYWN0aW9uOiBzdHJpbmc7XHJcbiAgICB1c2VyX25hbWU6IHN0cmluZztcclxuICAgIG1vZGVyYXRvcl9uYW1lOiBzdHJpbmc7XHJcbiAgICBlbWJlZF9jb2xvcjogRGlzY29yZC5IZXhDb2xvclN0cmluZztcclxuICAgIGluY2x1ZGVfbW9kX2FjdGlvbl90aHJlYXQ6IGJvb2xlYW47XHJcbiAgfSk6IERpc2NvcmQuRW1iZWRCdWlsZGVyIHtcclxuICAgIGxldCBlbWJlZF9kZXNjcmlwdGlvbiA9IFwi4pa4IFJlYXNvbjogXCIgKyByZWFzb24gKyBcIlxcblwiO1xyXG4gICAgZW1iZWRfZGVzY3JpcHRpb24gKz0gXCLilrggTW9kZXJhdG9yOiBcIiArIG1vZGVyYXRvcl9uYW1lICsgXCJcXG5cIjtcclxuICAgIGlmIChpbmNsdWRlX21vZF9hY3Rpb25fdGhyZWF0KVxyXG4gICAgICBlbWJlZF9kZXNjcmlwdGlvbiArPVxyXG4gICAgICAgIFwi4pa4IFRoaXMgd2FybmluZyBoYXMgYmVlbiBkb2N1bWVudGVkIGFuZCByZWNvcmRlZC4gSWYgeW91IGZhaWwgdG8gY29ycmVjdCB5b3VyIGJlaGF2aW9yLCBpbmNyZWFzaW5nbHkgc2V2ZXJlIG1vZCBhY3Rpb24gd2lsbCBiZSB0YWtlbiBvbiB5b3UuXCI7XHJcbiAgICBsZXQgd2FybmluZ19lbWJlZCA9IG5ldyBEaXNjb3JkLkVtYmVkQnVpbGRlcigpXHJcbiAgICAgIC5zZXRUaXRsZShgJHttb2RfYWN0aW9ufSBkb2N1bWVudGF0aW9uIGZvciAke3VzZXJfbmFtZX1gKVxyXG4gICAgICAuc2V0RGVzY3JpcHRpb24oZW1iZWRfZGVzY3JpcHRpb24pXHJcbiAgICAgIC5zZXRDb2xvcihlbWJlZF9jb2xvcik7XHJcbiAgICByZXR1cm4gd2FybmluZ19lbWJlZDtcclxuICB9LFxyXG59O1xyXG5leHBvcnQgeyBhdXRvbW9kIH07XHJcbiJdfQ==