import { Schema, model } from "mongoose";

const RecordSchema = new Schema({
  owner: String,
  text: String,
  isEditable: Boolean,
});

const Record = model("records", RecordSchema);

export default Record;
