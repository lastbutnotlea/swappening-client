import {Message} from "./messages-model";

export class Chat {
  id: number;
  userId: number;
  eventId: number;
  ownerId: number;
  messages: Message[];
}
