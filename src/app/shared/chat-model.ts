import {Message} from "./messages-model";

export class Chat {
  id: number;
  userId: number;
  eventId: number;
  ownerId: number;
  isMeOwner?: boolean;
  messages: Message[];
}
