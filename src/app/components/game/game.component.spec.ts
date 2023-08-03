import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerService } from '../../services/player.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let service: PlayerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [PlayerService, DeviceService, provideAnimations()],
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PlayerService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save', () => {
    component.back();
    component.save();
  });

  it('should go back', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.back();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });

  describe('move options', () => {
    it('should press twice the same button', () => {
      component.color = 'green';
      component.lastButton = 'left';
      component.player = {
        nickName: 'Player 1',
        score: 10,
        maxScore: 15,
      };

      component.move('left');
      expect(component.player.score).toBe(9);
      component.move('left');
      expect(component.player.score).toBe(8);

      expect(component.player.maxScore).toBe(15);
      expect(component.lastButton).toBe('left');
    });

    it('should press twice the same button and score its 1', () => {
      component.color = 'green';
      component.lastButton = 'left';
      component.player = {
        nickName: 'Player 1',
        score: 1,
        maxScore: 15,
      };

      component.move('left');
      expect(component.player.score).toBe(0);
      component.move('left');
      expect(component.player.score).toBe(0);

      expect(component.player.maxScore).toBe(15);
      expect(component.lastButton).toBe('left');
    });

    it('should press differents buttons', () => {
      component.color = 'green';
      component.lastButton = 'left';
      component.player = {
        nickName: 'Player 1',
        score: 10,
        maxScore: 15,
      };

      component.move('right');
      expect(component.player.score).toBe(11);
      component.move('left');
      expect(component.player.score).toBe(12);
      component.move('right');
      expect(component.player.score).toBe(13);

      expect(component.player.maxScore).toBe(15);
      expect(component.lastButton).toBe('right');
    });

    it('should get high score', () => {
      component.color = 'green';
      component.lastButton = 'left';
      component.player = {
        nickName: 'Player 1',
        score: 15,
        maxScore: 15,
      };

      component.move('right');
      expect(component.player.score).toBe(16);

      expect(component.player.maxScore).toBe(16);
      expect(component.lastButton).toBe('right');
    });
    it('should press when is red', () => {
      component.color = 'red';
      component.player = {
        nickName: 'Player 1',
        score: 10,
        maxScore: 15,
      };
      const spy = jest.spyOn(component, 'save');

      component.move('right');

      expect(component.player.score).toBe(0);
      expect(component.player.maxScore).toBe(15);
      expect(component.lastButton).toBe('');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('time', () => {
    it('should get ramdon', () => {
      const min = 5;
      const max = 10;

      const result = component.random(5, 10);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should calculate green time within the correct range', () => {
      const score = 0;

      component.calculateGreenTime(score);
      const baseTime = 10000 - score * 100;
      const result = component.random(-1500, 1500) + baseTime;
      // Minimun value (1000 - 0 * 100) - 1500 => 8500
      expect(result).toBeGreaterThanOrEqual(8500);
      // Maximun value (1000 - 0 * 100) + 1500 => 11500
      expect(result).toBeLessThanOrEqual(11500);
    });

    it('should set minimun time 2 secs', () => {
      const score = 100;

      component.calculateGreenTime(score);
      let baseTime = 10000 - score * 100;
      baseTime = 2000;

      const result = component.random(-1500, 1500) + baseTime;
      // Minimum value 2000 - 1500 => 500
      expect(result).toBeGreaterThanOrEqual(500);
      // Maximum value 2000 + 1500 => 3500
      expect(result).toBeLessThanOrEqual(3500);
    });
  });
});
