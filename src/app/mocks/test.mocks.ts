import { Player } from '../interfaces/player';

export const PLAYERS_MOCK: Player[] = [
  { id: 1, nickName: 'Player 1', score: 0, maxScore: 10 },
  { id: 2, nickName: 'Player 2', score: 0, maxScore: 15 },
  { id: 3, nickName: 'Player 3', score: 0, maxScore: 0 },
];

export const PLAYER_MOCK: Player = {
  id: 1,
  nickName: 'Player 1',
  score: 0,
  maxScore: 10,
};
