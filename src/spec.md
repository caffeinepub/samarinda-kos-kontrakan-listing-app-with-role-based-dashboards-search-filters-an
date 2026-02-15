# Specification

## Summary
**Goal:** Update the public listings Location filter to use a fixed set of 10 locations in a specific order and allow multi-select, while preserving an explicit “All locations” option that disables location filtering.

**Planned changes:**
- Replace the current Location filter options with “All locations” plus the fixed ordered list: Samarinda Kota, Samarinda Ulu, Samarinda Ilir, Samarinda Seberang, Samarinda Utara, Sungai Pinang, Sungai Kunjang, Palaran, Sambutan, Loa Janan Ilir.
- Update the Location filter UI to support selecting multiple specific locations, with “All locations” acting as a mutually exclusive fallback/disable option.
- Update the listings filtering logic so selected locations are treated as an OR match (include listings whose location matches any selected location), while keeping all other filters and behaviors unchanged.

**User-visible outcome:** On the public listings page, users can pick multiple locations from a fixed ordered list; selecting “All locations” shows listings without location filtering, and the UI automatically toggles between “All locations” and specific selections appropriately.
