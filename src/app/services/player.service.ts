import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Player } from '../interfaces/player';
import { of } from 'rxjs';

@Injectable()
export class PlayerService {
  private baseUrl = 'https://data-server-rm1u.onrender.com';

  constructor(private http: HttpClient) {}

  getAllPlayer(): Observable<Player[]> {
    return this.http.get<Player[]>(this.baseUrl + '/players');
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/players/${id}`);
  }

  getPlayerByName(nickname: string): Observable<Player> {
    return this.http.get<Player>(
      `${this.baseUrl}/players?nickName=${nickname}`
    );
  }

  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.baseUrl + '/players', player);
  }

  updatePlayer(id: number, player: Player): Observable<any> {
    return this.http.put<Player>(`${this.baseUrl}/players/${id}`, player);
  }
}
