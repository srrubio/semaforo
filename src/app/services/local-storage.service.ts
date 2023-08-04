import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly PLAYER_DATA_KEY = 'unsaved_player';
  readonly PLAYERS = 'players';
  readonly MAX_ID = 'max_id';

  constructor() {}

  setPlayerData(playerData: Player): void {
    localStorage.setItem(this.PLAYER_DATA_KEY, JSON.stringify(playerData));
  }

  loadPlayerData(): Player {
    const playerDataStr = localStorage.getItem(this.PLAYER_DATA_KEY);
    return playerDataStr ? JSON.parse(playerDataStr) : null;
  }

  removePlayerData() {
    localStorage.removeItem(this.PLAYER_DATA_KEY);
  }

  setPlayers(players: Player[]) {
    localStorage.setItem(this.PLAYERS, JSON.stringify(players));
  }

  loadPlayers() {
    const players = localStorage.getItem(this.PLAYERS);
    if (players) {
      try {
        return JSON.parse(players);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
