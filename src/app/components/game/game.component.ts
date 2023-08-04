import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../interfaces/player';
import { DeviceService } from '../../services/device.service';
import { LocalStorageService } from '../../services/local-storage.service';

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
    private service: PlayerService,
    private deviceService: DeviceService,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.playerId = params['id'];
    });
    if (this.storage.loadPlayerData()) {
      this.player = this.storage.loadPlayerData();
      this.startGame();
    } else {
      this.getJugadorData();
    }
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
        this.deviceService.vibrate(200);
        if (this.player.score >= 1) this.player.score--;
      }
      if (this.player.maxScore < this.player.score)
        this.player.maxScore = this.player.score;
      this.lastButton = button;
      this.setStorageData(this.player);
    } else {
      this.player.score = 0;
      this.lastButton = '';
      this.save();
    }
  }

  setStorageData(player: Player) {
    this.storage.savePlayerData(player);
  }

  save() {
    this.service.updatePlayer(this.playerId, this.player).subscribe();
    this.storage.removePlayerData();
  }

  getJugadorData() {
    this.service.getPlayer(this.playerId).subscribe((data: Player) => {
      this.player = data;
      this.startGame();
    });
  }

  detenerSemaforoInterval() {
    clearInterval(this.interval);
  }

  startGame() {
    let intervalTime =
      this.color === 'green'
        ? this.calculateGreenTime(this.player?.score)
        : 3000;
    this.interval = setTimeout(() => {
      this.color = this.color === 'green' ? 'red' : 'green';
      this.startGame();
    }, intervalTime);
  }

  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  calculateGreenTime(score: number): number {
    let baseTime = 10000 - score * 100;
    if (baseTime < 2000) baseTime = 2000;
    const randomVariation = this.random(-1500, 1500);
    return baseTime + randomVariation;
  }
}
