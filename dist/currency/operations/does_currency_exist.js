import SQL from "sql-template-strings";
import { db } from "../../startup/db.js";
export async function does_currency_exist(currency_id) {
    try {
        const result = await db.get(SQL `SELECT * FROM currency_config WHERE currency_id = ${currency_id}`);
        if (result)
            return true;
        return false;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9lc19jdXJyZW5jeV9leGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jdXJyZW5jeS9vcGVyYXRpb25zL2RvZXNfY3VycmVuY3lfZXhpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sc0JBQXNCLENBQUM7QUFDdkMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXpDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsbUJBQW1CLENBQ3ZDLFdBQW1CO0lBRW5CLElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FDekIsR0FBRyxDQUFBLHFEQUFxRCxXQUFXLEVBQUUsQ0FDdEUsQ0FBQztRQUNGLElBQUksTUFBTTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3hCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTUUwgZnJvbSBcInNxbC10ZW1wbGF0ZS1zdHJpbmdzXCI7XHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uLy4uL3N0YXJ0dXAvZGIuanNcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2VzX2N1cnJlbmN5X2V4aXN0KFxyXG4gIGN1cnJlbmN5X2lkOiBzdHJpbmdcclxuKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRiLmdldChcclxuICAgICAgU1FMYFNFTEVDVCAqIEZST00gY3VycmVuY3lfY29uZmlnIFdIRVJFIGN1cnJlbmN5X2lkID0gJHtjdXJyZW5jeV9pZH1gXHJcbiAgICApO1xyXG4gICAgaWYgKHJlc3VsdCkgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiJdfQ==