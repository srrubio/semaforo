import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../../interfaces/player';
import { PlayerService } from '../../services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  nickName!: string;
  players!: Player[];

  constructor(
    private router: Router,
    private service: PlayerService,
    private dialog: MatDialog,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.checkStorageData();
  }

  checkStorageData() {
    if (navigator.onLine) {
      this.service.getAllPlayer().subscribe((players: Player[]) => {
        this.players = players;
        this.storage.setPlayers(players);
      });
    } else {
      this.players = this.storage.loadPlayers();
    }

    if (this.storage.loadPlayerData() && navigator.onLine) {
      this.router.navigate(['/game', this.storage.loadPlayerData().id]);
    }
  }

  startGame(form: any) {
    if (form.valid) {
      this.checkIfNickIsUnique();
    }
  }

  checkIfNickIsUnique() {
    let nicknameExists = false;
    nicknameExists = this.players?.some(
      (player) => player.nickName === this.nickName
    );
    if (!nicknameExists) {
      this.createPlayer();
    } else {
      this.loadPlayer();
    }
  }

  createPlayer() {
    const id = this.players?.length + 1;
    const playerData: Player = {
      nickName: this.nickName,
      score: 0,
      maxScore: 0,
      id: id,
    };
    if (navigator.onLine) {
      this.service.createPlayer(playerData).subscribe((player: any) => {
        if (player && player.id && player.id !== undefined) {
          this.router.navigate(['/game', player.id]);
        }
      });
    } else {
      this.storage.setPlayerData(playerData);
      this.players = this.storage.loadPlayers();
      this.players.push(playerData);
      this.storage.setPlayers(this.players);
      this.router.navigate(['/game', id]);
    }
  }

  loadPlayer() {
    if (navigator.onLine) {
      this.service.getPlayerByName(this.nickName).subscribe((resp: any) => {
        if (resp.length > 0) this.router.navigate(['/game', resp[0]?.id]);
      });
    } else {
      const player = this.storage
        .loadPlayers()
        .filter((player: Player) => player.nickName === this.nickName);
      if (player.length > 0) this.router.navigate(['/game', player[0].id]);
    }
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
    });
  }

  ranking() {
    this.router.navigate(['/ranking']);
  }
}
