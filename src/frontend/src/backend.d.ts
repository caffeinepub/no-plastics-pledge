import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Certificate {
    id: string;
    name: string;
    timestamp: Time;
}
export interface Pledge {
    name: string;
    email: string;
    certificateId: string;
    timestamp: Time;
}
export interface backendInterface {
    getAdminPledges(password: string): Promise<Array<Pledge>>;
    getRecentCertificates(): Promise<Array<Certificate>>;
    getTotalPledges(): Promise<bigint>;
    takePledge(name: string, email: string): Promise<Certificate>;
}
