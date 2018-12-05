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
    itemId: '001',
    headline: 'beautiful but useless flower',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '002',
    headline: 'a flower!',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  },
  {
    itemId: '003',
    headline: 'yet another flower',
    description: 'a more detailed description about what this flower can and cannot do',
    tags: ['flower', 'useless'],
    ownerId: '001',
    giveAway: false,
    imageUrls: []
  }
];

