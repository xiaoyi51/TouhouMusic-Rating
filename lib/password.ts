import bcrypt from "bcryptjs";

/**
 * 加密密码
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

/**
 * 验证密码
 */
export async function verifyPassword(
  password: string,
  hash: string
) {
  return bcrypt.compare(password, hash);
}