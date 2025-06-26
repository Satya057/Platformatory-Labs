export interface ProfileUpdateData {
    userId: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    city?: string;
    pincode?: string;
}
export declare function saveToDatabaseActivity(data: ProfileUpdateData): Promise<string>;
export declare function updateCrudCrudActivity(data: ProfileUpdateData): Promise<string>;
//# sourceMappingURL=profileActivities.d.ts.map