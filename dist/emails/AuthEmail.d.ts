type EmailType = {
    name: string;
    email: string;
    token: string;
};
export declare class AuthEmail {
    static sendConfirmationEmail: (user: EmailType) => Promise<void>;
    static sendRecoverPasswordMail: (user: EmailType) => Promise<void>;
}
export {};
