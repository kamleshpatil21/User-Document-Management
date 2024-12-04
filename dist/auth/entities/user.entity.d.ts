export declare class User {
    id: number;
    email: string;
    password: string;
    role: 'admin' | 'editor' | 'viewer';
    createDateTime: Date;
}
