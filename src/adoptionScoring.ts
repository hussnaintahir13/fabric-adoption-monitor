import { AdoptionMeasures, AdoptionResult, AdoptionStatus, KpiTile, Thresholds } from "./types";
import { trendDetail } from "./formatting";

const clamp = (n: number, min = 0, max = 100): number => Math.max(min, Math.min(max, n));

export function statusForScore(score: number, t: Thresholds): AdoptionStatus {
    if (score >= t.excellent) return "Excellent Adoption";
    if (score >= t.healthy) return "Healthy Adoption";
    if (score >= t.moderate) return "Moderate Adoption";
    if (score >= t.low) return "Low Adoption";
    return "At Risk";
}

export function calculateScore(m: AdoptionMeasures): number {
    if (m.adoptionScore !== undefined) return clamp(m.adoptionScore);

    const activeRate = m.totalUsers && m.totalUsers > 0 && m.activeUsers !== undefined
        ? (m.activeUsers / m.totalUsers) * 100 : 0;
    const usageScore = clamp(activeRate);

    const unusedRate = m.reportCount && m.reportCount > 0 && m.unusedReportCount !== undefined
        ? (m.unusedReportCount / m.reportCount) * 100 : 0;
    const unusedPenalty = clamp(unusedRate);

    const refreshPenalty = Math.min(40, (m.refreshFailureCount ?? 0) * 5);

    const certifiedRate = m.datasetCount && m.datasetCount > 0 && m.certifiedDatasetCount !== undefined
        ? (m.certifiedDatasetCount / m.datasetCount) * 100 : 0;

    const score =
        usageScore * 0.45 +
        certifiedRate * 0.20 +
        (100 - unusedPenalty) * 0.20 +
        (100 - refreshPenalty) * 0.15;

    return clamp(score);
}

function suggestAction(m: AdoptionMeasures): string {
    const inactiveRate = m.totalUsers && m.totalUsers > 0 && m.inactiveUsers !== undefined
        ? m.inactiveUsers / m.totalUsers : 0;
    const unusedRate = m.reportCount && m.reportCount > 0 && m.unusedReportCount !== undefined
        ? m.unusedReportCount / m.reportCount : 0;
    const certifiedRate = m.datasetCount && m.datasetCount > 0 && m.certifiedDatasetCount !== undefined
        ? m.certifiedDatasetCount / m.datasetCount : 1;

    if ((m.refreshFailureCount ?? 0) >= 5) return "Investigate dataset refresh reliability — frequent failures will erode trust.";
    if (inactiveRate > 0.5) return "Encourage training and adoption campaigns — over half of provisioned users are inactive.";
    if (unusedRate > 0.4) return "Review stale reports and archive content with zero views in the last period.";
    if (certifiedRate < 0.2) return "Promote certified semantic models so consumers know which datasets to trust.";
    return "Adoption looks healthy — highlight wins and continue promoting certified content.";
}

function riskBadge(score: number): "Low" | "Medium" | "High" {
    if (score >= 70) return "Low";
    if (score >= 55) return "Medium";
    return "High";
}

function tone(score: number): KpiTile["tone"] {
    if (score >= 75) return "positive";
    if (score >= 50) return "warning";
    return "risk";
}

export function buildTiles(m: AdoptionMeasures): KpiTile[] {
    const tiles: KpiTile[] = [];
    const viewsTrend = trendDetail(m.reportViews, m.previousReportViews);

    tiles.push({
        key: "active",
        label: "Active users",
        value: m.activeUsers,
        tone: m.totalUsers && m.activeUsers !== undefined
            ? tone((m.activeUsers / m.totalUsers) * 100)
            : "neutral"
    });

    tiles.push({
        key: "inactive",
        label: "Inactive users",
        value: m.inactiveUsers,
        tone: m.totalUsers && m.inactiveUsers !== undefined && m.totalUsers > 0
            ? tone(100 - (m.inactiveUsers / m.totalUsers) * 100)
            : "neutral"
    });

    tiles.push({
        key: "views",
        label: "Report views",
        value: m.reportViews,
        trend: viewsTrend?.trend,
        trendDetail: viewsTrend?.detail,
        tone: "neutral"
    });

    tiles.push({
        key: "unused",
        label: "Unused reports",
        value: m.unusedReportCount,
        tone: m.unusedReportCount && m.unusedReportCount > 0 ? "warning" : "positive"
    });

    tiles.push({
        key: "failures",
        label: "Refresh failures",
        value: m.refreshFailureCount,
        tone: (m.refreshFailureCount ?? 0) === 0 ? "positive"
            : (m.refreshFailureCount ?? 0) < 5 ? "warning" : "risk"
    });

    tiles.push({
        key: "certified",
        label: "Certified datasets",
        value: m.certifiedDatasetCount,
        tone: m.datasetCount && m.certifiedDatasetCount !== undefined && m.datasetCount > 0
            ? tone((m.certifiedDatasetCount / m.datasetCount) * 100)
            : "neutral"
    });

    return tiles;
}

export function buildResult(m: AdoptionMeasures, t: Thresholds): AdoptionResult {
    const hasAny = Object.values(m).some(v => v !== undefined && v !== null);
    if (!hasAny) {
        return {
            score: 0,
            status: "At Risk",
            tiles: [],
            riskBadge: "High",
            suggestedAction: "",
            hasData: false
        };
    }
    const score = calculateScore(m);
    return {
        score,
        status: statusForScore(score, t),
        tiles: buildTiles(m),
        riskBadge: riskBadge(score),
        suggestedAction: suggestAction(m),
        hasData: true,
        periodLabel: m.periodLabel,
        category: m.category
    };
}
