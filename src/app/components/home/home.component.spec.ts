import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { PlayerService } from '../../services/player.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Player } from '../../interfaces/player';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: PlayerService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
      ],
      providers: [PlayerService, provideAnimations()],
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PlayerService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is unique if form is valid', () => {
    const form = {
      valid: true,
    };
    const spy = jest.spyOn(component, 'checkIfNickIsUnique');

    component.startGame(form);

    expect(spy).toHaveBeenCalled();
  });

  it('should check if user is unique if form is invalid', () => {
    const form = {
      valid: false,
    };
    const spy = jest.spyOn(component, 'checkIfNickIsUnique');

    component.startGame(form);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should create a player if nickname does not exist', fakeAsync(() => {
    const players: Player[] = [
      { nickName: 'existingPlayer', score: 0, maxScore: 0 },
    ];
    const newplayer: any = {
      nickName: 'newPlayer',
      score: 0,
      maxScore: 0,
    };
    const spyGetAllPlayer = jest
      .spyOn(service, 'getAllPlayer')
      .mockReturnValue(of(players));
    const spyCreatePlayer = jest
      .spyOn(service, 'createPlayer')
      .mockReturnValue(of(newplayer));

    component.nickName = 'newPlayer';
    component.checkIfNickIsUnique();
    tick();

    expect(spyGetAllPlayer).toHaveBeenCalled();
    expect(spyCreatePlayer).toHaveBeenCalledWith({
      nickName: component.nickName,
      score: 0,
      maxScore: 0,
    });
  }));

  it('should load player data if nickname already exists', fakeAsync(() => {
    const players: Player[] = [
      { nickName: 'existingPlayer', score: 0, maxScore: 0 },
    ];
    const spyGetAllPlayer = jest
      .spyOn(service, 'getAllPlayer')
      .mockReturnValue(of(players));
    const spyGetPlayerByName = jest
      .spyOn(service, 'getPlayerByName')
      .mockReturnValue(of(players[0]));

    component.nickName = 'existingPlayer';
    component.checkIfNickIsUnique();
    tick();

    expect(spyGetAllPlayer).toHaveBeenCalled();
    expect(spyGetPlayerByName).toHaveBeenCalledWith('existingPlayer');
  }));
});
