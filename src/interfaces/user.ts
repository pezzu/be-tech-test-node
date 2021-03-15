import { IRole } from "./role";

export interface IUser {
  name: string;
  password: string;
  role: string;
}

export interface IUserExpanded {
  name: string;
  password: string;
  role: IRole;
}
