const users = {
  admin: {
    name: "admin",
    password: "admin",
    role: "Admin",
  },
  editor: {
    name: "editor",
    password: "verysecretpassword",
    role: "Editor",
    restrictions: {
      tables: ["Editor", "Tester"],
    },
  },
  tester: {
    name: "tester",
    password: "123",
    role: "Tester",
    restrictions: {
      tables: ["Tester"],
    },
  },
};

export class User {
  public static findOne(name: string): any {
    return users[name];
  }
}
