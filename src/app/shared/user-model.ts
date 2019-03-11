export class User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  description: string;
  pictureStorageName: string;
  location: string;
  distance: number;
}

export const FAKE_USER: User = {
  id: 1,
  email: "michelle.obama@mail.com",
  password: "****",
  nickname: "Michelle",
  description: "Ich bin ein Mädchen, daswegen kann ich micht nicht zurückhalten so sexy sieht der Martin aus",
  pictureStorageName: "storage",
  location: "München",
  distance: 500,
};
