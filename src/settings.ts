import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsModel = formattingSettings.Model;
import FormattingSettingsSlice = formattingSettings.Slice;

class DisplayCard extends FormattingSettingsCard {
    name = "display";
    displayName = "Display";

    titleText = new formattingSettings.TextInput({ name: "titleText", displayName: "Visual title", value: "Fabric Adoption Monitor", placeholder: "Fabric Adoption Monitor" });
    showScore = new formattingSettings.ToggleSwitch({ name: "showScore", displayName: "Show score", value: true });
    showKpis = new formattingSettings.ToggleSwitch({ name: "showKpis", displayName: "Show KPI tiles", value: true });
    showGovernance = new formattingSettings.ToggleSwitch({ name: "showGovernance", displayName: "Show governance section", value: true });
    showAction = new formattingSettings.ToggleSwitch({ name: "showAction", displayName: "Show suggested action", value: true });
    compactMode = new formattingSettings.ToggleSwitch({ name: "compactMode", displayName: "Compact mode", value: false });
    decimalPlaces = new formattingSettings.NumUpDown({ name: "decimalPlaces", displayName: "Score decimal places", value: 0 });
    numberAbbreviation = new formattingSettings.ItemDropdown({
        name: "numberAbbreviation",
        displayName: "Number abbreviation",
        items: [
            { value: "none", displayName: "None" },
            { value: "km", displayName: "K / M" }
        ],
        value: { value: "km", displayName: "K / M" }
    });
    tileBorderRadius = new formattingSettings.NumUpDown({ name: "tileBorderRadius", displayName: "Tile corner radius", value: 6 });
    fontSize = new formattingSettings.NumUpDown({ name: "fontSize", displayName: "Font size", value: 14 });

    slices: FormattingSettingsSlice[] = [
        this.titleText, this.showScore, this.showKpis, this.showGovernance, this.showAction,
        this.compactMode, this.decimalPlaces, this.numberAbbreviation, this.tileBorderRadius, this.fontSize
    ];
}

class ThresholdsCard extends FormattingSettingsCard {
    name = "thresholds";
    displayName = "Thresholds";
    excellent = new formattingSettings.NumUpDown({ name: "excellent", displayName: "Excellent ≥", value: 85 });
    healthy = new formattingSettings.NumUpDown({ name: "healthy", displayName: "Healthy ≥", value: 70 });
    moderate = new formattingSettings.NumUpDown({ name: "moderate", displayName: "Moderate ≥", value: 55 });
    low = new formattingSettings.NumUpDown({ name: "low", displayName: "Low ≥", value: 40 });
    slices: FormattingSettingsSlice[] = [this.excellent, this.healthy, this.moderate, this.low];
}

class ColorsCard extends FormattingSettingsCard {
    name = "colors";
    displayName = "Colors";
    backgroundColor = new formattingSettings.ColorPicker({ name: "backgroundColor", displayName: "Background", value: { value: "#FFFFFF" } });
    textColor = new formattingSettings.ColorPicker({ name: "textColor", displayName: "Text", value: { value: "#252423" } });
    positiveColor = new formattingSettings.ColorPicker({ name: "positiveColor", displayName: "Positive", value: { value: "#107C10" } });
    warningColor = new formattingSettings.ColorPicker({ name: "warningColor", displayName: "Warning", value: { value: "#D9822B" } });
    riskColor = new formattingSettings.ColorPicker({ name: "riskColor", displayName: "Risk", value: { value: "#A4262C" } });
    slices: FormattingSettingsSlice[] = [this.backgroundColor, this.textColor, this.positiveColor, this.warningColor, this.riskColor];
}

export class VisualSettings extends FormattingSettingsModel {
    display = new DisplayCard();
    thresholds = new ThresholdsCard();
    colors = new ColorsCard();
    cards = [this.display, this.thresholds, this.colors];
}
