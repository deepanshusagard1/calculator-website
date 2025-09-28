"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // DOM utility shortcuts
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ---------- 1. Section Navigation ----------
  const navButtons = $$(".nav-btn");
  const sections = {
    "calculator-section": $("#calculator-section"),
    "blog-section":       $("#blog-section")
  };

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active-tab"));
      btn.classList.add("active-tab");
      Object.values(sections).forEach(sec => sec.classList.add("hidden"));
      sections[btn.dataset.section].classList.remove("hidden");
    });
  });

  // ---------- 2. Calculator Tab Switching ----------
  const calcTabs = $$(".calc-tab");
  const calculators = {
    "compound-interest": $("#compound-interest"),
    "emi":               $("#emi"),
    "swp":               $("#swp"),
    "currency":          $("#currency")
  };

  calcTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      calcTabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
      Object.values(calculators).forEach(c => c.classList.remove("active-calc"));
      calculators[tab.dataset.calc].classList.add("active-calc");
    });
  });

  // ---------- 3. Helpers ----------
  const formatCurrency = (val, cur) =>
    val.toLocaleString(undefined, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 2
    });

  const showResult = (el, msg) => {
    el.innerHTML = msg;
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
  };

  const setValidation = (input, ok) => {
    input.classList.toggle("input-valid", ok);
    input.classList.toggle("input-invalid", !ok);
  };

  const isPositive = n => Number.isFinite(n) && n >= 0;

  // ---------- 4. Compound Interest Calculator ----------
$("#calculate-interest-btn").addEventListener("click", () => {
  const P = parseFloat($("#principal").value);
  const M = parseFloat($("#monthly-deposit").value);
  const R = parseFloat($("#rate").value);
  const N = parseFloat($("#times-compounded").value);
  const Y = parseFloat($("#years").value);
  const cur = $("#ci-currency").value;
  const resEl = $("#result-interest");

  const inputs = [
    [$("#principal"),        isPositive(P) && P >= 0],
    [$("#monthly-deposit"),  isPositive(M) && M >= 0],
    [$("#rate"),             isPositive(R) && R >= 0],
    [$("#times-compounded"), isPositive(N) && N > 0],
    [$("#years"),            isPositive(Y) && Y > 0]
  ];
  let valid = true;
  inputs.forEach(([inp, ok]) => { setValidation(inp, ok); valid &&= ok; });
  if (!valid) {
    showResult(resEl, "⚠️ Please correct highlighted fields.");
    return;
  }

  const r = R / 100;
  const t = Y;

  // --- Principal growth ---
  const factor = Math.pow(1 + r / N, N * t);
  const FV_principal = P * factor;

  // --- Monthly deposits (treated as annuity due, deposits at beginning of month) ---
  // Convert compounding to monthly equivalent rate
  const monthlyRate = Math.pow(1 + r / N, N / 12) - 1;
  const months = t * 12;

  let FV_deposits = 0;
  if (r > 0) {
    FV_deposits = M * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  } else {
    // Special case: zero interest → deposits just add up
    FV_deposits = M * months;
  }

  // --- Total Future Value ---
  const FV = FV_principal + FV_deposits;

  showResult(resEl, `Future Value: ${formatCurrency(FV, cur)}`);
});
  
  // ---------- 5. EMI Calculator ----------
  $("#calculate-emi-btn").addEventListener("click", () => {
    const L = parseFloat($("#loan-amount").value);
    const R = parseFloat($("#annual-rate").value);
    const T = parseInt($("#loan-tenure").value, 10);
    const resEl = $("#result-emi");

    const inputs = [
      [$("#loan-amount"), isPositive(L) && L > 0],
      [$("#annual-rate"), isPositive(R) && R > 0],
      [$("#loan-tenure"), Number.isInteger(T) && T > 0]
    ];
    let valid = true;
    inputs.forEach(([inp, ok]) => { setValidation(inp, ok); valid &&= ok; });
    if (!valid) {
      showResult(resEl, "⚠️ Please correct highlighted fields.");
      return;
    }

    const monthlyRate = (R / 100) / 12;
    const emi =
      L * (monthlyRate * Math.pow(1 + monthlyRate, T)) /
      (Math.pow(1 + monthlyRate, T) - 1);

    showResult(resEl, `Monthly EMI: ${formatCurrency(emi, "INR")}`);
  });

  // ---------- 6. SWP Calculator ----------
  $("#calculate-swp-btn").addEventListener("click", () => {
    const initialAmount = parseFloat($("#swp-initial-amount").value);
    const monthlyWithdrawal = parseFloat($("#swp-withdrawal").value);
    const annualRate = parseFloat($("#swp-rate").value);
    const years = parseFloat($("#swp-period").value);
    const currency = $("#swp-currency").value;
    const resEl = $("#result-swp");

    const inputs = [
      [$("#swp-initial-amount"), isPositive(initialAmount) && initialAmount > 0],
      [$("#swp-withdrawal"), isPositive(monthlyWithdrawal) && monthlyWithdrawal > 0],
      [$("#swp-rate"), isPositive(annualRate) && annualRate >= 0],
      [$("#swp-period"), isPositive(years) && years > 0]
    ];

    let valid = true;
    inputs.forEach(([inp, ok]) => { setValidation(inp, ok); valid &&= ok; });
    if (!valid) {
      showResult(resEl, "⚠️ Please correct highlighted fields.");
      return;
    }

    // Convert annual rate to monthly rate
    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = years * 12;
    
    // Calculate remaining amount after specified period
    let balance = initialAmount;
    let totalWithdrawn = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Apply monthly return
      balance = balance * (1 + monthlyRate);
      
      // Check if we can withdraw the full amount
      if (balance >= monthlyWithdrawal) {
        balance -= monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
      } else {
        // Can only withdraw remaining balance
        totalWithdrawn += balance;
        balance = 0;
        break;
      }
    }
    
    // Calculate how long the money would last if withdrawal continues
    let sustainabilityMonths = 0;
    let tempBalance = initialAmount;
    
    while (tempBalance >= monthlyWithdrawal) {
      tempBalance = tempBalance * (1 + monthlyRate) - monthlyWithdrawal;
      sustainabilityMonths++;
      if (sustainabilityMonths > 1200) break; // Cap at 100 years
    }

    const sustainabilityYears = (sustainabilityMonths / 12).toFixed(1);
    
    showResult(resEl, `
      <div style="text-align: left;">
        <div style="margin-bottom: 1rem;"><strong>After ${years} years:</strong></div>
        <div>• Remaining Balance: ${formatCurrency(balance, currency)}</div>
        <div>• Total Withdrawn: ${formatCurrency(totalWithdrawn, currency)}</div>
        <div style="margin-top: 1rem;"><strong>Sustainability:</strong></div>
        <div>• Money will last: ${sustainabilityYears} years</div>
      </div>
    `);
  });

  // ---------- 7. Currency Converter ----------
  const exchangeRates = {
    USD: { INR: 83,  EUR: 0.92,  GBP: 0.79,  AUD: 1.5,   USD: 1 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, AUD: 0.018, INR: 1 },
    EUR: { USD: 1.09, INR: 90, GBP: 0.86, AUD: 1.64, EUR: 1 },
    GBP: { USD: 1.27, INR: 105, EUR: 1.16, AUD: 1.92, GBP: 1 },
    AUD: { USD: 0.66, INR: 54,  EUR: 0.61,  GBP: 0.52,  AUD: 1 }
  };

  $("#convert-currency-btn").addEventListener("click", () => {
    const amt  = parseFloat($("#amount").value);
    const from = $("#from-currency").value;
    const to   = $("#to-currency").value;
    const resEl = $("#converted-amount");

    setValidation($("#amount"), isPositive(amt) && amt > 0);
    if (!isPositive(amt) || amt <= 0) {
      showResult(resEl, "⚠️ Enter a valid amount.");
      return;
    }

    const converted = amt * exchangeRates[from][to];
    showResult(resEl, `Converted Amount: ${formatCurrency(converted, to)}`);
  });

  // ---------- 8. Theme Toggle (Light ↔ Dark) with localStorage ----------
  const themeBtn  = $("#theme-toggle-btn");
  if (!themeBtn) {
    console.warn('Theme toggle button not found on page!');
    return;
  }
  const themeIcon = $(".theme-icon", themeBtn);
  const themeTxt  = $(".theme-text", themeBtn);

  function applyTheme(theme) {
    // Set on <html> only!
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeIcon && themeTxt) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
      themeTxt.textContent  = theme === "dark" ? "Light" : "Dark";
    }
  }

  // Ensure correct theme on load
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
});
