"use strict";
/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Lewis Daly <lewis@vesselstech.com>
 --------------
 ******/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const boom_1 = __importDefault(require("@hapi/boom"));
const ErrorHandling = require('@mojaloop/central-services-error-handling');
const Logger = require('@mojaloop/central-services-shared').Logger;
const { responseCode, statusEnum } = require('@mojaloop/central-services-shared').HealthCheck.HealthCheckEnums;
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
const defaultHealthHandler = (healthCheck) => {
    return (_, h) => __awaiter(this, void 0, void 0, function* () {
        let responseBody;
        let code = responseCode.success;
        try {
            responseBody = yield healthCheck.getHealth();
        }
        catch (err) {
            Logger.error(err.message);
        }
        if (!responseBody || responseBody.status !== statusEnum.OK) {
            // Gateway Error
            code = responseCode.gatewayTimeout;
        }
        return h.response(responseBody).code(code);
    });
};
exports.defaultHealthHandler = defaultHealthHandler;
/**
 * @function failAction
 *
 * @description the failure handler for Hapi. We put this here to make it more testable
 *
 */
const failAction = (_request, _handler, err) => __awaiter(this, void 0, void 0, function* () {
    if (!err) {
        throw boom_1.default.boomify(new Error(`Unknown Server Error`));
    }
    throw boom_1.default.boomify(err);
});
exports.failAction = failAction;
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
const createHealthCheckServer = (port, healthCheckHandler) => __awaiter(this, void 0, void 0, function* () {
    //@ts-ignore - type defs are wrong
    const server = hapi_1.default.server({
        port,
        routes: {
            validate: {
                options: ErrorHandling.validateRoutes(),
                failAction: failAction
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/health',
        handler: healthCheckHandler
    });
    yield server.start();
    Logger.info(`Health Check Server running on ${server.info.uri}`);
    return server;
});
exports.createHealthCheckServer = createHealthCheckServer;
//# sourceMappingURL=HealthCheckServer.js.map