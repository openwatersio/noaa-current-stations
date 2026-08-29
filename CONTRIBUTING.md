# Contributing

```bash
git clone https://github.com/openwatersio/noaa-current-stations.git
cd noaa-current-stations
npm install
npm test
npm run validate:bundle
npm pack --dry-run
```

Keep the package dependency-free. `currents.json` is the reviewable source bundle and
is intentionally outside the npm tarball.
