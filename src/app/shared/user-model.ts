export class User {
  userId: string;
  email: string;
  password: string;
  nickname: string;
  description: string;
  pictureStorageName: string;
  location: string;
  distance: number;
}

export const FAKE_USER: User = {
  userId: '001',
  email: 'michelle.obama@mail.com',
  password: '****',
  nickname: 'Michelle',
  description: 'Ich bin ein Mädchen, daswegen kann ich micht nicht zurückhalten so sexy sieht der Martin aus',
  pictureStorageName: 'storage',
  location: 'home',
  distance: 500,
};
