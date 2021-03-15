import { Schema, model, Document, Model } from "mongoose";
import { IRecord } from "../../interfaces/record";

export interface IRecordModel extends IRecord, Document {}

const RecordSchema: Schema = new Schema({
  owner: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
});

export const Record: Model<IRecordModel> = model<IRecordModel>(
  "records",
  RecordSchema
);
