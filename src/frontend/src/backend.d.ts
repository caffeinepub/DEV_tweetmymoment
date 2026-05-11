import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PostRequest {
    event: EventKind;
    customText?: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum EventKind {
    Graduation = "Graduation",
    Promotion = "Promotion",
    Birthday = "Birthday",
    Marriage = "Marriage",
    NewJob = "NewJob",
    NewBaby = "NewBaby",
    Other = "Other"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeXOAuth(code: string, redirectUri: string): Promise<void>;
    disconnectMyX(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    isMyXConnected(): Promise<boolean>;
    isXClientIdConfigured(): Promise<boolean>;
    postEventTweet(req: PostRequest): Promise<string>;
    setXClientId(id: string): Promise<void>;
    startXOAuth(redirectUri: string): Promise<string>;
    xPostTransform(input: TransformationInput): Promise<TransformationOutput>;
    xTransform(input: TransformationInput): Promise<TransformationOutput>;
}
