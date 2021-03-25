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

export const CreateUserSchema = {
  type: "object",
  required: ["name", "password", "role"],
  properties: {
    name: {
      type: "string",
    },
    password: {
      type: "string",
    },
    role: {
      type: "string",
    }
  },
}