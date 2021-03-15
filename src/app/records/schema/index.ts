export const RecordSchema = {
  type: "object",
  required: ['text'],
  properties: {
    text: {
      type: "string",
    },
    isEditable: {
      type: "boolean",
    },
  },
};
