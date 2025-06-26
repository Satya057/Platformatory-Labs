import { UserRepository } from '../../database/userRepository';
import axios from 'axios';

export interface ProfileUpdateData {
  userId: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
}

export async function saveToDatabaseActivity(data: ProfileUpdateData): Promise<string> {
  try {
    console.log('🔄 Saving profile data to database for user:', data.userId);
    
    // Update user profile in database
    const updateResult = await UserRepository.updateProfile(data.userId, {
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phoneNumber,
      city: data.city,
      pincode: data.pincode
    });

    if (!updateResult) {
      throw new Error('Failed to update user profile in database');
    }

    // Update the profile update record status
    await UserRepository.updateProfileUpdateStatusByUserId(data.userId, 'completed');

    console.log('✅ Database update successful for user:', data.userId);
    return `Database updated successfully for user ${data.userId}`;
  } catch (error) {
    console.error('❌ Database update failed:', error);
    
    // Update status to failed
    try {
      await UserRepository.updateProfileUpdateStatusByUserId(data.userId, 'failed');
    } catch (statusError) {
      console.error('Failed to update status to failed:', statusError);
    }
    
    throw new Error(`Database update failed: ${error}`);
  }
}

export async function updateCrudCrudActivity(data: ProfileUpdateData): Promise<string> {
  try {
    console.log('🔄 Updating CRUD CRUD API for user:', data.userId);
    
    const apiUrl = process.env.CRUDCRUD_API_URL;
    const apiKey = process.env.CRUDCRUD_API_KEY;
    
    if (!apiUrl || !apiKey) {
      throw new Error('CRUD CRUD API configuration missing');
    }

    // Prepare the data for CRUD CRUD API
    const crudData = {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      city: data.city,
      pincode: data.pincode,
      updatedAt: new Date().toISOString(),
      source: 'platformatory-labs-app'
    };

    // Make API call to CRUD CRUD
    const response = await axios.post(`${apiUrl}/${apiKey}/profile-updates`, crudData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('✅ CRUD CRUD API update successful:', response.data);
    return `CRUD CRUD API updated successfully. Response: ${JSON.stringify(response.data)}`;
  } catch (error) {
    console.error('❌ CRUD CRUD API update failed:', error);
    
    // Update status to failed
    try {
      await UserRepository.updateProfileUpdateStatusByUserId(data.userId, 'failed');
    } catch (statusError) {
      console.error('Failed to update status to failed:', statusError);
    }
    
    throw new Error(`CRUD CRUD API update failed: ${error}`);
  }
} 