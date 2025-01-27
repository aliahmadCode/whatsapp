export interface UserBeforeCreation {
    username: string;
    email: string;
    phone: number;
    password: string;
}

export interface UserAfterCreation extends UserBeforeCreation {
    username: string;
    email: string;
    phone: number;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
