const request = require("supertest");
const app = require("../../server");

describe("Auth API", () => {
  let token;
  const testEmail = `test${Date.now()}@test.com`; // ✅ UNIQUE EMAIL

  it("POST /api/auth/register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456"
      });

    expect([201, 200]).toContain(res.statusCode); 
    // allow flexibility
  });

  it("POST /api/auth/login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "123456"
      });

    token = res.body.token;
    expect(res.statusCode).toBe(200); // ✅ FIXED
  });

  it("GET /api/auth/me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // ✅ FIXED
  });
});