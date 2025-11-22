
import { PesProgram, BenefitShare } from '../types';

/**
 * Mocks a readiness score calculation based on data quality and governance indicators.
 * In a real app, this would analyze the density of sensors and frequency of reporting.
 */
export const computePesReadinessScore = (program: PesProgram): number => {
    let score = 0.5; // Base score

    // Bonus for metrics availability
    if (program.type === 'forest') {
        if ((program.metrics.haMonitored || 0) > 100) score += 0.2;
        if (program.linkedForestAreaIds && program.linkedForestAreaIds.length > 0) score += 0.1;
    } else {
        if ((program.metrics.wasteDiversionKg || 0) > 500) score += 0.2;
        if (program.linkedWasteZoneIds && program.linkedWasteZoneIds.length > 0) score += 0.1;
    }

    // Penalty for missing benefit sharing definition
    if (program.benefitSharing.length === 0) score -= 0.2;

    // Cap between 0 and 1
    return Math.max(0, Math.min(1, score));
};

/**
 * Estimates indicative payments based on performance metrics.
 * Formula is transparent but mocked for the PoC.
 */
export const estimateIndicativePaymentKes = (program: PesProgram): number => {
    const RATE_PER_HA_PROTECTED = 1200; // KES per hectare per month
    const RATE_PER_KG_DIVERTED = 10;    // KES premium per kg recycled
    const RATE_PER_TON_CO2 = 500;       // KES per ton CO2 offset

    if (program.type === 'forest') {
        const ha = program.metrics.haMonitored || 0;
        // Simple calc: Base rate * hectares
        return ha * RATE_PER_HA_PROTECTED;
    } else {
        const kg = program.metrics.wasteDiversionKg || 0;
        const co2 = program.metrics.co2eAvoidedTons || 0;
        // Simple calc: Diversion premium + Carbon credit value
        return (kg * RATE_PER_KG_DIVERTED) + (co2 * RATE_PER_TON_CO2);
    }
};

/**
 * Ensures benefit sharing percentages sum to 100.
 */
export const normalizeBenefitSharing = (shares: BenefitShare[]): BenefitShare[] => {
    if (shares.length === 0) return [];
    
    const total = shares.reduce((acc, s) => acc + s.percentage, 0);
    if (total === 0) return shares; // Avoid division by zero

    return shares.map(s => ({
        ...s,
        percentage: Math.round((s.percentage / total) * 100)
    }));
};
