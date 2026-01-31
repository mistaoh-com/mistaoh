import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { JWTPayload } from "./types"

const SECRET_KEY = process.env.JWT_SECRET

if (!SECRET_KEY) {
    throw new Error("Please define the JWT_SECRET environment variable inside .env")
}

const key = new TextEncoder().encode(SECRET_KEY)

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

export async function signJWT(payload: JWTPayload, expiresIn: string = "1d") {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key)
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, key)
        return payload as JWTPayload
    } catch (error) {
        return null
    }
}
