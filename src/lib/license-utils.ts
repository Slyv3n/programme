import { randomBytes } from "crypto";

export function generateLicenseKey(): string {
    const key = randomBytes(10).toString('hex').toUpperCase();

    return key.match(/.{1,5}/g)!.join('-');
}