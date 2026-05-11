# Suggested Data Model

A practical star schema for feeding the Fabric Adoption Monitor.

## Tables

| Table | Grain | Key columns |
| --- | --- | --- |
| `Usage` | one row per user × report × day | `Date`, `UserPrincipalName`, `ReportId`, `ViewCount` |
| `Users` | one row per provisioned user | `UserPrincipalName`, `Department`, `LicenseSku` |
| `Reports` | one row per report | `ReportId`, `WorkspaceId`, `ReportName`, `ViewCount`, `LastViewedDate` |
| `Workspaces` | one row per workspace | `WorkspaceId`, `WorkspaceName`, `Tier` |
| `Datasets` | one row per dataset | `DatasetId`, `WorkspaceId`, `Endorsement` (Certified / Promoted / None) |
| `RefreshHistory` | one row per refresh attempt | `DatasetId`, `RefreshTime`, `Status` |

## Relationships

- `Usage[ReportId]` → `Reports[ReportId]` (many → one)
- `Reports[WorkspaceId]` → `Workspaces[WorkspaceId]` (many → one)
- `Datasets[WorkspaceId]` → `Workspaces[WorkspaceId]` (many → one)
- `RefreshHistory[DatasetId]` → `Datasets[DatasetId]` (many → one)
- A standard date dimension table connected to `Usage[Date]` and `RefreshHistory[RefreshTime]`.

## Notes

- `Users` is the denominator for adoption — it should reflect provisioned licences, not just users who logged in.
- For `Inactive Users` you can either keep an explicit measure or let the visual derive it from `Total Users - Active Users`.
- For `Previous Report Views`, use a time-intelligence measure (`DATEADD`, `PARALLELPERIOD`) to compute the prior period.
