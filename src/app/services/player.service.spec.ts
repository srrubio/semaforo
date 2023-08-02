import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PlayerService } from './player.service';
import { Player } from '../interfaces/player';
import { HttpClientModule } from '@angular/common/http';

const baseUrl = 'http://localhost:3000';
const playerMocks: Player[] = [
  { nickName: 'Player 1', score: 0, maxScore: 0 },
  { nickName: 'Player 2', score: 0, maxScore: 0 },
  { nickName: 'Player 3', score: 0, maxScore: 0 },
];
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
    service.getAllPlayer().subscribe((data) => {
      expect(data).toEqual(playerMocks);
    });

    const req = httpMock.expectOne(baseUrl + '/players');
    expect(req.request.method).toBe('GET');
    req.flush(playerMocks);
  });

  it('should get player by name', () => {
    const nickName = 'Player 1';
    const player: Player[] = [{ nickName: 'Player 1', score: 0, maxScore: 0 }];
    service.getPlayerByName('Player 1').subscribe((data) => {
      expect(data).toEqual(playerMocks);
    });

    const req = httpMock.expectOne(baseUrl + `/players?nickName=${nickName}`);
    expect(req.request.method).toBe('GET');
    req.flush(playerMocks[0]);
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

  it('should update data', () => {
    const id = 1;
    const updatedPlayer = { nickName: 'Player 4', score: 0, maxScore: 0 };
    const mockResponse = { ...updatedPlayer };

    service.updatePlayer(id, updatedPlayer).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + `/players/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});
