const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN!;

export {
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN
}