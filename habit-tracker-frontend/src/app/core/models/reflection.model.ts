import { User } from "./user.model";

export interface Reflection {
    id: number;
    user: User;
    inputText: string;
    date: Date;
}
