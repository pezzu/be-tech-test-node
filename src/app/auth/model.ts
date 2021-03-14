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
  },
  tester: {
    name: "tester",
    password: "123",
    role: "Tester",
  },
};

export default class User {
  public static findOne(name: string): any {
    return users[name];
  }
}
