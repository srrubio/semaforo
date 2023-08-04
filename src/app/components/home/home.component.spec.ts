import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { screen, fireEvent, render } from '@testing-library/angular';
import '@testing-library/jest-dom';

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
import { MatDialogModule } from '@angular/material/dialog';
import { PLAYERS_MOCK, PLAYER_MOCK } from '../../mocks/test.mocks';
import { LocalStorageService } from '../../services/local-storage.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service: PlayerService;
  let storage: LocalStorageService;
  let router: Router;
  let players: Player[] = PLAYERS_MOCK;
  let player: Player = PLAYER_MOCK;

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
        MatDialogModule,
      ],
      providers: [PlayerService, LocalStorageService, provideAnimations()],
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PlayerService);
    storage = TestBed.inject(LocalStorageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service', () => {
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const spyGetAllPlayer = jest
      .spyOn(service, 'getAllPlayer')
      .mockReturnValue(of(players));
    component.players = players;
    expect(component.players).toEqual(players);
  });

  it('should navigate to game when player data is loaded and online', () => {
    component.checkStorageData();
    const spyLoadPlayerData = jest
      .spyOn(storage, 'loadPlayerData')
      .mockReturnValue(player);
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

    expect(spyLoadPlayerData).not.toBeNull();
  });

  it('should load unsaved data', () => {
    const playerId = 1;
    const spyLoadPlayer = jest
      .spyOn(storage, 'loadPlayerData')
      .mockReturnValue(player);
    const spyNavigate = jest.spyOn(router, 'navigate');
    component.checkStorageData();

    expect(spyLoadPlayer).toHaveBeenCalled();
    expect(spyNavigate).toHaveBeenCalledWith(['/game', playerId]);
  });

  describe('create', () => {
    it('should create', () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
      const spyCreatePlayer = jest
        .spyOn(service, 'createPlayer')
        .mockReturnValue(of(player));
      const spy = jest.spyOn(router, 'navigate');

      component.createPlayer();

      expect(spyCreatePlayer).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['/game', player.id]);
    });
    it('should store player data locally when offline', () => {
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);
      const spySetPlayer = jest.spyOn(storage, 'setPlayerData');
      const spyLoadPlayers = jest
        .spyOn(storage, 'loadPlayers')
        .mockReturnValue(players);
      const spySetPlayers = jest.spyOn(storage, 'setPlayers');

      component.nickName = 'TestPlayer';
      component.createPlayer();

      expect(spySetPlayer).toHaveBeenCalled();
      expect(spyLoadPlayers).toHaveBeenCalled();
      expect(spySetPlayers).toHaveBeenCalled();
    });
  });

  it('should check if user is unique if form is valid', () => {
    const form = {
      valid: true,
    };
    const spy = jest.spyOn(component, 'checkIfNickIsUnique');
    component.players = players;
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

  it('should load player data if nickname already exists', fakeAsync(() => {
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);

    component.players = players;
    const spyGetAllPlayer = jest
      .spyOn(service, 'getAllPlayer')
      .mockReturnValue(of(players));
    const spyGetPlayerByName = jest
      .spyOn(service, 'getPlayerByName')
      .mockReturnValue(of(players[0]));

    component.nickName = 'Player 1';
    component.checkIfNickIsUnique();

    component.loadPlayer();
    expect(spyGetPlayerByName).toHaveBeenCalledWith('Player 1');
  }));

  it('should check if start button is clicked', () => {
    const startButton =
      fixture.debugElement.nativeElement.querySelector('button');
    const spy = jest.spyOn(component, 'startGame');

    startButton.click();

    expect(spy).toHaveBeenCalled();
  });

  describe('validation inputs', () => {
    it('should display the mat-error when input is focused and then blured', async () => {
      const inputElement = screen.getByLabelText('Nickname');

      fireEvent.focus(inputElement);
      fireEvent.blur(inputElement);
      expect(screen.findByText('Nickname is required!')).toBeTruthy;
    });

    it('should display the mat-error when input is touched and then cleared', async () => {
      render(HomeComponent);
      const inputElement = screen.getByLabelText('Nickname');

      fireEvent.input(inputElement, { target: { value: 'A' } });
      fireEvent.input(inputElement, { target: { value: '' } });

      expect(screen.findByText('Nickname is required!')).toBeTruthy;
    });
  });

  it('should openDialog', () => {
    component.openDialog();
  });

  it('should go ranking', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.ranking();

    expect(spy).toHaveBeenCalledWith(['/ranking']);
  });
});
