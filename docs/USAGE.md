# Fabric Adoption Monitor — Usage Guide

1. **Load adoption data** into Power BI. Sources include:
   - The Power BI usage metrics dataset
   - Microsoft 365 unified audit log exports
   - Power BI admin / Fabric monitoring APIs (refresh history, capacity events)
2. **Import the visual** via Visualizations → … → Import a visual from a file.
3. **Bind measures** to the data roles described in the README.
4. **Customise** in the Format pane:
   - Display: toggles, compact mode, decimals, number abbreviation (K/M), tile radius, font size, title.
   - Thresholds: adjust Excellent/Healthy/Moderate/Low cut-offs.
   - Colors: background, text, positive, warning, risk.
5. **Optional**:
   - Add a `Period Label` grouping (e.g. "Last 30 days") to surface it in the title.
   - Add a `Category` grouping (e.g. "Marketing workspace") for a per-segment view.
   - Supply `Previous Report Views` to get a period-over-period trend on the Views tile.

The score and status badge update on every page interaction. Hover over tiles for accessible labels; tile focus is keyboard-reachable.
