# central-services-health
[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/central-services-health.svg?style=flat)](https://github.com/mojaloop/central-services-health/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/central-services-health.svg?style=flat)](https://github.com/mojaloop/central-services-health/releases)
[![Npm Version](https://img.shields.io/npm/v/@mojaloop/central-services-health.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/central-services-health)
[![NPM Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mojaloop/central-services-health.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/central-services-health)
[![CircleCI](https://circleci.com/gh/mojaloop/central-services-health.svg?style=svg)](https://circleci.com/gh/mojaloop/central-services-health)

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
