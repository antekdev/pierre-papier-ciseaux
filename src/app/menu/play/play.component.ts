import { Component, OnInit } from '@angular/core';
import {RpsService, TurnOption} from '../rps.service';
import * as secureRandom from '../../../../node_modules/secure-random';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  availableOptions: Array<TurnOption>;

  constructor(private rps: RpsService) {
    this.availableOptions = rps.turnOptions;
  }

  ngOnInit() {
    this.rps.secretKey = this.rps.generateSecureKey(16);
    this.rps.compTurn = this.rps.generateCompTurn();
    setTimeout(() => this.rps.usedHmac = this.rps.generateHmac(), 100);
    setTimeout(() => console.log(this.rps.secretKey, this.rps.compTurn, this.rps.usedHmac), 200);
  }

  getValueAttribute(i: number) {
    // @ts-ignore
    return document.getElementById('id'+ i.toString()).value;
  }

}
