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

  constructor(
    private router: Router,
    private service: PlayerService,
    private dialog: MatDialog,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (this.storage.loadPlayerData()) {
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
    this.service.getAllPlayer().subscribe((players: Player[]) => {
      nicknameExists = players.some(
        (player) => player.nickName === this.nickName
      );
      if (!nicknameExists) {
        this.createPlayer();
      } else {
        this.loadPlayer();
      }
    });
  }

  createPlayer() {
    this.service
      .createPlayer({ nickName: this.nickName, score: 0, maxScore: 0 })
      .subscribe((player: any) => {
        if (player && player.id && player.id !== undefined)
          this.router.navigate(['/game', player.id]);
      });
  }

  loadPlayer() {
    this.service.getPlayerByName(this.nickName).subscribe((resp: any) => {
      if (resp.length > 0) this.router.navigate(['/game', resp[0]?.id]);
    });
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
    });
  }
}
