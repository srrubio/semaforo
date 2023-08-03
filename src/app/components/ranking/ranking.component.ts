import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Player } from 'src/app/interfaces/player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  dataSource!: MatTableDataSource<Player>;
  displayedColumns: string[] = ['position', 'nickName', 'maxScore'];

  constructor(private service: PlayerService, private router: Router) {}
  ngOnInit() {
    this.service.getAllPlayer().subscribe((players: Player[]) => {
      players.sort((a, b) => b.maxScore - a.maxScore);
      this.dataSource = new MatTableDataSource(players);
    });
  }

  back() {
    this.router.navigate(['/home']);
  }
}
