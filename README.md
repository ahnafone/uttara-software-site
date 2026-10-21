# Uttara Website

The Uttara Angular site remains at `/` (including existing routes such as `/castor`). The separately maintained timesheet app is assembled under `/timesheet/` in the same Firebase Hosting site (`uttara-software`, project `timesheet-e8ebf`). The apps remain separate builds and dependencies.

## Requirements and setup

Install dependencies independently in both repositories; the build helper never runs an install command. The Uttara site uses its existing Angular 19 toolchain. The timesheet app uses Angular 22 and requires Node.js `^24.15.0` or `>=26.0.0` (Node 24 recommended).

By default, the build expects `timesheet-app` at `../../timesheet-app` relative to this repository. For a different checkout layout, set `TIMESHEET_APP_DIR` to the timesheet repository directory before running the command. Paths with spaces are supported.

## Build

```bash
npm run build:website  # Uttara alone; use only for local website development
npm run build           # both apps, for the complete Hosting artifact
```

The combined build builds Uttara first, builds timesheet with `/timesheet/` as its base URL, then replaces only `dist/uttara-website/browser/timesheet` with the fresh timesheet output. A failed build or missing source/dependencies exits nonzero. Do not deploy the website-only output: deployment always runs the combined build first.

## Preview and deployment

```bash
npm run preview  # builds and deploys the combined artifact to the preview channel
npm run deploy   # builds and deploys the combined artifact to production Hosting
```

Both commands explicitly target project `timesheet-e8ebf`; the Hosting site is selected by this repository's `firebase.json` (`uttara-software`). Production deploy is limited to the Hosting service configured here (not Firestore or Storage). A coordinated release is required: every website production release replaces the same Hosting artifact and must include the timesheet app. These commands contact Firebase and are not needed to validate builds.

Firebase CLI supports `firebase deploy --only hosting` to limit a deployment to Hosting; this config's `site` selects `uttara-software`. Preview uses `firebase hosting:channel:deploy CHANNEL_ID --project PROJECT_ID`; it stages the configured Hosting site without publishing to its live channel.

## Auth and routing considerations

`/timesheet` temporarily redirects to `/timesheet/`; nested timesheet routes fall back to the timesheet entrypoint, while other unmatched routes retain the Uttara root fallback. The timesheet app uses the same Firebase project; confirm the deployed hostname is present in Firebase Authentication's authorized domains before release. Browser auth persistence is origin-wide, but app navigation is a full-page transition between independent Angular applications. No DNS changes are needed.

## Tests

Run `npm test` for the Uttara app and `npm test` in the timesheet repository for its focused app tests.
