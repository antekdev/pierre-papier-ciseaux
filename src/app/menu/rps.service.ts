import {Injectable} from '@angular/core';
import * as secureRandom from '../../../node_modules/secure-random';
// @ts-ignore
import Sha256 from 'crypto-api/src/hasher/sha256';
// @ts-ignore
import Hmac from 'crypto-api/src/mac/hmac';
// @ts-ignore
import {toHex} from 'crypto-api/src/encoder/hex';

export class TurnOption {
  constructor (public name: string,
               public wins: Array<number>,
               public losesTo: Array<number>,
               ) {}
}

@Injectable({
  providedIn: 'root'
})
export class RpsService {

  turnOptions: Array<TurnOption> = [];
  secretKey: string;
  compTurn: number;
  usedHmac: string;
  playersTurn: number;

  constructor() {
    this.turnOptions.push(new TurnOption ('rock', [1], [2]));
    this.turnOptions.push(new TurnOption ('scissors', [2], [0]));
    this.turnOptions.push(new TurnOption ('paper', [0], [1]));
  }


  confirmRename(i: number, name: string) {
    if (!(name == '')) this.turnOptions[i].name = name;
    // @ts-ignore
    else this.turnOptions[i].name = document.getElementById('id'+ i.toString()).value;
    // @ts-ignore
    if (this.turnOptions.length < 16) document.getElementById('id21').disabled = false;
    // @ts-ignore
    if (this.turnOptions.length > 3) document.getElementById('id22').disabled = false;
    return false;
  }

  updateWins(pos: number) {
    this.turnOptions[pos].wins = [];
    let position = 0;
    let currentMax = (this.turnOptions.length - 3) / 2; // length taken is before adding elements
    for (let i of Array.from(Array(currentMax+1),(x,i)=>i)) { // for i in range(0, currentmax)
      let nextWin = pos + i + 1;
      if (nextWin > this.turnOptions.length - 1) {
        nextWin = position;
        position += 1;
      }
      this.turnOptions[pos].wins.push(nextWin);
    }
    return this.turnOptions[pos].wins;
  }

  updateLosesTo(pos: number) {
    this.turnOptions[pos].losesTo = [];
    let allOptions = Array.from(Array(this.turnOptions.length),(x,i)=>i);
    for (let o of allOptions) {
      if ((this.turnOptions[pos].wins.includes(o)) || (o == pos)) continue;
      this.turnOptions[pos].losesTo.push(o);
    }
  }

  addTwoOptions() {
    let i1 = this.turnOptions.length;
    this.turnOptions.push(new TurnOption ('element ' + (i1+1), [], []));
    this.turnOptions.push(new TurnOption ('element ' + (i1+2), [], []));
    for (let el = 0; el <= i1+1; el++) {
      this.updateWins(el);
      this.updateLosesTo(el);
    }
  }

  substractTwoOptions() {
    this.turnOptions.pop();
    this.turnOptions.pop();
    let l = this.turnOptions.length;
    for (let el = 0; el < l; el++) {
      this.updateWins(el);
      this.updateLosesTo(el);
    }
  }

  calculateHtmlPosition(i: number){
    if (i % 3 == 0) return 'left';
    if (i % 3 == 1) return 'middle';
    if (i % 3 == 2) return 'right';
  }


  keyToHex(arr: Array<number>) {
    let arr16 = [];
    for (let i of arr) {
      let hexString = i.toString(16);
      if (hexString.length % 2) {
        hexString = '0' + hexString;
      }
      arr16.push(hexString);
    }
    return arr16;
  }

  generateSecureKey(bytes: number) {
    let arrayDecimalKey = secureRandom.randomArray(bytes);
    if (bytes != 16) {
      return arrayDecimalKey;
    }
    else {
      let arrayHexKey = this.keyToHex(arrayDecimalKey);
      return arrayHexKey.join('');
    }
  }

  max(arr) {
    let max = -Infinity;
    let maxIndices = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === max) {
        maxIndices.push(i);
      } else if (arr[i] > max) {
        maxIndices = [i];
        max = arr[i];
      }
    }
    return maxIndices;
  }

  generateCompTurn() {
    let array = this.generateSecureKey(this.turnOptions.length);
    let arrayOfMax = this.max(array);
    return arrayOfMax[Math.floor(Math.random() * arrayOfMax.length)];
  }

  generateHmac(){
    let hasher = new Sha256(); //Md5();
    let hmac = new Hmac(this.secretKey, hasher);
    hmac.update(this.turnOptions[this.compTurn].name);
    return toHex(hmac.finalize());
  }

}
