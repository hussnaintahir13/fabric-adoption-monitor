# Fabric Adoption Monitor

**Author:** [Syed Hussnain Tahir Sherazi](https://www.syedhussnain.com)
**License:** MIT
**Category:** Adoption / governance / Microsoft Fabric admin

## Short description (≤100 chars, for AppSource listing)
Adoption & governance scorecard for Power BI and Microsoft Fabric: score, KPI tiles, risk badge, action.

## Long description
Fabric Adoption Monitor is a Power BI custom visual that helps BI managers and Microsoft Fabric admins communicate adoption, usage, engagement, and governance health in a single dashboard tile. You bind adoption signals — active users, total users, report views, refresh failures, unused reports, certified datasets — and the visual produces a 0–100 adoption score, an Excellent / Healthy / Moderate / Low / At-Risk status, six KPI tiles (with optional period-over-period trend), a governance risk badge, and a context-aware suggested action.

## What it solves
Adoption signals are scattered across audit logs, the Power BI usage metrics dataset, admin API exports, and Fabric monitoring. This visual surfaces the consolidated picture as one tile so non-admin leadership can see whether the tenant is healthy without needing to read a workbook of metrics.

## How it gets data
The visual does **not** call Microsoft Graph or the Power BI Admin API. You load adoption data into the Power BI model from your usual sources (usage metrics, audit log exports, admin / Fabric monitoring data) and bind measures.

## Who it's for
- Power BI / Fabric tenant admins.
- BI Centres of Excellence reporting on adoption.
- Customer Success teams running internal adoption reviews.

## Key features
- Weighted adoption score (active-user rate 45% / certified rate 20% / non-unused 20% / non-failure 15%).
- Adoption-Score override for teams who compute their own score.
- Six KPI tiles with auto-derived inactive-user metric and optional trend vs previous period.
- Rule-based suggested action (training, archive, certify, investigate refreshes, celebrate wins).
- Governance risk badge (Low / Medium / High).
- Configurable number abbreviation (None or K/M), thresholds, full palette, compact mode.
- Accessibility: aria-labels on every tile, keyboard focus, high-contrast support.

## Privacy & security
No network calls. No third-party JS. `privileges` array is empty. Read-only.

## Author
**Syed Hussnain Tahir Sherazi** — Power BI / Microsoft Fabric developer building Fabric Adoption Monitor and other Power BI custom visuals.

- Website: [www.syedhussnain.com](https://www.syedhussnain.com)
- Email: [Contact@syedhussnain.com](mailto:Contact@syedhussnain.com)
- LinkedIn: [linkedin.com/in/hussnainsherazi](https://www.linkedin.com/in/hussnainsherazi)
- GitHub: [github.com/hussnaintahir13](https://github.com/hussnaintahir13)
