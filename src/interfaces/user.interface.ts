import { Files } from "./files.interface";

export interface PayloadCreateUser {
    name: string;
    email: string;
    password: string;
    logo?: Files;
}

export interface User {
    name: string;
    email: string;
    password: string;
    logo: Buffer;
    createDate: string;
}