import jwt from 'jsonwebtoken';
import TokenModel from '../schemas/token.schema';
import { config } from '../../config';
import logger from "../../utils/logger";

class TokenService {
    public async create(user: any) {
        const access = 'auth';
        const userData = {
            userId: user.id,
            name: user.name,
            role: user.role,
            isAdmin: user.isAdmin,
            access: access
        };


        const value = jwt.sign(
            userData,
            config.JwtSecret,
            {
                expiresIn: '3h'
            });

        try {
            const result = await new TokenModel({
                userId: user.id,
                type: 'authorization',
                value,
                createDate: new Date().getTime()
            }).save();

            if (result) {
                logger.info(`New authorization token created for user: ${user.name} (ID: ${user.id})`);
                return result;
            }
        } catch (error: any) {
            logger.error(`Database Error while saving token for user [${user.id}]: ${error.message}`);
            throw new Error('Error in create Data');
        }
    }

    public getToken(token: any) {
        return { token: token.value };
    }

    public async remove(userId: string) {
        try {
            const result = await TokenModel.deleteOne({ userId: userId });

            if (result.deletedCount === 0) {
                logger.warn(`Logout attempt: No active token found to delete for userId [${userId}]`);
                throw new Error('Error in remove Data');
            }

            logger.info(`Token successfully removed (logout) for userId: ${userId}`);
            return result;
        } catch (error: any) {
            logger.error(`Error while removing token for userId [${userId}]: ${error.message}`);
            throw new Error('Error while removing token');
        }
    }
}

export default TokenService;