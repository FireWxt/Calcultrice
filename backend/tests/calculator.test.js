const { add, subtract, multiply, divide } = require("../calculator");

describe("add", () => {
  test("addition de deux positifs", () => expect(add(10, 5)).toBe(15));
  test("addition avec négatif",    () => expect(add(-3, 7)).toBe(4));
  test("addition de deux zéros",   () => expect(add(0, 0)).toBe(0));
  test("addition avec décimaux",   () => expect(add(1.5, 2.5)).toBe(4));
});

describe("subtract", () => {
  test("soustraction basique",      () => expect(subtract(10, 5)).toBe(5));
  test("résultat négatif",          () => expect(subtract(3, 7)).toBe(-4));
  test("soustraction de zéro",      () => expect(subtract(5, 0)).toBe(5));
});

describe("multiply", () => {
  test("multiplication basique",    () => expect(multiply(4, 3)).toBe(12));
  test("multiplication par zéro",   () => expect(multiply(9, 0)).toBe(0));
  test("multiplication négatifs",   () => expect(multiply(-2, -3)).toBe(6));
  test("multiplication décimaux",   () => expect(multiply(2.5, 4)).toBe(10));
});

describe("divide", () => {
  test("division basique",          () => expect(divide(10, 2)).toBe(5));
  test("division avec décimaux",    () => expect(divide(7, 2)).toBe(3.5));
  test("division par zéro",         () => expect(() => divide(5, 0)).toThrow("Division par zéro impossible"));
  test("division résultat zéro",    () => expect(divide(0, 5)).toBe(0));
});
