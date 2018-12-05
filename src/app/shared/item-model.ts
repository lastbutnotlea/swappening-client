export class Item {
  itemId: string;
  headline: string;
  description: string;
  tags: string[];
  ownerId: string;
  giveAway: boolean;
  imageUrls: string[];
}

export const FAKE_ITEMS: Item[] = [
  {
    itemId: '1',
    headline: 'beautiful but useless flower',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '2',
    headline: 'a flower!',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '3',
    headline: 'yet another flower',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '4',
    headline: 'i am a flower',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '5',
    headline: 'two flowers! so wow!',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '6',
    headline: 'a flower',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '7',
    headline: 'flower power',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  }
];

