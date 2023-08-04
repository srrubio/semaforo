import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingComponent } from './ranking.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { PlayerService } from '../../services/player.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PLAYERS_MOCK } from '../../mocks/test.mocks';
import { Player } from '../../interfaces/player';
import { of } from 'rxjs';

describe('RankingComponent', () => {
  let component: RankingComponent;
  let fixture: ComponentFixture<RankingComponent>;
  let router: Router;
  let service: PlayerService;
  let players: Player[] = PLAYERS_MOCK;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatDialogModule,
        HttpClientModule,
      ],
      providers: [PlayerService],
    });
    fixture = TestBed.createComponent(RankingComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PlayerService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.back();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });

  it('should sort data', () => {
    const spy = jest
      .spyOn(service, 'getAllPlayer')
      .mockReturnValue(of(players));
    component.ngOnInit();
    players.sort((a, b) => b.maxScore - a.maxScore);

    expect(spy).toHaveBeenCalled();
  });
});
