import mongoose from "mongoose";
import { response } from "express";
import request from "supertest";
import app from "../../app";
import { Record } from "./model";
import { Role } from "../auth/model/role";
import { User } from "../auth/model/user";
import httpStatus from "http-status";

const mockUsers = [
  {
    name: "admin",
    password: "admin",
    role: "Admin",
  },
  {
    name: "editor",
    password: "verysecretpassword",
    role: "Editor",
  },
  {
    name: "tester",
    password: "123",
    role: "Tester",
  },
];

const mockRoles = [
  {
    name: "Admin",
    tables: ["Admin", "Editor", "Tester"],
    operations: ["CREATE", "READ", "UPDATE", "DELETE"],
    editFields: ["text", "isEditable"],
    editRestrictions: [],
  },
  {
    name: "Editor",
    tables: ["Editor", "Tester"],
    operations: ["CREATE", "READ", "UPDATE"],
    editFields: ["text"],
    editRestrictions: [
      {
        field: "isEditable",
        condition: true,
      },
    ],
  },
  {
    name: "Tester",
    tables: ["Tester"],
    operations: ["CREATE", "READ"],
    editFields: [],
    editRestrictions: [],
  },
];

const mockRecords = [
  {
    _id: "604d9ad299a6ff3554405c2c",
    text: "record number 1",
    isEditable: false,
    owner: "Admin",
  },
  {
    _id: "604d9adf99a6ff3554405c2e",
    text: "record number 2",
    isEditable: true,
    owner: "Editor",
  },
  {
    _id: "604da5e45ff955477cdde343",
    text: "record number 3",
    isEditable: true,
    owner: "Tester",
  },
  {
    _id: "604da69f18a9cf23ec184048",
    text: "record number 4",
    isEditable: true,
    owner: "Admin",
  },
  {
    _id: "604da6a018a9cf23ec184049",
    text: "record number 5",
    isEditable: true,
    owner: "Editor",
  },
  {
    _id: "604da6a918a9cf23ec18404a",
    text: "record number 6",
    isEditable: true,
    owner: "Tester",
  },
  {
    _id: "604e59a90ae3ba2b5c4142f4",
    text: "record number 7",
    isEditable: false,
    owner: "Admin",
  },
];

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async (done) => {
  try {
    await User.insertMany(mockUsers);
    await Role.insertMany(mockRoles);
    await Record.insertMany(mockRecords);
    done();
  } catch (err) {
    done(err);
  }
});

afterEach(async (done) => {
  try {
    await User.remove({}).exec();
    await Role.remove({}).exec();
    await Record.remove({}).exec();
    done();
  } catch (err) {
    done(err);
  }
});

describe("/GET /api/record", () => {
  it("Unauthenticated user cannot read a list of records", (done) => {
    return request(app)
      .get("/api/record")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .then((response) => {
        done();
      })
      .catch((err) => done(err));
  });

  it("Admin user has access to all records", async (done) => {
    try {
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name: "admin", password: "admin" });

      const response = await agent
        .get("/api/record")
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
      expect(response.body).toEqual(mockRecords);

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Editor user has access to Editor and Tester records", async (done) => {
    try {
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name: "editor", password: "verysecretpassword" });

      const response = await agent
        .get("/api/record")
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
      expect(response.body).toEqual(
        mockRecords.filter((rec) => ["Editor", "Tester"].includes(rec.owner))
      );

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Tester user has access to Tester records", async (done) => {
    try {
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name: "tester", password: "123" });

      const response = await agent
        .get("/api/record")
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
      expect(response.body).toEqual(
        mockRecords.filter((rec) => rec.owner === "Tester")
      );

      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("/GET /api/record/:id", () => {
  it("Unauthenticated user cannot read one record", async (done) => {
    try {
      const agent = request(app);
      const response = await agent
        .get("/api/record/604da6a918a9cf23ec18404a")
        .set("Accept", "application/json");

      expect(response.status).toBe(401);
      done();
    } catch (err) {
      done(err);
    }
  });

  const testCanReadOne = async (
    name: string,
    id: string,
    done
  ): Promise<void> => {
    try {
      const user = mockUsers.find((user) => user.name === name);
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name, password: user.password });

      const response = await agent
        .get(`/api/record/${id}`)
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(
        mockRecords.find((rec) => rec._id === id)
      );
      done();
    } catch (err) {
      done(err);
    }
  };

  const testCannotReadOne = async (
    name: string,
    id: string,
    done
  ): Promise<void> => {
    try {
      const user = mockUsers.find((user) => user.name === name);
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name, password: user.password });

      const response = await agent
        .get(`/api/record/${id}`)
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(401);
      done();
    } catch (err) {
      done(err);
    }
  };

  it("Tester user can read Tester record", async (done) => {
    const recId = "604da6a918a9cf23ec18404a";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Tester");
    await testCanReadOne("tester", recId, done);
  });

  it("Tester user cannot read Editor record", async (done) => {
    const recId = "604da6a018a9cf23ec184049";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Editor");
    await testCannotReadOne("tester", recId, done);
  });

  it("Tester user cannot read Admin record", async (done) => {
    const recId = "604e59a90ae3ba2b5c4142f4";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Admin");
    await testCannotReadOne("tester", recId, done);
  });

  it("Editor user can read Tester record", async (done) => {
    const recId = "604da6a918a9cf23ec18404a";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Tester");
    await testCanReadOne("editor", recId, done);
  });

  it("Editor user can read Editor record", async (done) => {
    const recId = "604da6a018a9cf23ec184049";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Editor");
    await testCanReadOne("editor", recId, done);
  });

  it("Editor user cannot read Admin record", async (done) => {
    const recId = "604e59a90ae3ba2b5c4142f4";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Admin");
    await testCannotReadOne("editor", recId, done);
  });

  it("Admin user can read Tester record", async (done) => {
    const recId = "604da6a918a9cf23ec18404a";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Tester");
    await testCanReadOne("admin", recId, done);
  });

  it("Admin user can read Editor record", async (done) => {
    const recId = "604da6a018a9cf23ec184049";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Editor");
    await testCanReadOne("admin", recId, done);
  });

  it("Admin user can read Admin record", async (done) => {
    const recId = "604e59a90ae3ba2b5c4142f4";
    expect(mockRecords.find((rec) => rec._id === recId).owner).toBe("Admin");
    await testCanReadOne("admin", recId, done);
  });
});

describe("/POST /api/record/", () => {
  it("Admin user can create a record", async (done) => {
    try {
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name: "admin", password: "admin" });

      const record = { text: "Newly created record", isEditable: true };

      const response = await agent
        .post("/api/record")
        .send(record)
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ ...record, owner: "Admin" });

      const dbRecord = await Record.findById(response.body._id).exec();
      expect(dbRecord).toMatchObject({ ...record, owner: "Admin" });

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Editor user can create a record", async (done) => {
    try {
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name: "editor", password: "verysecretpassword" });

      const record = { text: "Newly created record", isEditable: true };

      const response = await agent
        .post("/api/record")
        .send(record)
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ ...record, owner: "Editor" });

      const dbRecord = await Record.findById(response.body._id).exec();
      expect(dbRecord).toMatchObject({ ...record, owner: "Editor" });

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Tester user can create a record", async (done) => {
    try {
      const agent = request(app);
      const authResponse = await agent
        .post("/api/auth")
        .send({ name: "tester", password: "123" });

      const record = { text: "Newly created record", isEditable: true };

      const response = await agent
        .post("/api/record")
        .send(record)
        .set("Accept", "application/json")
        .set("x-access-token", authResponse.body.token);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ ...record, owner: "Tester" });

      const dbRecord = await Record.findById(response.body._id).exec();
      expect(dbRecord).toMatchObject({ ...record, owner: "Tester" });

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Unauthenticated user can't create a record", async (done) => {
    try {
      const agent = request(app);
      const record = { text: "Newly created record", isEditable: true };

      const response = await agent
        .post("/api/record")
        .send(record)
        .set("Accept", "application/json");

      expect(response.status).toBe(401);
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("/PUT /api/record/", () => {
  const testCanUpdate = async (name: string, id: string, update: object) => {
    const user = mockUsers.find((user) => user.name === name);
    const agent = request(app);
    const authResponse = await agent
      .post("/api/auth")
      .send({ name, password: user.password });

    const record = mockRecords.find((rec) => rec._id === id);
    const response = await agent
      .put(`/api/record/${id}`)
      .send(update)
      .set("Accept", "application/json")
      .set("x-access-token", authResponse.body.token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(update);
  };

  const testCannotUpdate = async (name: string, id: string, update: object) => {
    const user = mockUsers.find((user) => user.name === name);
    const agent = request(app);
    const authResponse = await agent
      .post("/api/auth")
      .send({ name, password: user?.password || "fake" });

    const record = mockRecords.find((rec) => rec._id === id);
    const response = await agent
      .put(`/api/record/${id}`)
      .send(update)
      .set("Accept", "application/json")
      .set("x-access-token", authResponse?.body?.token || "fake");

    expect(response.status).toBe(401);
  };

  it("Unauthenticated user cannot update any record", async (done) => {
    await Promise.all(
      mockRecords.map(async (rec) =>
        testCannotUpdate("guest", rec._id, { text: "New text" })
      )
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Tester user cannot update any record", async (done) => {
    const texts = mockRecords.map(async (rec) =>
      testCannotUpdate("tester", rec._id, { text: "New text" })
    );

    const fields = mockRecords.map(async (rec) =>
      testCannotUpdate("tester", rec._id, { text: rec.text, isEditable: !rec.isEditable })
    );

    await Promise.all([...fields, ...texts])
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Editor user can update Tester and Editor records [text] field when isEditable is true", async (done) => {
    const editorRecords = mockRecords.filter(
      (rec) => rec.owner === "Editor" || rec.owner === "Tester"
    );

    await Promise.all(
      editorRecords
        .filter((rec) => rec.isEditable)
        .map(async (rec) =>
          testCanUpdate("editor", rec._id, { text: "New text" })
        )
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Editor user cannot update Tester and Editor records [isEditable] field", async (done) => {
    await Promise.all(
      mockRecords.map(async (rec) =>
        testCannotUpdate(
          "editor",
          rec._id,
          { text: rec.text, isEditable: !rec.isEditable }
        )
      )
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Editor user cannot update Tester and Editor records when isEditable is false", async (done) => {
    const editorRecords = mockRecords.filter(
      (rec) => rec.owner === "Editor" || rec.owner === "Tester"
    );

    await Promise.all(
      editorRecords
        .filter((rec) => !rec.isEditable)
        .map(async (rec) =>
          testCannotUpdate("editor", rec._id, { text: "New text" })
        )
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Editor user cannot update Admin a record", async (done) => {
    const adminRecords = mockRecords.filter((rec) => rec.owner === "Admin");

    await Promise.all(
      adminRecords.map(async (rec) =>
        testCannotUpdate("editor", rec._id, { text: "New text" })
      )
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Admin user can update any record", async (done) => {
    const texts = mockRecords.map(async (rec) =>
      testCanUpdate("admin", rec._id, { text: "New text" })
    );

    const fields = mockRecords.map(async (rec) =>
      testCanUpdate("admin", rec._id, { text: rec.text, isEditable: !rec.isEditable })
    );

    await Promise.all([...texts, ...fields])
      .then(() => done())
      .catch((err) => done(err));
  });
});

describe("/DELETE /api/record/", () => {
  const testCanDelete = async (name: string, id: string) => {
    const user = mockUsers.find((user) => user.name === name);
    const agent = request(app);
    const authResponse = await agent
      .post("/api/auth")
      .send({ name, password: user.password });

    const response = await agent
      .delete(`/api/record/${id}`)
      .set("Accept", "application/json")
      .set("x-access-token", authResponse.body.token);

    expect(response.status).toBe(200);

    const dbRecord = await Record.findById(id).exec();
    expect(dbRecord).toBeNull();
  };

  const testCannotDelete = async (name: string, id: string) => {
    const user = mockUsers.find((user) => user.name === name);
    const agent = request(app);
    const authResponse = await agent
      .post("/api/auth")
      .send({ name, password: user?.password || "fake" });

    const response = await agent
      .delete(`/api/record/${id}`)
      .set("Accept", "application/json")
      .set("x-access-token", authResponse?.body?.token || "");

    expect(response.status).toBe(401);
    const dbRecord = await Record.findById(id).exec();
    expect(dbRecord).not.toBeNull();
  };

  it("Unauthenticated user cannot delete a record", async (done) => {
    await Promise.all(
      mockRecords.map(async (rec) => await testCannotDelete("guest", rec._id))
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Tester user cannot delete a record", async (done) => {
    await Promise.all(
      mockRecords.map(async (rec) => await testCannotDelete("tester", rec._id))
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Editor user cannot delete a record", async (done) => {
    await Promise.all(
      mockRecords.map(async (rec) => await testCannotDelete("editor", rec._id))
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Admin user can delete any record", async (done) => {
    await Promise.all(
      mockRecords.map(async (rec) => await testCanDelete("admin", rec._id))
    )
      .then(() => done())
      .catch((err) => done(err));
  });
});
