# Fabric Adoption Monitor

A Power BI custom visual for BI managers and Microsoft Fabric admins to communicate adoption, usage, engagement and governance health in a single, dashboard-friendly tile.

## Quick install (no build required)

Grab the latest `.pbiviz` from [`release/`](release/) (use **Download raw file** in GitHub) and import via **Visualizations → … → Import a visual from a file** in Power BI Desktop. Full steps in [`release/README.md`](release/README.md).

## Why it matters

Adoption signals — active users, report views, refresh reliability, certified content — are usually scattered across audit log exports and the Power BI usage metrics dataset. This visual surfaces them as a single 0–100 score, with KPI tiles, a governance risk badge, and a suggested action so admins can act on what they see.

## How it gets its data

It does **not** call the Microsoft Graph or Power BI Admin APIs. Instead, you load adoption data into the Power BI model (audit logs, usage metrics, exported CSVs, Fabric monitoring data) and bind measures to the visual.

## Data fields

| Role | Kind |
| --- | --- |
| Active Users | Measure |
| Total Users | Measure |
| Inactive Users | Measure (auto-derived if missing) |
| Report Views | Measure |
| Previous Report Views | Measure (optional) |
| Workspace Count | Measure |
| Report Count | Measure |
| Unused Report Count | Measure |
| Refresh Failure Count | Measure |
| Certified Dataset Count | Measure |
| Dataset Count | Measure |
| Adoption Score | Measure (optional override) |
| Period Label | Grouping (optional) |
| Category | Grouping (optional) |

## Scoring

If **Adoption Score** is supplied → used directly (clamped 0–100). Otherwise:

```
activeUserRate         = activeUsers / totalUsers × 100
unusedReportPenalty    = unusedReportCount / reportCount × 100
refreshFailurePenalty  = min(40, refreshFailureCount × 5)
certifiedDatasetRate   = certifiedDatasetCount / datasetCount × 100

score = 0.45·activeUserRate
      + 0.20·certifiedDatasetRate
      + 0.20·(100 − unusedReportPenalty)
      + 0.15·(100 − refreshFailurePenalty)
```

## Status thresholds (defaults)

| Range | Status |
| --- | --- |
| ≥ 85 | Excellent Adoption |
| ≥ 70 | Healthy Adoption |
| ≥ 55 | Moderate Adoption |
| ≥ 40 | Low Adoption |
| < 40 | At Risk |

## Example DAX

```DAX
Active Users          = DISTINCTCOUNT('Usage'[UserPrincipalName])
Total Users           = DISTINCTCOUNT('Users'[UserPrincipalName])
Inactive Users        = [Total Users] - [Active Users]
Report Views          = SUM('Usage'[ViewCount])
Previous Report Views = CALCULATE([Report Views], DATEADD('Date'[Date], -1, MONTH))
Unused Reports        = CALCULATE(COUNTROWS('Reports'), 'Reports'[ViewCount] = 0)
Refresh Failures      = CALCULATE(COUNTROWS('RefreshHistory'), 'RefreshHistory'[Status] = "Failed")
Certified Datasets    = CALCULATE(COUNTROWS('Datasets'), 'Datasets'[Endorsement] = "Certified")
```

## Development setup

```bash
npm install
npm install -g powerbi-visuals-tools
pbiviz --create-cert
pbiviz start
pbiviz package
```

## Usage instructions

See [docs/USAGE.md](docs/USAGE.md). For the recommended star schema, see [docs/DATA_MODEL_GUIDE.md](docs/DATA_MODEL_GUIDE.md).

## Test plan

- Empty data — friendly empty state.
- Adoption Score override only.
- Auto-score with every field.
- Missing Total Users — score derived from non-user metrics only.
- Zero reports — no division-by-zero.
- High inactive users — penalty reflected in score.
- Many refresh failures — risk badge flips to High.
- No certified datasets — certified rate contributes 0.
- Compact mode.
- Small mobile tile.
- High-contrast mode.

## AppSource publishing

See [docs/APP_SOURCE_CHECKLIST.md](docs/APP_SOURCE_CHECKLIST.md).

## Roadmap

- Sparkline next to Report Views when a date dimension is supplied.
- Per-workspace drill.
- Localisation.
- "Healthy adoption playbook" link card.

## Contributing

Fork, branch, PR. Include screenshots and reasoning. MIT-licensed.

## Author

Syed Hussnain Tahir Sherazi — Associate Data Engineer, Leicester, UK.
[www.syedhussnain.com](https://www.syedhussnain.com) · [LinkedIn](https://uk.linkedin.com/in/hussnainsherazi) · contact@syedhussnain.co.uk

## License

MIT — see [LICENSE](LICENSE).
