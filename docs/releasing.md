# Releasing

Each release ships the npm package (code, schema, and docs) and a minified
`currents.json` GitHub release asset. The reviewable `currents.json` source bundle stays
outside the npm tarball.

```bash
npm test
npm run bundle:min
npm run validate:bundle
npm pack --dry-run

mkdir -p /tmp/noaa-current-stations-release
cp currents.min.json /tmp/noaa-current-stations-release/currents.json
gh release create vX.Y.Z --notes "..."
gh release upload vX.Y.Z /tmp/noaa-current-stations-release/currents.json
gh release download vX.Y.Z --pattern currents.json --output /tmp/currents.json --clobber
```

Run `node bin/noaa-current-stations.mjs check` before releasing a stale bundle. The scheduled
`update-stations` workflow creates a review issue when NOAA's station list changes.

## First publish

Publish `@openwaters/noaa-current-stations` once with an OTP, then configure npm Trusted
Publishing for `openwatersio/noaa-current-stations`, workflow `publish.yml`, with no
environment. Later GitHub releases publish through OIDC.
