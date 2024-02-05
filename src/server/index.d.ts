import { User } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";

declare module "koa" {
    interface BaseContext {
        user: UserModel;
    }
}