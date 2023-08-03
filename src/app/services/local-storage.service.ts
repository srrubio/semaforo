import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly PLAYER_DATA_KEY = 'unsaved_player';

  constructor() {}

  savePlayerData(playerData: any): void {
    localStorage.setItem(this.PLAYER_DATA_KEY, JSON.stringify(playerData));
  }

  loadPlayerData(): Player {
    const playerDataStr = localStorage.getItem(this.PLAYER_DATA_KEY);
    return playerDataStr ? JSON.parse(playerDataStr) : null;
  }

  removePlayerData() {
    localStorage.removeItem(this.PLAYER_DATA_KEY);
  }
}
