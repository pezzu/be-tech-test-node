import { Schema, model } from "mongoose";

const RecordSchema = new Schema({
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
  }
});

const Record = model("records", RecordSchema);

export default Record;
