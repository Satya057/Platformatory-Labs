import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from '../activities/profileActivities';

const { saveToDatabaseActivity, updateCrudCrudActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export interface ProfileUpdateData {
  userId: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
}

export async function profileUpdateWorkflow(data: ProfileUpdateData): Promise<string> {
  try {
    // Step 1: Save to database immediately
    console.log('🔄 Starting profile update workflow for user:', data.userId);
    
    const dbResult = await saveToDatabaseActivity(data);
    console.log('✅ Database update completed:', dbResult);

    // Step 2: Wait for 10 seconds as required
    console.log('⏳ Waiting 10 seconds before updating CRUD CRUD API...');
    await sleep('10 seconds');

    // Step 3: Update CRUD CRUD API
    console.log('🔄 Updating CRUD CRUD API...');
    const crudResult = await updateCrudCrudActivity(data);
    console.log('✅ CRUD CRUD API update completed:', crudResult);

    return `Profile update completed successfully. Database: ${dbResult}, CRUD CRUD: ${crudResult}`;
  } catch (error) {
    console.error('❌ Profile update workflow failed:', error);
    throw new Error(`Profile update workflow failed: ${error}`);
  }
} 