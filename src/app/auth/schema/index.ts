export const AuthSchema = {
  type: "object",
  required: ["name", "password"],
  properties: {
    name: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
};