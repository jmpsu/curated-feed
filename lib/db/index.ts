import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../db/schema";

export type Database = ReturnType<typeof drizzle>;

export function getDb(env: Env): Database {
  return drizzle(env.DB, { schema });
}

export { schema };
export * from "drizzle-orm";
