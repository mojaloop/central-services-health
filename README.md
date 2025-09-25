# central-services-health
[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/central-services-health.svg?style=flat)](https://github.com/mojaloop/central-services-health/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/central-services-health.svg?style=flat)](https://github.com/mojaloop/central-services-health/releases)
[![Npm Version](https://img.shields.io/npm/v/@mojaloop/central-services-health.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/central-services-health)
[![NPM Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mojaloop/central-services-health.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/central-services-health)
[![CircleCI](https://circleci.com/gh/mojaloop/central-services-health.svg?style=svg)](https://circleci.com/gh/mojaloop/central-services-health)

## CI/CD

This repository uses the [mojaloop/build](https://github.com/mojaloop/ci-config-orb-build) CircleCI orb for standardized CI/CD workflows, including automated Grype vulnerability scanning for source code security.

## Installation

```bash
npm install @mojaloop/central-services-health
```

## Usage

//TODO: rewrite example usage

<!--
Import HealthCheck Library
```js
const Metrics = require('@mojaloop/central-services-metrics')
```

Set configuration options:
```javascript
let config = {
    "timeout": 5000, // Set the timeout in ms for the underlying prom-client library. Default is '5000'.
    "prefix": "<PREFIX>", // Set prefix for all defined metrics names
    "defaultLabels": { // Set default labels that will be applied to all metrics
        "serviceName": "<NAME_OF_SERVICE>"
    }
}
```

Initialise Metrics library:
```JAVASCRIPT
Metrics.setup(config)

```

Example instrumentation:
```javascript
const exampleFunction = async (error, message) => {
    const histTimerEnd = Metrics.getHistogram( // Create a new Histogram instrumentation
      'exampleFunctionMetric', // Name of metric. Note that this name will be concatenated after the prefix set in the config. i.e. '<PREFIX>_exampleFunctionMetric'
      'Instrumentation for exampleFunction', // Description of metric
      ['success'] // Define a custom label 'success'
    ).startTimer() // Start instrumentation
    
    try {
        Logger.info('do something meaningful here')
        histTimerEnd({success: true}) // End the instrumentation & set custom label 'success=true'
    } catch (e) {
        histTimerEnd({success: false}) // End the instrumentation & set custom label 'success=false'
    }
}
```
-->

## Auditing Dependencies

We use `npm-audit-resolver` along with `npm audit` to check dependencies for vulnerabilities, and keep track of resolved dependencies with an `audit-resolv.json` file.

To start a new resolution process, run:

```bash
npm run audit:resolve
```

You can then check to see if the CI will pass based on the current dependencies with:

```bash
npm run audit:check
```

And commit the changed `audit-resolv.json` to ensure that CircleCI will build correctly.

## Automated Releases

As part of our CI/CD process, we use a combination of CircleCI, standard-version
npm package and github-release CircleCI orb to automatically trigger our releases
and image builds. This process essentially mimics a manual tag and release.

On a merge to master, CircleCI is configured to use the mojaloopci github account
to push the latest generated CHANGELOG and package version number.

Once those changes are pushed, CircleCI will pull the updated master, tag and
push a release triggering another subsequent build that also publishes a docker image.

### Potential problems

* There is a case where the merge to master workflow will resolve successfully, triggering
  a release. Then that tagged release workflow subsequently failing due to the image scan,
  audit check, vulnerability check or other "live" checks.

  This will leave master without an associated published build. Fixes that require
  a new merge will essentially cause a skip in version number or require a clean up
  of the master branch to the commit before the CHANGELOG and bump.

  This may be resolved by relying solely on the previous checks of the
  merge to master workflow to assume that our tagged release is of sound quality.
  We are still mulling over this solution since catching bugs/vulnerabilities/etc earlier
  is a boon.

* It is unknown if a race condition might occur with multiple merges with master in
  quick succession, but this is a suspected edge case.
