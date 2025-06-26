"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdateWorkflow = profileUpdateWorkflow;
const workflow_1 = require("@temporalio/workflow");
const { saveToDatabaseActivity, updateCrudCrudActivity } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: '1 minute',
});
async function profileUpdateWorkflow(data) {
    try {
        console.log('🔄 Starting profile update workflow for user:', data.userId);
        const dbResult = await saveToDatabaseActivity(data);
        console.log('✅ Database update completed:', dbResult);
        console.log('⏳ Waiting 10 seconds before updating CRUD CRUD API...');
        await (0, workflow_1.sleep)('10 seconds');
        console.log('🔄 Updating CRUD CRUD API...');
        const crudResult = await updateCrudCrudActivity(data);
        console.log('✅ CRUD CRUD API update completed:', crudResult);
        return `Profile update completed successfully. Database: ${dbResult}, CRUD CRUD: ${crudResult}`;
    }
    catch (error) {
        console.error('❌ Profile update workflow failed:', error);
        throw new Error(`Profile update workflow failed: ${error}`);
    }
}
//# sourceMappingURL=profileUpdate.js.map