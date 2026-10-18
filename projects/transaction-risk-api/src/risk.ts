// An interface defines the expected shape of an object.
export interface Transaction {
  transactionId: string;
  amount: number;
  country: string;
  isInternational: boolean;
  accountAgeDays: number;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface RiskResult {
  transactionId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  flagged: boolean;
  reasons: string[];
}

// TypeScript types do not validate untrusted JSON at runtime.
export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.transactionId === "string" && t.transactionId.trim().length > 0 &&
    typeof t.amount === "number" && Number.isFinite(t.amount) && t.amount >= 0 &&
    typeof t.country === "string" && t.country.trim().length > 0 &&
    typeof t.isInternational === "boolean" &&
    typeof t.accountAgeDays === "number" && Number.isInteger(t.accountAgeDays) && t.accountAgeDays >= 0
  );
}

export function assessRisk(transaction: Transaction): RiskResult {
  let riskScore = 0;
  const reasons: string[] = [];

  if (transaction.amount >= 5000) {
    riskScore += 35;
    reasons.push("High transaction amount");
  }
  if (transaction.isInternational) {
    riskScore += 25;
    reasons.push("International transaction");
  }
  if (transaction.accountAgeDays < 30) {
    riskScore += 15;
    reasons.push("New account");
  }

  const riskLevel: RiskLevel = riskScore >= 60 ? "HIGH" : riskScore >= 30 ? "MEDIUM" : "LOW";
  return {
    transactionId: transaction.transactionId,
    riskScore,
    riskLevel,
    flagged: riskLevel === "HIGH",
    reasons
  };
}
