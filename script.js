// Handle tab switching
const ciSection = document.getElementById("compound-interest-section");
const emiSection = document.getElementById("emi-calculator-section");

document.getElementById("compound-interest-tab").addEventListener("click", () => {
  showTab("compound-interest");
});

document.getElementById("emi-tab").addEventListener("click", () => {
  showTab("emi");
});

function showTab(tabName) {
  if (tabName === "compound-interest") {
    ciSection.style.display = "block";
    emiSection.style.display = "none";
    document.getElementById("compound-interest-tab").classList.add("active-tab");
    document.getElementById("emi-tab").classList.remove("active-tab");
  } else if (tabName === "emi") {
    ciSection.style.display = "none";
    emiSection.style.display = "block";
    document.getElementById("emi-tab").classList.add("active-tab");
    document.getElementById("compound-interest-tab").classList.remove("active-tab");
  }
}

// Compound Interest Calculation Logic
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

  let futureValue = principal * Math.pow(1 + rate / timesCompounded, timesCompounded * years);
  const monthlyRate = rate / 12;
  let totalDeposits = 0;

  for (let i = 1; i <= years * 12; i++) {
    totalDeposits += monthlyDeposit * Math.pow(1 + monthlyRate, i);
  }

  futureValue += totalDeposits;

  document.getElementById("result-interest").textContent = `Future Value: $${futureValue.toFixed(2)}`;
});

// EMI Calculation Logic
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

  document.getElementById("result-emi").textContent = `EMI (Per Month): $${emi.toFixed(2)}`;
});