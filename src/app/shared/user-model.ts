export class User {
  userId: string;
  email: string;
  password: string;
  nickname: string;
  location: string;
  distance: number;
  rating: number;
  numberOfRating: number;
  isCharity: boolean;
}

export const FAKE_USER: User = {
  userId: '001',
  email: 'user@mail.com',
  password: '****',
  nickname: 'user',
  location: 'home',
  distance: 500,
  rating: 5,
  numberOfRating: 87,
  isCharity: false
}
