// === Tab Switching Logic ===
const ciSection = document.getElementById("compound-interest-section");
const emiSection = document.getElementById("emi-calculator-section");
const currencySection = document.getElementById("currency-converter-section");

document.getElementById("compound-interest-tab").addEventListener("click", () => {
  showTab("compound-interest");
});
document.getElementById("emi-tab").addEventListener("click", () => {
  showTab("emi");
});
document.getElementById("currency-converter-tab").addEventListener("click", () => {
  showTab("currency-converter");
});

function showTab(tabName) {
  ciSection.style.display = tabName === "compound-interest" ? "block" : "none";
  emiSection.style.display = tabName === "emi" ? "block" : "none";
  currencySection.style.display = tabName === "currency-converter" ? "block" : "none";

  document.getElementById("compound-interest-tab").classList.toggle("active-tab", tabName === "compound-interest");
  document.getElementById("emi-tab").classList.toggle("active-tab", tabName === "emi");
  document.getElementById("currency-converter-tab").classList.toggle("active-tab", tabName === "currency-converter");
}

// === Compound Interest Calculator ===
document.getElementById("calculate-interest-btn").addEventListener("click", () => {
  const principal = parseFloat(document.getElementById("principal").value);
  const monthlyDeposit = parseFloat(document.getElementById("monthly-deposit").value);
  const rate = parseFloat(document.getElementById("rate").value) / 100;
  const timesCompounded = parseInt(document.getElementById("times-compounded").value);
  const years = parseInt(document.getElementById("years").value);

  if (isNaN(principal) || isNaN(monthlyDeposit) || isNaN(rate) || isNaN(timesCompounded) || isNaN(years)) {
    document.getElementById("result-interest").textContent = "Please enter valid input values.";
    return;
  }

  // Compound interest on initial principal
  let futureValue = principal * Math.pow(1 + rate / timesCompounded, timesCompounded * years);
  const currency = document.getElementById("ci-currency").value;

  // Future value of monthly deposits
  const monthlyRate = rate / 12;
  let totalDeposits = 0;
  for (let i = 1; i <= years * 12; i++) {
    totalDeposits += monthlyDeposit * Math.pow(1 + monthlyRate, i);
  }

  futureValue += totalDeposits;
  document.getElementById("result-interest").textContent =
  `Future Value: ${futureValue.toFixed(2)} ${currency}`;
});

// === EMI Calculator ===
document.getElementById("calculate-emi-btn").addEventListener("click", () => {
  const loanAmount = parseFloat(document.getElementById("loan-amount").value);
  const annualRate = parseFloat(document.getElementById("annual-rate").value) / 100;
  const loanTenure = parseInt(document.getElementById("loan-tenure").value);

  if (isNaN(loanAmount) || isNaN(annualRate) || isNaN(loanTenure)) {
    document.getElementById("result-emi").textContent = "Please enter valid input values.";
    return;
  }

  const monthlyRate = annualRate / 12;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
              (Math.pow(1 + monthlyRate, loanTenure) - 1);

  document.getElementById("result-emi").textContent = `EMI (Per Month): ${emi.toFixed(2)}`;
});

// === Currency Converter (Mock Rates) ===
document.getElementById("convert-currency-btn").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("from-currency").value;
  const toCurrency = document.getElementById("to-currency").value;

  if (isNaN(amount)) {
    document.getElementById("converted-amount").textContent = "Please enter a valid amount.";
    return;
  }

  // Mock exchange rates relative to USD
  const exchangeRates = {
    USD: 1,
    EUR: 0.885,
    INR: 84.530,
    GBP: 0.753,
    AUD: 1.551
  };

  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    document.getElementById("converted-amount").textContent = "Unsupported currency.";
    return;
  }

  const amountInUSD = amount / exchangeRates[fromCurrency];
  const convertedAmount = amountInUSD * exchangeRates[toCurrency];

  document.getElementById("converted-amount").textContent =
    `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
});
