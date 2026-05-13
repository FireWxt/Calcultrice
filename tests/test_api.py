import json
import os
import time
import unittest
from urllib import error, request


BASE_URL = os.getenv("BASE_URL", "http://backend:3000")


def http_json(method: str, path: str, body: dict | None = None):
    url = f"{BASE_URL}{path}"
    data = None
    headers = {}

    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = request.Request(url=url, data=data, headers=headers, method=method)

    try:
        with request.urlopen(req, timeout=5) as resp:
            payload = resp.read().decode("utf-8")
            return resp.getcode(), json.loads(payload)
    except error.HTTPError as exc:
        payload = exc.read().decode("utf-8")
        return exc.code, json.loads(payload)


class CalculatorApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        last_error = None
        for _ in range(10):
            try:
                status, _ = http_json("GET", "/health")
                if status == 200:
                    return
            except Exception as exc:  # pragma: no cover
                last_error = exc
            time.sleep(1)
        raise RuntimeError(f"Backend not reachable at {BASE_URL}: {last_error}")

    def test_health_endpoint(self):
        status, payload = http_json("GET", "/health")
        self.assertEqual(status, 200)
        self.assertEqual(payload.get("status"), "Backend OK")

    def test_calculate_addition(self):
        status, payload = http_json(
            "POST",
            "/calculate",
            {"operation": "+", "num1": 2, "num2": 3},
        )
        self.assertEqual(status, 200)
        self.assertEqual(payload.get("result"), 5)
        self.assertEqual(payload.get("operation"), "+")

    def test_calculate_division_by_zero(self):
        status, payload = http_json(
            "POST",
            "/calculate",
            {"operation": "/", "num1": 10, "num2": 0},
        )
        self.assertEqual(status, 400)
        self.assertEqual(payload.get("error"), "Division par zéro impossible")

    def test_calculate_invalid_operation(self):
        status, payload = http_json(
            "POST",
            "/calculate",
            {"operation": "%", "num1": 5, "num2": 2},
        )
        self.assertEqual(status, 400)
        self.assertEqual(payload.get("error"), "Opération invalide")

    def test_history_records_latest_calculation(self):
        http_json("POST", "/calculate", {"operation": "*", "num1": 7, "num2": 6})
        status, payload = http_json("GET", "/history?limit=1")
        self.assertEqual(status, 200)
        self.assertTrue(len(payload) >= 1)
        self.assertEqual(payload[0].get("operation"), "*")
        self.assertEqual(payload[0].get("result"), 42)


if __name__ == "__main__":
    unittest.main()
