import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../interfaces/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  player!: Player;
  color: string = 'red';
  interval: any;
  playerId!: number;
  lastButton!: string;
  count = 0;
  greenLight!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PlayerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.playerId = params['id'];
    });
    this.getJugadorData();
  }

  ngOnDestroy() {
    this.detenerSemaforoInterval();
  }

  back() {
    this.save();
    this.router.navigate(['/home']);
  }

  move(button: string) {
    if (this.color !== 'red') {
      if (button !== this.lastButton) {
        this.player.score++;
      } else {
        this.player.score--;
      }
      if (this.player.maxScore < this.player.score)
        this.player.maxScore = this.player.score;
      this.lastButton = button;
    } else {
      this.player.score = 0;
      this.lastButton = '';
      this.save();
    }
  }

  save() {
    this.service.updatePlayer(this.playerId, this.player).subscribe();
  }

  getJugadorData() {
    this.service.getPlayer(this.playerId).subscribe((data: Player) => {
      this.player = data;
      this.startInterval();
    });
  }

  detenerSemaforoInterval() {
    clearInterval(this.interval);
  }

  startInterval() {
    this.color = 'green';
    this.interval = setInterval(() => {
      console.log('interval');
      this.greenLight = this.calculateGreenTime(this.player.score);
      setTimeout(() => {
        console.log('interval red');
        this.color = 'red';
      }, this.greenLight);
      setTimeout(() => {
        console.log('interval green');
        this.color = 'green';
      }, 3000);
    }, 10000);
  }

  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  calculateGreenTime(score: number): number {
    let baseTime = 10000 - score * 100;
    if (baseTime < 2000) baseTime = 2000;
    const randomVariation = this.random(-1500, 1500);
    console.log(baseTime + randomVariation);
    return baseTime + randomVariation;
  }
}