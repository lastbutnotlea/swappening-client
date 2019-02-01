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

export const FAKE_EVENTS: Event[] = [
  {
    "id" : 1,
    "headline": "delete test",
    "description": "brody bleib smordy",
    "place": "at home",
    "startTime": "2018-12-17 15:27:13.283000",
    "endTime": "2018-12-17 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 1,
  },
  {
    "id" : 2,
    "headline": "ze best party",
    "description": "title says everything",
    "place": "where the noise is",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 1,
  },
  {
    "id" : 3,
    "headline": "netflix",
    "description": "and of course chill",
    "place": "no idea",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 2,
  },
  {
    "id" : 4,
    "headline": "an event",
    "description": "quite general",
    "place": "somewhere",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 2,
  },
  {
    "id" : 5,
    "headline": "I am leaving",
    "description": "pretty sad",
    "place": "movie ending location",
    "startTime": "2018-12-19 15:27:13.283000",
    "endTime": "2018-12-19 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 3,
  },
  {
    "id" : 1,
    "headline": "delete test",
    "description": "brody bleib smordy",
    "place": "at home",
    "startTime": "2018-12-17 15:27:13.283000",
    "endTime": "2018-12-17 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 1,
  },
  {
    "id" : 2,
    "headline": "ze best party",
    "description": "title says everything",
    "place": "where the noise is",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 1,
  },
  {
    "id" : 3,
    "headline": "netflix",
    "description": "and of course chill",
    "place": "no idea",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 2,
  },
  {
    "id" : 4,
    "headline": "an event",
    "description": "quite general",
    "place": "somewhere",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 2,
  },
  {
    "id" : 5,
    "headline": "I am leaving",
    "description": "pretty sad",
    "place": "movie ending location",
    "startTime": "2018-12-19 15:27:13.283000",
    "endTime": "2018-12-19 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 3,
  },
  {
    "id" : 1,
    "headline": "delete test",
    "description": "brody bleib smordy",
    "place": "at home",
    "startTime": "2018-12-17 15:27:13.283000",
    "endTime": "2018-12-17 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 1,
  },
  {
    "id" : 2,
    "headline": "ze best party",
    "description": "title says everything",
    "place": "where the noise is",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 1,
  },
  {
    "id" : 3,
    "headline": "netflix",
    "description": "and of course chill",
    "place": "no idea",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 2,
  },
  {
    "id" : 4,
    "headline": "an event",
    "description": "quite general",
    "place": "somewhere",
    "startTime": "2018-12-18 15:27:13.283000",
    "endTime": "2018-12-18 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 2,
  },
  {
    "id" : 5,
    "headline": "I am leaving",
    "description": "pretty sad",
    "place": "movie ending location",
    "startTime": "2018-12-19 15:27:13.283000",
    "endTime": "2018-12-19 15:27:13.283000",
    "isPrivate": false,
    "hasChat": true,
    "isVisible": true,
    "tags": [],
    "ownerId": 3,
  },
];
