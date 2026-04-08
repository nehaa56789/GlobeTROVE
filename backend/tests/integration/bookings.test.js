const request = require("supertest");
const app = require("../../server");

describe("Bookings API", () => {
  let token;

  beforeAll(async () => {
    const email = `book${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      name: "User",
      email,
      password: "123456"
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "123456"
    });

    token = login.body.token;
  });

  it("GET /api/bookings", async () => {
    const res = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // ✅ correct
  });

});