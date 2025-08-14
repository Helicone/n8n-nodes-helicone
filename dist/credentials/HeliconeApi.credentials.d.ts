import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class HeliconeApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
