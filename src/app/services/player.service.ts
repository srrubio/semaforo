import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:3000/players';

  constructor(private http: HttpClient) {}

  getAllPlayer(): Observable<Player[]> {
    return this.http.get<Player[]>(this.baseUrl);
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/${id}`);
  }

  getPlayerByName(nickname: string): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}?nickName=${nickname}`);
  }

  getPlayerId(nickname: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}?nickName=${nickname}`);
  }

  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.baseUrl, player);
  }

  updatePlayer(id: number, player: Player): Observable<any> {
    return this.http.put<Player>(`${this.baseUrl}/${id}`, player);
  }
}
