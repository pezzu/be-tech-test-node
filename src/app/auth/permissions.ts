import { IRecord } from "../../interfaces/record";
import { IUser } from "../../interfaces/user";

export function isAccessible(user: IUser, record: IRecord): boolean {
  return !user?.restrictions?.tables || user.restrictions.tables.includes(record.owner);
}
