export interface UserBeforeCreation {
    username: string;
    email: string;
    phone: string;
    password: string;
}

export interface UserAfterCreation extends UserBeforeCreation {
    username: string;
    email: string;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface NormalResponse {
    message: string;
    success: boolean;
    error?: any;
    data?: any;
}
