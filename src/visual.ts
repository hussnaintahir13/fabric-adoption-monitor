import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import { VisualSettings } from "./settings";
import { buildResult } from "./adoptionScoring";
import { extractMeasures } from "./dataTransform";
import { AdoptionResult, ColorScheme, KpiTile, Thresholds } from "./types";
import { abbreviateNumber, NumberAbbreviation } from "./formatting";

export class Visual implements IVisual {
    private root: HTMLElement;
    private settings: VisualSettings = new VisualSettings();
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.root = options.element;
        this.root.classList.add("fam-root");
        this.formattingSettingsService = new FormattingSettingsService();
    }

    public update(options: VisualUpdateOptions): void {
        const dataView = options.dataViews && options.dataViews[0];
        this.settings = this.formattingSettingsService.populateFormattingSettingsModel(VisualSettings, dataView);
        const t: Thresholds = {
            excellent: this.settings.thresholds.excellent.value,
            healthy: this.settings.thresholds.healthy.value,
            moderate: this.settings.thresholds.moderate.value,
            low: this.settings.thresholds.low.value
        };
        const result = buildResult(extractMeasures(dataView), t);
        this.render(result, options.viewport.width, options.viewport.height);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.settings);
    }

    private getColors(): ColorScheme {
        const c = this.settings.colors;
        return {
            background: c.backgroundColor.value.value,
            text: c.textColor.value.value,
            positive: c.positiveColor.value.value,
            warning: c.warningColor.value.value,
            risk: c.riskColor.value.value
        };
    }

    private toneColor(tone: KpiTile["tone"], colors: ColorScheme): string {
        switch (tone) {
            case "positive": return colors.positive;
            case "warning": return colors.warning;
            case "risk": return colors.risk;
            default: return colors.text;
        }
    }

    private render(result: AdoptionResult, width: number, height: number): void {
        const colors = this.getColors();
        const d = this.settings.display;
        const abbr = (d.numberAbbreviation.value.value as NumberAbbreviation) || "km";

        this.root.innerHTML = "";
        this.root.style.background = colors.background;
        this.root.style.color = colors.text;
        this.root.style.fontSize = `${d.fontSize.value}px`;
        this.root.style.setProperty("--fam-radius", `${d.tileBorderRadius.value}px`);
        this.root.setAttribute("role", "region");
        this.root.setAttribute("aria-label", "Fabric adoption monitor");

        if (!result.hasData) {
            this.renderEmptyState();
            return;
        }

        const compact = d.compactMode.value || width < 380 || height < 260;
        this.root.classList.toggle("compact", compact);

        const header = document.createElement("h2");
        header.className = "fam-title";
        const titleParts = [d.titleText.value];
        if (result.category) titleParts.push(result.category);
        if (result.periodLabel) titleParts.push(result.periodLabel);
        header.textContent = titleParts.join(" — ");
        this.root.appendChild(header);

        if (d.showScore.value) {
            const block = document.createElement("div");
            block.className = "fam-score-block";
            const score = document.createElement("div");
            score.className = "fam-score";
            score.style.color = this.statusToColor(result.score, colors);
            score.textContent = result.score.toFixed(d.decimalPlaces.value);
            score.setAttribute("aria-label", `Adoption score ${result.score.toFixed(d.decimalPlaces.value)} out of 100`);
            const status = document.createElement("div");
            status.className = "fam-status";
            status.style.background = this.statusToColor(result.score, colors);
            status.textContent = result.status;
            block.appendChild(score);
            block.appendChild(status);
            this.root.appendChild(block);
        }

        if (d.showKpis.value && result.tiles.length > 0) {
            const grid = document.createElement("div");
            grid.className = "fam-grid";
            grid.setAttribute("role", "list");
            for (const tile of result.tiles) {
                const el = document.createElement("div");
                el.className = "fam-tile";
                el.setAttribute("role", "listitem");
                el.setAttribute("tabindex", "0");
                const valueText = abbreviateNumber(tile.value, abbr);
                el.setAttribute("aria-label", `${tile.label}: ${valueText}${tile.trendDetail ? ", " + tile.trendDetail : ""}`);

                const label = document.createElement("div");
                label.className = "fam-tile-label";
                label.textContent = tile.label;

                const value = document.createElement("div");
                value.className = "fam-tile-value";
                value.textContent = valueText;
                value.style.color = this.toneColor(tile.tone, colors);

                el.appendChild(label);
                el.appendChild(value);

                if (tile.trendDetail) {
                    const trend = document.createElement("div");
                    trend.className = "fam-tile-trend " + (tile.trend ?? "flat");
                    trend.textContent = tile.trendDetail;
                    el.appendChild(trend);
                }

                grid.appendChild(el);
            }
            this.root.appendChild(grid);
        }

        if (d.showGovernance.value) {
            const gov = document.createElement("div");
            gov.className = "fam-governance";
            const badge = document.createElement("span");
            badge.className = "fam-risk-badge risk-" + result.riskBadge.toLowerCase();
            badge.textContent = `Governance risk: ${result.riskBadge}`;
            badge.setAttribute("role", "status");
            gov.appendChild(badge);
            this.root.appendChild(gov);
        }

        if (d.showAction.value && result.suggestedAction) {
            const action = document.createElement("p");
            action.className = "fam-action";
            action.textContent = result.suggestedAction;
            this.root.appendChild(action);
        }
    }

    private statusToColor(score: number, colors: ColorScheme): string {
        const t = this.settings.thresholds;
        if (score >= t.healthy.value) return colors.positive;
        if (score >= t.moderate.value) return colors.warning;
        return colors.risk;
    }

    private renderEmptyState(): void {
        const wrap = document.createElement("div");
        wrap.className = "fam-empty";
        wrap.setAttribute("role", "status");
        wrap.innerHTML = `
            <h3>Fabric Adoption Monitor</h3>
            <p>Bind adoption measures (active users, total users, report views, refresh failures, certified datasets, etc.) to begin.</p>
        `;
        this.root.appendChild(wrap);
    }
}
