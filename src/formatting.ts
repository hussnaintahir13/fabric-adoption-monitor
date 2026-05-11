export type NumberAbbreviation = "none" | "km";

export function abbreviateNumber(value: number | undefined, mode: NumberAbbreviation, decimals = 1): string {
    if (value === undefined || value === null || !isFinite(value)) return "—";
    if (mode === "none") return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(decimals)}B`;
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(decimals)}M`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(decimals)}K`;
    return value.toFixed(0);
}

export function trendDetail(curr: number | undefined, prev: number | undefined): { trend: "up" | "down" | "flat"; detail: string } | undefined {
    if (curr === undefined || prev === undefined || !isFinite(curr) || !isFinite(prev) || prev === 0) return undefined;
    const delta = curr - prev;
    const pct = (delta / prev) * 100;
    if (Math.abs(pct) < 1) return { trend: "flat", detail: "flat vs prev" };
    if (pct > 0) return { trend: "up", detail: `▲ ${pct.toFixed(1)}% vs prev` };
    return { trend: "down", detail: `▼ ${Math.abs(pct).toFixed(1)}% vs prev` };
}

export function formatPercent(value: number, decimals = 1): string {
    if (!isFinite(value)) return "—";
    return `${value.toFixed(decimals)}%`;
}
