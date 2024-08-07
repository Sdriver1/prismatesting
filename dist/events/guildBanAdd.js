import config from "../configs/config.json" with { type: "json" };
import { purge_member_currencies } from "../currency/operations/arithmetic.js";
export function guildBanAdd(ban) {
    if (ban.guild.id !== config.server.id)
        return;
    purge_member_currencies(ban.user.id);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGRCYW5BZGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL2d1aWxkQmFuQWRkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sTUFBTSxNQUFNLHdCQUF3QixDQUFDLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQy9FLE1BQU0sVUFBVSxXQUFXLENBQUMsR0FBcUI7SUFDL0MsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFBRSxPQUFPO0lBQzlDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIERpc2NvcmQgZnJvbSBcImRpc2NvcmQuanNcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlncy9jb25maWcuanNvblwiIGFzc2VydCB7IHR5cGU6IFwianNvblwiIH07XHJcbmltcG9ydCB7IHB1cmdlX21lbWJlcl9jdXJyZW5jaWVzIH0gZnJvbSBcIi4uL2N1cnJlbmN5L29wZXJhdGlvbnMvYXJpdGhtZXRpYy5qc1wiO1xyXG5leHBvcnQgZnVuY3Rpb24gZ3VpbGRCYW5BZGQoYmFuOiBEaXNjb3JkLkd1aWxkQmFuKSB7XHJcbiAgaWYgKGJhbi5ndWlsZC5pZCAhPT0gY29uZmlnLnNlcnZlci5pZCkgcmV0dXJuO1xyXG4gIHB1cmdlX21lbWJlcl9jdXJyZW5jaWVzKGJhbi51c2VyLmlkKTtcclxufVxyXG4iXX0=