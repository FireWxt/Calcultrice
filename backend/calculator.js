function add(a, b) {
  return Number(a) + Number(b);
}

function subtract(a, b) {
  return Number(a) - Number(b);
}

function multiply(a, b) {
  return Number(a) * Number(b);
}

function divide(a, b) {
  const divisor = Number(b);
  if (divisor === 0) {
    throw new Error("Division par zéro impossible");
  }
  return Number(a) / divisor;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
};
