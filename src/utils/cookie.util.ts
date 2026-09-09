import { Response } from 'express';

export const setCookie = (res: Response, name: string, value: string): void => {
    res.cookie(name, value, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const clearCookie = (res: Response, name: string): void => {
    res.clearCookie(name, {
        httpOnly: true,
        sameSite: 'strict',
    });
};

export default {
    setCookie,
    clearCookie,
};
