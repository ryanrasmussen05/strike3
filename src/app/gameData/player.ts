import { Pick } from './pick';

export interface Player {
  name: string;
  admin?: boolean;
  superuser?: boolean;
  uid: string;
  picks: Map<number, Pick>;
}
