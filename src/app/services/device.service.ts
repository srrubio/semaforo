import { Injectable } from '@angular/core';

@Injectable()
export class DeviceService {
  vibrate(duration: number) {
    if ('vibrate' in navigator) {
      window.navigator.vibrate(duration);
    }
  }
}
