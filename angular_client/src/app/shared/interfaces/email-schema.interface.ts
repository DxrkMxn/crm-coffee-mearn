export interface EmailSchemaInterface {
    _id?: string;
    name: string;
    subject: string;
    sendDate: Date;
    templateUrl: string;
}