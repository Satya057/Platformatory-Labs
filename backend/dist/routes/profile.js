"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRepository_1 = require("../database/userRepository");
const init_1 = require("../temporal/init");
const profileUpdate_1 = require("../temporal/workflows/profileUpdate");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const user = await userRepository_1.UserRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { google_id, ...profileData } = user;
        return res.json({ profile: profileData });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ error: 'Failed to get profile' });
    }
});
router.put('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { firstName, lastName, phoneNumber, city, pincode } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).json({ error: 'First name and last name are required' });
        }
        const workflowId = `profile-update-${userId}-${(0, uuid_1.v4)()}`;
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
        await userRepository_1.UserRepository.createProfileUpdate(updateData);
        const client = (0, init_1.getTemporalClient)();
        const handle = await client.workflow.start(profileUpdate_1.profileUpdateWorkflow, {
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
});
router.get('/update-status/:workflowId', async (req, res) => {
    try {
        const { workflowId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const updateRecord = await userRepository_1.UserRepository.getProfileUpdateByWorkflowId(workflowId);
        if (!updateRecord) {
            return res.status(404).json({ error: 'Update record not found' });
        }
        if (updateRecord.user_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        return res.json({
            workflowId: updateRecord.workflow_id,
            status: updateRecord.status,
            createdAt: updateRecord.created_at,
            updatedAt: updateRecord.updated_at
        });
    }
    catch (error) {
        console.error('Get update status error:', error);
        return res.status(500).json({ error: 'Failed to get update status' });
    }
});
router.get('/update-history', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        return res.json({
            message: 'Update history feature coming soon',
            userId: userId
        });
    }
    catch (error) {
        console.error('Get update history error:', error);
        return res.status(500).json({ error: 'Failed to get update history' });
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map