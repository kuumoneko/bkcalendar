export async function hash(password: string) {
    return await Bun.password.hash(password, { algorithm: "bcrypt", cost: 12 });
}

export async function verify(password: string, hased: string) {
    return await Bun.password.verify(password, hased);
}
