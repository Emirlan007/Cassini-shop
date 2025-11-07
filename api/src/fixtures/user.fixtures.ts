import { UserService } from '../users/user.service';
import { randomUUID } from 'crypto';

export async function createUserFixtures(userService: UserService) {
  console.log('Creating users...');

  return await userService.createMany([
    {
      email: 'user@test.com',
      password: '123',
      displayName: 'Test User',
      phoneNumber: '+12312123123',
      token: randomUUID(),
      role: 'user',
    },
    {
      email: 'admin@test.com',
      password: '123',
      displayName: 'Admin User',
      phoneNumber: '+99999999999',
      token: randomUUID(),
      role: 'admin',
    },
  ]);
}
