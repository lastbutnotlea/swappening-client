export class User {
  userId: string;
  email: string;
  password: string;
  nickname: string;
  pictureStorageName: string;
  location: string;
  distance: number;
}

export const FAKE_USER: User = {
  userId: '001',
  email: 'michelle.obama@mail.com',
  password: '****',
  nickname: 'Michelle',
  pictureStorageName: 'storage',
  location: 'home',
  distance: 500,
};
