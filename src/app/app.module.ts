import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { HttpClientModule } from '@angular/common/http';
import { PlayerService } from './services/player.service';

@NgModule({
  declarations: [AppComponent, HomeComponent, GameComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
