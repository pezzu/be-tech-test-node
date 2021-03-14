import request from "supertest";
import app from "../../app";

describe("POST /api/auth", () => {
  it("Returns token for authenticated user", (done) => {
    return request(app)
      .post("/api/auth")
      .send({ name: "admin", password: "admin" })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.token).toBeTruthy();
        done();
      })
      .catch(err => done(err))
  });

  it("Returns error for invalid password", (done) => {
    return request(app)
      .post("/api/auth")
      .send({ name: "admin", password: "somepassword" })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(response => {
        expect(response.body.token).toBeUndefined();
        done();
      })
      .catch(err => done(err))
  })
});
