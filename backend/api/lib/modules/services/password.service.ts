import bcrypt from 'bcrypt';
import PasswordModel from '../schemas/password.schema';
import logger from "../../utils/logger";

class PasswordService {
    async authorize(userId: string, plainPassword: string): Promise<boolean> {
        try {
            const record = await PasswordModel.findOne({ userId });
            if (!record) {
                logger.warn(`Auth attempt failed: No password record for userId [${userId}]`);
                return false;
            }

            const isMatch = await bcrypt.compare(plainPassword, record.password);

            if (!isMatch) {
                logger.warn(`Auth attempt failed: Incorrect password for userId [${userId}]`);
            } else {
                logger.debug(`Password verified successfully for userId [${userId}]`);
            }

            return isMatch;
        } catch (error: any) {
            logger.error(`Authorize Error for userId [${userId}]: ${error.message}`);
            return false;
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            const hashed = await bcrypt.hash(password, saltRounds);
            logger.debug("Password hashed successfully");
            return hashed;
        } catch (error: any) {
            logger.error(`Hashing Error: ${error.message}`);
            throw new Error('Failed to hash password');
        }
    }

    async createOrUpdate({ userId, password }: { userId: string; password: string }): Promise<void> {
        try {
            const existing = await PasswordModel.findOne({ userId });

            if (existing) {
                existing.password = password;
                await existing.save();
                logger.info(`Password updated for userId: ${userId}`);
            } else {
                await PasswordModel.create({ userId, password });
                logger.info(`New password record created for userId: ${userId}`);
            }
        } catch (error: any) {
            logger.error(`CreateOrUpdate Password Error for userId [${userId}]: ${error.message}`);
            throw new Error('Failed to save password');
        }
    }
}

export default PasswordService;