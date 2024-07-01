import config from "../configs/config.json" with { type: "json" };
import { purge_member_currencies } from "../currency/operations/arithmetic.js";
export function guildMemberRemove(member) {
    if (member.guild.id !== config.server.id)
        return;
    purge_member_currencies(member.id);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGRNZW1iZXJSZW1vdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2d1aWxkTWVtYmVyUmVtb3ZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sTUFBTSxNQUFNLHdCQUF3QixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxNQUEyQjtJQUMzRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUFFLE9BQU87SUFDakQsdUJBQXVCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBEaXNjb3JkIGZyb20gXCJkaXNjb3JkLmpzXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ3MvY29uZmlnLmpzb25cIiBhc3NlcnQgeyB0eXBlOiBcImpzb25cIiB9O1xyXG5pbXBvcnQgeyBwdXJnZV9tZW1iZXJfY3VycmVuY2llcyB9IGZyb20gXCIuLi9jdXJyZW5jeS9vcGVyYXRpb25zL2FyaXRobWV0aWMuanNcIjtcclxuZXhwb3J0IGZ1bmN0aW9uIGd1aWxkTWVtYmVyUmVtb3ZlKG1lbWJlcjogRGlzY29yZC5HdWlsZE1lbWJlcikge1xyXG4gIGlmIChtZW1iZXIuZ3VpbGQuaWQgIT09IGNvbmZpZy5zZXJ2ZXIuaWQpIHJldHVybjtcclxuICBwdXJnZV9tZW1iZXJfY3VycmVuY2llcyhtZW1iZXIuaWQpO1xyXG59XHJcbiJdfQ==