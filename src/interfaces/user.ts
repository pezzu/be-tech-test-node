import { IRestrictions } from "./restrictions";

export interface IUser {
  name: string;
  password: string;
  role: string;
  restrictions?: IRestrictions;
}