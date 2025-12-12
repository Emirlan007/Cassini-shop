import { UserService } from '../users/user.service';
import { randomUUID } from 'crypto';

export async function createUserFixtures(userService: UserService) {
  console.log('Creating users...');

  return await userService.createMany([
    {
      name: 'Test User',
      phoneNumber: '+99612123123',
      token: randomUUID(),
      role: 'user',
    },
    {
      name: 'Admin User',
      phoneNumber: '+99699999999',
      token: randomUUID(),
      role: 'admin',
    },
  ]);
}
