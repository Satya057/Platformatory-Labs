import { Client, Connection } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import { profileUpdateWorkflow } from './workflows/profileUpdate';
import * as activities from './activities/profileActivities';

let client: Client;
let worker: Worker;

export async function initializeTemporal(): Promise<void> {
  try {
    // Create Temporal client
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_HOST || 'localhost:7233',
    });

    client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    });

    // Create and start worker
    worker = await Worker.create({
      workflowsPath: require.resolve('./workflows/profileUpdate'),
      activities,
      taskQueue: 'profile-updates',
      maxConcurrentActivityTaskExecutions: 10,
    });

    await worker.run();
    console.log('✅ Temporal worker started successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Temporal:', error);
    throw error;
  }
}

export function getTemporalClient(): Client {
  if (!client) {
    throw new Error('Temporal client not initialized');
  }
  return client;
}

export async function shutdownTemporal(): Promise<void> {
  try {
    if (worker) {
      await worker.shutdown();
      console.log('✅ Temporal worker shutdown successfully');
    }
  } catch (error) {
    console.error('❌ Error shutting down Temporal worker:', error);
  }
} 