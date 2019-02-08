import { Component, OnInit } from '@angular/core';
import {RpsService, TurnOption} from '../rps.service';
import * as secureRandom from '../../../../node_modules/secure-random';
import {Router} from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  availableOptions: Array<TurnOption>;
  showOptions: boolean = true;

  constructor(private rps: RpsService,
              private router: Router) {
    this.availableOptions = rps.turnOptions;
  }

  ngOnInit() {
    this.rps.secretKey = this.rps.generateSecureKey(16);
    this.rps.compTurn = this.rps.generateCompTurn();
    setTimeout(() => this.rps.usedHmac = this.rps.generateHmac(), 100);
  }

  getValueAttribute(i: number) {
    // @ts-ignore
    return document.getElementById('id'+ i.toString()).value;
  }

  playersChoice(i: number) {
    this.rps.playersTurn = i;
    this.showOptions = false;
  }

  result(pTurn: number, cTurn: number) {
    let pTurnInfo = this.rps.turnOptions[pTurn];
    let cTurnInfo = this.rps.turnOptions[cTurn];
    if (pTurnInfo.wins.includes(cTurn)) {
      document.getElementById('result').style.color = 'green';
      return 'YOU WIN!';
    } else if (pTurnInfo.losesTo.includes(cTurn)) {
      document.getElementById('result').style.color = 'red';
      return 'YOU LOSE!';
    } else {
      document.getElementById('result').style.color = 'blue';
      return "IT'S A TIE!";
    }
  }

  playAgain() {
    this.showOptions = true;
    this.rps.usedHmac = '';
    this.ngOnInit();
  }

}
