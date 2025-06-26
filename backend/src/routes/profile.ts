import { Router, Request, Response } from 'express';
import { UserRepository, User } from '../database/userRepository';
import { getTemporalClient } from '../temporal/init';
import { profileUpdateWorkflow } from '../temporal/workflows/profileUpdate';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get user profile
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await UserRepository.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const { google_id, ...profileData } = user;

    return res.json({ profile: profileData });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { firstName, lastName, phoneNumber, city, pincode } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Generate workflow ID
    const workflowId = `profile-update-${userId}-${uuidv4()}`;

    // Create profile update record
    const updateData = {
      user_id: userId,
      workflow_id: workflowId,
      update_data: JSON.stringify({
        firstName,
        lastName,
        phoneNumber,
        city,
        pincode
      })
    };

    await UserRepository.createProfileUpdate(updateData);

    // Start Temporal workflow
    const client = getTemporalClient();
    
    const handle = await client.workflow.start(profileUpdateWorkflow, {
      taskQueue: 'profile-updates',
      workflowId: workflowId,
      args: [{
        userId,
        firstName,
        lastName,
        phoneNumber,
        city,
        pincode
      }]
    });

    console.log(`🚀 Started workflow ${workflowId} for user ${userId}`);

    return res.json({
      message: 'Profile update initiated',
      workflowId: workflowId,
      status: 'pending'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get profile update status
router.get('/update-status/:workflowId', async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const updateRecord = await UserRepository.getProfileUpdateByWorkflowId(workflowId);

    if (!updateRecord) {
      return res.status(404).json({ error: 'Update record not found' });
    }

    // Check if user owns this update
    if (updateRecord.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json({
      workflowId: updateRecord.workflow_id,
      status: updateRecord.status,
      createdAt: updateRecord.created_at,
      updatedAt: updateRecord.updated_at
    });

  } catch (error) {
    console.error('Get update status error:', error);
    return res.status(500).json({ error: 'Failed to get update status' });
  }
});

// Get user's update history
router.get('/update-history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // This would require adding a method to UserRepository
    // For now, we'll return a simple response
    return res.json({
      message: 'Update history feature coming soon',
      userId: userId
    });

  } catch (error) {
    console.error('Get update history error:', error);
    return res.status(500).json({ error: 'Failed to get update history' });
  }
});

export default router; 