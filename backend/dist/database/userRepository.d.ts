export interface User {
    id: number;
    email: string;
    google_id?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    city?: string;
    pincode?: string;
    created_at: string;
    updated_at: string;
}
export interface ProfileUpdate {
    id: number;
    user_id: number;
    workflow_id: string;
    update_data: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}
export declare class UserRepository {
    static findByEmail(email: string): Promise<User | null>;
    static findByGoogleId(googleId: string): Promise<User | null>;
    static findById(id: number): Promise<User | null>;
    static create(userData: Partial<User>): Promise<User>;
    static updateProfile(userId: number, profileData: Partial<User>): Promise<User>;
    static upsertFromOAuth(oauthData: {
        email: string;
        google_id: string;
        first_name?: string;
        last_name?: string;
    }): Promise<User>;
    static createProfileUpdate(updateData: {
        user_id: number;
        workflow_id: string;
        update_data: string;
    }): Promise<ProfileUpdate>;
    static updateProfileUpdateStatus(workflowId: string, status: string): Promise<void>;
    static updateProfileUpdateStatusByUserId(userId: number, status: string): Promise<void>;
    static getProfileUpdateByWorkflowId(workflowId: string): Promise<ProfileUpdate | null>;
}
//# sourceMappingURL=userRepository.d.ts.map