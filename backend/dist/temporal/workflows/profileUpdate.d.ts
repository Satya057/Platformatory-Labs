export interface ProfileUpdateData {
    userId: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    city?: string;
    pincode?: string;
}
export declare function profileUpdateWorkflow(data: ProfileUpdateData): Promise<string>;
//# sourceMappingURL=profileUpdate.d.ts.map