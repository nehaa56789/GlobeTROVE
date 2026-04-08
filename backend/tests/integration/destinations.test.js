const request = require("supertest");
const app = require("../../server");
const Destination = require("../../models/Destination");

describe("Destinations API", () => {

  beforeAll(async () => {
    const count = await Destination.countDocuments();

    if (count === 0) {
      await Destination.create({
        city: "Paris",
        country: "France",
        desc: "Test destination",
        price: 50000
      });
    }
  });

  it("GET /api/destinations", async () => {
    const res = await request(app).get("/api/destinations");

    expect(res.statusCode).toBe(200);

    // ✅ CORRECT CHECK
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/destinations/:id", async () => {
    const list = await request(app).get("/api/destinations");

    const id = list.body.data[0]._id; // ✅ FIXED

    const res = await request(app).get(`/api/destinations/${id}`);

    expect(res.statusCode).toBe(200);
  });

});