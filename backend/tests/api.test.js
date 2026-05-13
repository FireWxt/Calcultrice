const request = require("supertest");
const { app } = require("../server");

describe("GET /health", () => {
  test("retourne Backend OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "Backend OK" });
  });
});

describe("GET /metrics", () => {
  test("expose les métriques Prometheus après une requête", async () => {
    await request(app).get("/health");

    const res = await request(app).get("/metrics");

    expect(res.status).toBe(200);
    expect(res.text).toContain("calculatrice_http_requests_total");
    expect(res.text).toContain("calculatrice_http_request_duration_seconds");
  });
});

describe("POST /calculate", () => {
  test("addition: 10 + 5 = 15", async () => {
    const res = await request(app)
      .post("/calculate")
      .send({ operation: "+", num1: 10, num2: 5 });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe(15);
  });

  test("division par zero => 400", async () => {
    const res = await request(app)
      .post("/calculate")
      .send({ operation: "/", num1: 5, num2: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Division par zéro impossible");
  });

  test("operation invalide => 400", async () => {
    const res = await request(app)
      .post("/calculate")
      .send({ operation: "%", num1: 5, num2: 2 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Opération invalide");
  });
});
