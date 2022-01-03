export interface IMailRequest {
    to: string;
    subject: string;
    html?: string,
    secretKey?: string
}
