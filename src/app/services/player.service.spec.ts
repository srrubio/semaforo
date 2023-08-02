import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PlayerService } from './player.service';
import { Player } from '../interfaces/player';
import { HttpClientModule } from '@angular/common/http';

const baseUrl = 'http://localhost:3000';
describe('PlayerService', () => {
  let service: PlayerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [PlayerService],
    });
    service = TestBed.inject(PlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all data', () => {
    const mockData: Player[] = [
      { nickName: 'Player 1', score: 0, maxScore: 0 },
      { nickName: 'Player 2', score: 0, maxScore: 0 },
      { nickName: 'Player 3', score: 0, maxScore: 0 },
    ];

    service.getAllPlayer().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(baseUrl + '/players');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should create a player', () => {
    const newData = { nickName: 'Player 4', score: 0, maxScore: 0 };

    service.createPlayer(newData).subscribe((data) => {
      expect(data).toEqual(newData);
    });

    const req = httpMock.expectOne(baseUrl + '/players');
    expect(req.request.method).toBe('POST');
    req.flush(newData);
  });
});
