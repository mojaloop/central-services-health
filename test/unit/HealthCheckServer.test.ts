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
 - Lewis Daly <lewis@vesselstech.com>

 --------------
******/

'use strict'

import { SinonSandbox, createSandbox } from 'sinon'
import tape from 'tape'
import Hapi from '@hapi/hapi'
import { createHealthCheckServer, defaultHealthHandler, failAction } from '../../src/HealthCheckServer'
import { ResponseCode } from '../../src/Enums'

const Test = require('tapes')(require('tape'))
const ErrorEnums = require('@mojaloop/central-services-error-handling').Enums

Test('HealthCheckServer test', (healthCheckServerTest: any) => {
  let sandbox: SinonSandbox

  healthCheckServerTest.beforeEach((t: any) => {
    sandbox = createSandbox()
    sandbox.stub(Hapi, 'server')
    t.end()
  })

  healthCheckServerTest.afterEach((t: any) => {
    sandbox.restore()
    t.end()
  })

  healthCheckServerTest.test('defaultHealthHandler', (defaultHealthHandlerTest: any) => {
    defaultHealthHandlerTest.test('returns the default health handler', async (test: tape.Test) => {
      // Arrange
      const healthCheck = {
        getHealth: sandbox.stub().resolves({})
      }
      const codeStub = sandbox.stub()
      const responseStub = sandbox.stub().returns({ code: codeStub })
      const request: any = null
      const h: any = {
        response: responseStub
      }

      // Act
      const handler = defaultHealthHandler(healthCheck)
      await handler.call(null, request, h)

      // Assert
      test.ok(codeStub.called, 'codeStub has been called')
      test.ok(responseStub.called, 'responseStub has been called')
      test.end()
    })

    defaultHealthHandlerTest.test('still calls response if health check fails', async (test: tape.Test) => {
      // Arrange
      const healthCheck = {
        getHealth: sandbox.stub().throws(new Error('Get health failed'))
      }
      const codeStub = sandbox.stub()
      const responseStub = sandbox.stub().returns({ code: codeStub })
      const request: any = null
      const h: any = {
        response: responseStub
      }

      // Act
      const handler = defaultHealthHandler(healthCheck)
      await handler.call(null, request, h)

      // Assert
      test.ok(codeStub.called, 'codeStub has been called')
      test.ok(responseStub.called, 'responseStub has been called')
      test.end()
    })

    defaultHealthHandlerTest.test('health check fails when sub-service check fails', async (test: tape.Test) => {
      // Arrange
      const healthCheck = {
        getHealth: sandbox.stub().resolves({ service: 'datastore', status: 'DOWN' })
      }
      const codeStub = sandbox.stub()
      const responseStub = sandbox.stub().returns({ code: codeStub })
      const request: any = null
      const h: any = {
        response: responseStub
      }

      // Act
      const handler = defaultHealthHandler(healthCheck)
      await handler.call(null, request, h)

      // Assert
      test.ok(codeStub.calledWith(ResponseCode.gatewayTimeout), 'codeStub has been called')
      test.ok(responseStub.called, 'responseStub has been called')
      test.end()
    })

    defaultHealthHandlerTest.test('health check passes with OK status', async (test: tape.Test) => {
      // Arrange
      const healthCheck = {
        getHealth: sandbox.stub().resolves({ status: 'OK' })
      }
      const codeStub = sandbox.stub()
      const responseStub = sandbox.stub().returns({ code: codeStub })
      const request: any = null
      const h: any = {
        response: responseStub
      }

      // Act
      const handler = defaultHealthHandler(healthCheck)
      await handler.call(null, request, h)

      // Assert
      test.ok(codeStub.called, 'codeStub has been called')
      test.ok(responseStub.called, 'responseStub has been called')
      test.end()
    })

    defaultHealthHandlerTest.end()
  })

  healthCheckServerTest.test('createHealthCheckServer', (createHealthCheckServerTest: tape.Test) => {
    createHealthCheckServerTest.test('starts the server', async (test) => {
      // Arrange
      const routeStub = sandbox.stub()
      const startStub = sandbox.stub()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Hapi.server.returns({
        route: routeStub,
        start: startStub,
        info: {
          uri: 'localhost:1234'
        }
      })

      // Act
      const handler: any = () => {
        //
      }
      await createHealthCheckServer('1234', handler)

      // Assert
      test.ok(routeStub.called, 'routeStub has been called')
      test.ok(startStub.called, 'startStub has been called')
      test.end()
    })

    createHealthCheckServerTest.end()
  })

  healthCheckServerTest.test('failAction', (failActionTest: tape.Test) => {
    failActionTest.test('Throws the error', async (test: tape.Test) => {
      // Arrange
      const error = {
        type: 'any.required',
        context: {
          label: 'Field is required'
        }
      }
      const request: any = null
      const handler: any = null

      // Act
      try {
        await failAction(request, handler, error)
        test.fail('Should have thrown an exception')
      } catch (err) {
        // Assert
        const {
          errorInformation: { errorCode }
        } = err.toApiErrorObject()

        test.equal(
          errorCode,
          ErrorEnums.FSPIOPErrorCodes.MISSING_ELEMENT.code,
          '`errorCode` should match from error-handling library.'
        )
        test.pass('Errors thrown correctly')
      }

      test.end()
    })

    failActionTest.end()
  })

  healthCheckServerTest.end()
})
