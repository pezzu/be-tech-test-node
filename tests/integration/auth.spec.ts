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
    await User.remove({}).exec();
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
