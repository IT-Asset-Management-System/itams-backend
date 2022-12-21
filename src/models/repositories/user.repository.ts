import UserEntity from '../entities/user.enitity';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<UserEntity> {}
