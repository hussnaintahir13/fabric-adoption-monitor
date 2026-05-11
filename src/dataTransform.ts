import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewValueColumn = powerbi.DataViewValueColumn;
import { AdoptionMeasures } from "./types";

const safeNumber = (v: powerbi.PrimitiveValue | undefined | null): number | undefined => {
    if (v === undefined || v === null) return undefined;
    const n = Number(v);
    return isFinite(n) ? n : undefined;
};

export function extractMeasures(dataView: DataView | undefined): AdoptionMeasures {
    const m: AdoptionMeasures = {};
    if (!dataView || !dataView.categorical) return m;

    const cat = dataView.categorical;
    if (cat.values) {
        for (const v of cat.values as DataViewValueColumn[]) {
            const roles = v.source.roles || {};
            const value = v.values && v.values.length > 0 ? v.values[0] : undefined;
            const n = safeNumber(value);
            if (roles.activeUsers) m.activeUsers = n;
            if (roles.totalUsers) m.totalUsers = n;
            if (roles.inactiveUsers) m.inactiveUsers = n;
            if (roles.reportViews) m.reportViews = n;
            if (roles.previousReportViews) m.previousReportViews = n;
            if (roles.workspaceCount) m.workspaceCount = n;
            if (roles.reportCount) m.reportCount = n;
            if (roles.unusedReportCount) m.unusedReportCount = n;
            if (roles.refreshFailureCount) m.refreshFailureCount = n;
            if (roles.certifiedDatasetCount) m.certifiedDatasetCount = n;
            if (roles.datasetCount) m.datasetCount = n;
            if (roles.adoptionScore) m.adoptionScore = n;
        }
    }

    if (cat.categories) {
        for (const c of cat.categories) {
            const roles = c.source.roles || {};
            const first = c.values && c.values.length > 0 ? c.values[0] : undefined;
            if (first == null) continue;
            if (roles.periodLabel) m.periodLabel = String(first);
            if (roles.category) m.category = String(first);
        }
    }

    // If inactive not supplied but total and active are, derive it.
    if (m.inactiveUsers === undefined && m.totalUsers !== undefined && m.activeUsers !== undefined) {
        m.inactiveUsers = Math.max(0, m.totalUsers - m.activeUsers);
    }

    return m;
}
