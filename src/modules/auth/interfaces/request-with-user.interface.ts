import { Request } from 'express';
import UserEntity from 'src/models/entities/user.enitity';

interface RequestWithUser extends Request {
  user: UserEntity;
}

export default RequestWithUser;
