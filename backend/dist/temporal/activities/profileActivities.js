"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToDatabaseActivity = saveToDatabaseActivity;
exports.updateCrudCrudActivity = updateCrudCrudActivity;
const userRepository_1 = require("../../database/userRepository");
const axios_1 = __importDefault(require("axios"));
async function saveToDatabaseActivity(data) {
    try {
        console.log('🔄 Saving profile data to database for user:', data.userId);
        const updateResult = await userRepository_1.UserRepository.updateProfile(data.userId, {
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phoneNumber,
            city: data.city,
            pincode: data.pincode
        });
        if (!updateResult) {
            throw new Error('Failed to update user profile in database');
        }
        await userRepository_1.UserRepository.updateProfileUpdateStatusByUserId(data.userId, 'completed');
        console.log('✅ Database update successful for user:', data.userId);
        return `Database updated successfully for user ${data.userId}`;
    }
    catch (error) {
        console.error('❌ Database update failed:', error);
        try {
            await userRepository_1.UserRepository.updateProfileUpdateStatusByUserId(data.userId, 'failed');
        }
        catch (statusError) {
            console.error('Failed to update status to failed:', statusError);
        }
        throw new Error(`Database update failed: ${error}`);
    }
}
async function updateCrudCrudActivity(data) {
    try {
        console.log('🔄 Updating CRUD CRUD API for user:', data.userId);
        const apiUrl = process.env.CRUDCRUD_API_URL;
        const apiKey = process.env.CRUDCRUD_API_KEY;
        if (!apiUrl || !apiKey) {
            throw new Error('CRUD CRUD API configuration missing');
        }
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
        const response = await axios_1.default.post(`${apiUrl}/${apiKey}/profile-updates`, crudData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000
        });
        console.log('✅ CRUD CRUD API update successful:', response.data);
        return `CRUD CRUD API updated successfully. Response: ${JSON.stringify(response.data)}`;
    }
    catch (error) {
        console.error('❌ CRUD CRUD API update failed:', error);
        try {
            await userRepository_1.UserRepository.updateProfileUpdateStatusByUserId(data.userId, 'failed');
        }
        catch (statusError) {
            console.error('Failed to update status to failed:', statusError);
        }
        throw new Error(`CRUD CRUD API update failed: ${error}`);
    }
}
//# sourceMappingURL=profileActivities.js.map