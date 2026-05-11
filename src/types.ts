export type AdoptionStatus = "Excellent Adoption" | "Healthy Adoption" | "Moderate Adoption" | "Low Adoption" | "At Risk";

export interface AdoptionMeasures {
    activeUsers?: number;
    totalUsers?: number;
    inactiveUsers?: number;
    reportViews?: number;
    previousReportViews?: number;
    workspaceCount?: number;
    reportCount?: number;
    unusedReportCount?: number;
    refreshFailureCount?: number;
    certifiedDatasetCount?: number;
    datasetCount?: number;
    adoptionScore?: number;
    periodLabel?: string;
    category?: string;
}

export interface KpiTile {
    key: string;
    label: string;
    value: number | undefined;
    trend?: "up" | "down" | "flat";
    trendDetail?: string;
    tone: "positive" | "warning" | "risk" | "neutral";
}

export interface AdoptionResult {
    score: number;
    status: AdoptionStatus;
    tiles: KpiTile[];
    riskBadge: "Low" | "Medium" | "High";
    suggestedAction: string;
    hasData: boolean;
    periodLabel?: string;
    category?: string;
}

export interface Thresholds {
    excellent: number;
    healthy: number;
    moderate: number;
    low: number;
}

export interface ColorScheme {
    background: string;
    text: string;
    positive: string;
    warning: string;
    risk: string;
}
