export interface UserStates {
    id?: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface NormalResponse {
    message: string;
    success: boolean;
    error?: any;
    data?: any;
}
