/**
 * --------------------------------------------------------------------------
 * CALCULATOR CONTROLLER (ENERGY & FINANCIAL ESTIMATES)
 * --------------------------------------------------------------------------
 * This endpoint allows the server to verify, calculate, and provide industry-standard
 * solar sizing, panel requirements, utility bill savings, and environmental impacts.
 */

/**
 * @desc    Calculate solar capacity, savings, and environmental return
 * @route   POST /api/calculator/calculate
 * @access  Public
 */
export const calculateSolarFeasibility = (req, res) => {
  try {
    const {
      monthlyBill = 250,
      propertyType = 'residential',
      sunlightTier = 5.0,
      includeBattery = false
    } = req.body;

    const parsedBill = Number(monthlyBill) || 250;
    const parsedSunlight = Number(sunlightTier) || 5.0;

    // Average grid rate per kWh based on utility classification
    const avgRatePerKwh =
      propertyType === 'commercial'
        ? 0.14
        : propertyType === 'agricultural'
        ? 0.13
        : 0.17;

    const monthlyKwhConsumption = parsedBill / avgRatePerKwh;

    // Solar offset target (covering ~85% of grid consumption)
    const solarCoverage = 0.85;
    const targetMonthlySolarKwh = monthlyKwhConsumption * solarCoverage;
    const dailySolarKwhNeeded = targetMonthlySolarKwh / 30;

    // System capacity in kW = daily kWh / peak sun hours
    const rawKw = dailySolarKwhNeeded / parsedSunlight;
    const systemSizeKw = Math.max(2.5, Math.min(100, Math.round(rawKw * 10) / 10));

    // High-efficiency 425W Tier-1 Photovoltaic Modules
    const panelWattage = 425;
    const panelCount = Math.ceil((systemSizeKw * 1000) / panelWattage);
    const roofSpaceSqFt = Math.round(panelCount * 22); // ~22 sq ft per module with maintenance spacing

    // Savings projections
    const monthlySavings = Math.round(parsedBill * solarCoverage);
    const annualSavings = monthlySavings * 12;

    // 25-Year cumulative savings with 3% annual grid tariff escalation
    let cumulative25YearSavings = 0;
    let currentYearSavings = annualSavings;
    for (let year = 1; year <= 25; year++) {
      cumulative25YearSavings += currentYearSavings;
      currentYearSavings *= 1.03;
    }
    cumulative25YearSavings = Math.round(cumulative25YearSavings);

    // Environmental metrics (EPA Standard Factor)
    const annualKwhGenerated = systemSizeKw * parsedSunlight * 365;
    const annualCo2Tons = Number((annualKwhGenerated * 0.000705).toFixed(1));
    const treesPlantedEquivalent = Math.round(annualKwhGenerated * 0.016);

    // Payback period range
    const paybackYears = propertyType === 'commercial' ? '3.8 – 4.5' : '4.6 – 5.8';

    return res.status(200).json({
      success: true,
      inputs: {
        monthlyBill: parsedBill,
        propertyType,
        sunlightTier: parsedSunlight,
        includeBattery
      },
      results: {
        systemSizeKw,
        panelCount,
        panelWattage: `${panelWattage}W`,
        roofSpaceSqFt,
        monthlySavings,
        annualSavings,
        cumulative25YearSavings,
        annualCo2Tons,
        treesPlantedEquivalent,
        paybackYears,
        batteryRecommended: includeBattery ? '10-15 kWh Lithium LFP' : 'Optional'
      }
    });
  } catch (error) {
    console.error('Error in calculator endpoint:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate solar feasibility.',
      error: error.message
    });
  }
};
