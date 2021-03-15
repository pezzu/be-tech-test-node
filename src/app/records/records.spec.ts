import mongoose from "mongoose";
import { response } from "express";
import request from "supertest";
import app from "../../app";
import { Record } from "./model";

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

beforeAll(async (done) => {
  await mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    done
  );
});

afterAll(async (done) => {
  mongoose.disconnect(done);
});

beforeEach(async (done) => {
  try {
    await Record.insertMany(mockRecords);
    done();
  } catch (err) {
    done(err);
  }
});

afterEach(async (done) => {
  try {
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
