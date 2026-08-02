import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const PEPPER = process.env.PASSWORD_PEPPER;
const CURRENT_HASH_VERSION = 1;

export class PasswordService {

  static async hashPassword(password) {
    const peppered = password + PEPPER;
    const hash = await bcrypt.hash(peppered, 12);

    return {
      hash,
      version: CURRENT_HASH_VERSION,
    };
  }

  static async verifyPassword(plainPassword, user) {
    const peppered = plainPassword + PEPPER;

    const isMatch = await bcrypt.compare(peppered, user.passwordHash);
    if (!isMatch) return false;

    if (user.passwordHashVersion !== CURRENT_HASH_VERSION) {
      user._needsPasswordRehash = true;
    }

    return true;
  }

  static async rehashIfNeeded(user, plainPassword) {
    if (!user._needsPasswordRehash) return;

    const { hash, version } = await PasswordService.hashPassword(plainPassword);

    user.passwordHistory.push({
      hash: user.passwordHash,
      version: user.passwordHashVersion,
      changedAt: new Date(),
    });

    user.passwordHash = hash;
    user.passwordHashVersion = version;
    user.passwordChangedAt = new Date();

    delete user._needsPasswordRehash;
    await user.save();
  }

  static async isPasswordReused(plainPassword, user) {
    const peppered = plainPassword + PEPPER;

    for (const old of user.passwordHistory.slice(-3)) {
      const match = await bcrypt.compare(peppered, old.hash);
      if (match) return true;
    }

    return false;
  }
}
