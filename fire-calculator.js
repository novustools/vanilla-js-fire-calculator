/**
 * NovusTools - Vanilla JS FIRE Calculator Logic
 * Lightweight, dependency-free logic for calculating Financial Independence, Retire Early (FIRE) metrics.
 */

function calculateFIREMetrics(age, currentNetWorth, monthlyInvestment, monthlyExpenses, annualReturnRate, safeWithdrawalRate) {
    // Convert percentages to decimals
    const ret = annualReturnRate / 100;
    const swr = safeWithdrawalRate / 100;

    // Target FIRE = Annual Expenses / Safe Withdrawal Rate
    const targetFIRE = swr > 0 ? (monthlyExpenses * 12) / swr : 0;
    const monthlyRet = ret / 12;
    
    let months = 0;
    let simNW = currentNetWorth;

    if (simNW >= targetFIRE) {
        months = 0;
    } else if (monthlyInvestment > 0 || monthlyRet > 0) {
        // Compound interest loop (Cap at 1200 months / 100 years to prevent infinite loops)
        while (simNW < targetFIRE && months < 1200) {
            simNW = simNW * (1 + monthlyRet) + monthlyInvestment;
            months++;
        }
    } else {
        months = 1200; 
    }

    const years = months / 12;
    const fireAge = age + years;

    // Progress percentage
    let percent = targetFIRE > 0 ? (currentNetWorth / targetFIRE) * 100 : 0;
    if (percent > 100) percent = 100;

    // Coast FIRE Logic (Amount needed NOW to reach target at age 65 without further contributions)
    let coastFIRE = 0;
    if (age < 65) {
        coastFIRE = targetFIRE / Math.pow(1 + ret, 65 - age);
    } else {
        coastFIRE = targetFIRE; 
    }

    return {
        targetFIRE: targetFIRE,
        coastFIRE: coastFIRE,
        yearsToFIRE: years,
        projectedFIREAge: fireAge,
        percentComplete: percent
    };
}

// Example Usage:
// const results = calculateFIREMetrics(30, 50000, 1500, 4000, 7, 4);
// console.log(results);
