import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Certificate {
    id: string;
    name: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    getRecentCertificates(): Promise<Array<Certificate>>;
    getTotalPledges(): Promise<bigint>;
    takePledge(name: string, email: string): Promise<Certificate>;
}
