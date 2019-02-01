export class Event {
  id: number;
  headline: string;
  description: string;
  place: string;
  startTime: string;
  endTime: string;
  isPrivate: boolean;
  hasChat: boolean;
  isVisible: boolean;
  tags: string[];
  ownerId: number;
}
