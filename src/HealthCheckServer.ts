/*****
 License
 --------------
 Copyright © 2020-2025 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Mojaloop Foundation for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.

 * Mojaloop Foundation
 - Name Surname <name.surname@mojaloop.io>

 * VESSELS Tech
 * Lewis Daly <lewis@vesselstech.com>
 --------------
******/

'use strict'

import Hapi, { Lifecycle, ResponseObject } from '@hapi/hapi'
const ErrorHandler = require('@mojaloop/central-services-error-handling')
const Logger = require('@mojaloop/central-services-logger')

import { ResponseCode, Status } from './Enums'

/**
 * @function defaultHealthHandler
 *
 * @description Given a health check object, return the default
 *   handler for responding to health checks
 *
 * @param {BaseHealthCheck} healthCheck - the BaseHealthCheck subclass
 *
 * @returns {async (response, h) => any} handler - the HapiJS compatible handler for the health check
 */
const defaultHealthHandler = (healthCheck: any): Lifecycle.Method => {
  return async (_, h): Promise<ResponseObject> => {
    let responseBody: any
    let code = ResponseCode.success
    try {
      responseBody = await healthCheck.getHealth()
    } catch (err) {
      Logger.error(err.message)
    }

    if (responseBody?.status !== Status.OK) {
      // Gateway Error
      code = ResponseCode.gatewayTimeout
    }

    return h.response(responseBody).code(code)
  }
}

/**
 * @function failAction
 *
 * @description the failure handler for Hapi. We put this here to make it more testable
 *
 */
const failAction = async (_request: Hapi.Request, _handler: Hapi.ResponseToolkit, err?: Error | any): Promise<void> => {
  throw ErrorHandler.Factory.createFSPIOPErrorFromJoiError(err)
}

/**
 * @function createHealthCheckServer
 *
 * @description Creates the Hapi HTTP Health check server
 *
 * @param {number} port Port to register the Server against
 * @param {async (response, h) => any} healthCheckHandler A handler that handles HapiJS requests for health
 *
 * @returns {*} server - a HapiJS Server object
 */

const createHealthCheckServer = async (port: string, healthCheckHandler: Lifecycle.Method): Promise<Hapi.Server> => {
  const server = Hapi.server({
    port,
    routes: {
      validate: {
        options: ErrorHandler.validateRoutes(),
        failAction: failAction
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/health',
    handler: healthCheckHandler
  })

  await server.start()
  Logger.info(`Health Check Server running on ${server.info.uri}`)
  return server
}

export { createHealthCheckServer, defaultHealthHandler, failAction }
