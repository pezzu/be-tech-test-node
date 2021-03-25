import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { User } from "../../src/app/auth/model/user";
import { options } from "../../src/services/mongodb";

import db from "./db.json";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, options);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async (done) => {
  try {
    await User.insertMany(db.users);
    done();
  } catch (err) {
    done(err);
  }
});

afterEach(async (done) => {
  try {
    await User.deleteMany({});
    done();
  } catch (err) {
    done(err);
  }
});

describe("POST /api/auth", () => {
  it("Returns token for authenticated user", (done) => {
    return request(app)
      .post("/api/auth")
      .send({ name: "admin", password: "admin" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.token).toBeTruthy();
        done();
      })
      .catch((err) => done(err));
  });

  it("Returns error for invalid password", (done) => {
    return request(app)
      .post("/api/auth")
      .send({ name: "admin", password: "somepassword" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .then((response) => {
        expect(response.body.token).toBeUndefined();
        done();
      })
      .catch((err) => done(err));
  });
});

describe("POST /api/auth/signup", () => {
  it("Creates new user", async (done) => {
    try {
      const agent = request(app);
      const response = await agent
        .post("/api/auth/signup")
        .set("Accept", "application/json")
        .send({ name: "new.user", password: "user.password", role: "user.role" });

      expect(response.status).toBe(200);

      const dbUser = await User.findOne({ name: "new.user" }).exec();
      expect(dbUser).not.toBeNull();
      expect(dbUser.name).toBe("new.user");
      expect(dbUser.password).toBe("user.password");
      expect(dbUser.role).toBe("user.role");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Returns token after user is created", async (done) => {
    try {
      const agent = request(app);
      const response = await agent
        .post("/api/auth/signup")
        .set("Accept", "application/json")
        .send({ name: "new.user", password: "user.password", role: "user.role" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Returns error 400 if name param is missing", async (done) => {
    try {
      const agent = request(app);
      const response = await agent
        .post("/api/auth/signup")
        .set("Accept", "application/json")
        .send({ password: "user.password", role: "user.role" });

      expect(response.status).toBe(400);
      expect(response.body.token).toBeUndefined();

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Returns error 400 if password param is missing", async (done) => {
    try {
      const agent = request(app);
      const response = await agent
        .post("/api/auth/signup")
        .set("Accept", "application/json")
        .send({ name: "new.user", role: "user.role" });

      expect(response.status).toBe(400);
      expect(response.body.token).toBeUndefined();

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Returns error 400 if role param is missing", async (done) => {
    try {
      const agent = request(app);
      const response = await agent
        .post("/api/auth/signup")
        .set("Accept", "application/json")
        .send({ name: "new.user", password: "user.password" });

      expect(response.status).toBe(400);
      expect(response.body.token).toBeUndefined();

      done();
    } catch (err) {
      done(err);
    }
  });
});
