import UserModel from '../schemas/user.schema';
import { IUser } from "../models/user.model";
import logger from "../../utils/logger";

class UserService {
    public async createNewOrUpdate(user: IUser) {
        try {
            if (!user._id) {
                const dataModel = new UserModel(user);
                const savedUser = await dataModel.save();

                logger.info(`New user registered: ${savedUser.email || savedUser.name} (ID: ${savedUser._id})`);
                return savedUser;
            } else {
                const updatedUser = await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });

                if (updatedUser) {
                    logger.info(`User profile updated: ${updatedUser.email || updatedUser.name} (ID: ${user._id})`);
                }
                return updatedUser;
            }
        } catch (error: any) {
            logger.error(`Error in UserService (createNewOrUpdate): ${error.message}`);
            throw new Error('Error in Data Create');
        }
    }

    public async getByEmailOrName(name: string) {
        try {
            const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });

            if (result) {
                logger.debug(`User found in database: ${name}`);
                return result;
            } else {
                logger.debug(`User not found in database: ${name}`);
                return null;
            }
        } catch (error: any) {
            logger.error(`Error in UserService (getByEmailOrName) for [${name}]: ${error.message}`);
            throw new Error('Error in Data Fetching');
        }
    }
}

export default UserService;