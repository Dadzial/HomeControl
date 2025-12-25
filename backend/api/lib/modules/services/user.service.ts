import  UserModel  from '../schemas/user.schema';
import {IUser} from "../models/user.model";

class UserService {
   public async createNewOrUpdate(user: IUser) {
   
       try {
           if (!user._id) {
               const dataModel = new UserModel(user);
               return await dataModel.save();
           } else {
               return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
           }
       } catch (error) {
           console.error('Error in Data Create:', error);
           throw new Error('Error in Data Create');
       }
   }

   public async getByEmailOrName(name: string) {
       try {
        const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
           if (result) {
               return result;
           }
       } catch (error) {
           console.error('Error in Data Create:', error);
           throw new Error('Error in Data Create');
       }
   }
}

export default UserService;
