import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
        userId?: string;
        id?: string;
        _id?: string;
    };
}