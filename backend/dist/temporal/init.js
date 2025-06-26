"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTemporal = initializeTemporal;
exports.getTemporalClient = getTemporalClient;
exports.shutdownTemporal = shutdownTemporal;
const client_1 = require("@temporalio/client");
const worker_1 = require("@temporalio/worker");
const activities = __importStar(require("./activities/profileActivities"));
let client;
let worker;
async function initializeTemporal() {
    try {
        const connection = await client_1.Connection.connect({
            address: process.env.TEMPORAL_HOST || 'localhost:7233',
        });
        client = new client_1.Client({
            connection,
            namespace: process.env.TEMPORAL_NAMESPACE || 'default',
        });
        worker = await worker_1.Worker.create({
            workflowsPath: require.resolve('./workflows/profileUpdate'),
            activities,
            taskQueue: 'profile-updates',
            maxConcurrentActivityTaskExecutions: 10,
        });
        await worker.run();
        console.log('✅ Temporal worker started successfully');
    }
    catch (error) {
        console.error('❌ Failed to initialize Temporal:', error);
        throw error;
    }
}
function getTemporalClient() {
    if (!client) {
        throw new Error('Temporal client not initialized');
    }
    return client;
}
async function shutdownTemporal() {
    try {
        if (worker) {
            await worker.shutdown();
            console.log('✅ Temporal worker shutdown successfully');
        }
    }
    catch (error) {
        console.error('❌ Error shutting down Temporal worker:', error);
    }
}
//# sourceMappingURL=init.js.map