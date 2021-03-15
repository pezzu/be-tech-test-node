import { IRecord } from "../../interfaces/record";
import { IUser, IUserExpanded } from "../../interfaces/user";
import { IRole, Method } from "../../interfaces/role";
import { Role } from "./model/role";

export function isRecordAccessible(
  user: IUserExpanded,
  record: IRecord
): boolean {
  return user.role.tables.includes(record.owner);
}

export function isOperationAllowed(
  user: IUserExpanded,
  method: Method
): boolean {
  return user.role.operations.includes(method);
}

export function isRecordEditable(
  user: IUserExpanded,
  record: IRecord,
  update: object,
): boolean {
  for(let field in update) {
    if(!user.role.editFields.includes(field)) {
      return false;
    }
  }
  for(let restriction of user.role.editRestrictions) {
    if(record[restriction.field] !== restriction.condition) {
      return false;
    }
  }
  return true;
}
