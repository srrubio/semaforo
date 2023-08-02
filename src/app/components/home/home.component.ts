import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../../interfaces/player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  nickName!: string;

  constructor(private router: Router, private service: PlayerService) {}

  startGame(form: any) {
    if (form.valid) {
      this.checkIfNickIsUnique();
    }
  }

  checkIfNickIsUnique() {
    let nicknameExists = false;
    let id: number;
    this.service.getAllPlayer().subscribe((players: Player[]) => {
      nicknameExists = players.some(
        (player) => player.nickName === this.nickName
      );
      if (!nicknameExists) {
        this.service
          .createPlayer({ nickName: this.nickName, score: 0, maxScore: 0 })
          .subscribe((player: any) => {
            if (player && player.id && player.id !== undefined)
              this.router.navigate(['/game', player.id]);
          });
      } else {
        this.service.getPlayerByName(this.nickName).subscribe((resp: any) => {
          if (resp.length > 0) this.router.navigate(['/game', resp[0]?.id]);
        });
      }
    });
  }
}
