import { Schema, model, Document, Model } from "mongoose";
import { IRole } from "../../../interfaces/role";

export interface IRoleModel extends IRole, Document {}

const RestrictionSchema: Schema = new Schema({
  field: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: {},
    required: true,
  }
})

const RoleSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  tables: {
    type: [String],
    required: true,
  },
  operations: {
    type: [String],
    required: true,
  },
  editFields: {
    type: [String],
    default: [],
  },
  editRestrictions: {
    type: [RestrictionSchema],
    default: [],
  }
});

export const Role: Model<IRoleModel> = model<IRoleModel>(
  "roles",
  RoleSchema
);
