import { Component, OnInit } from '@angular/core';
import {RpsService, TurnOption} from '../rps.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  availableOptions: Array<TurnOption>;
  renameInputShown: boolean = false;
  currentlyRenaming: number = 0;

  constructor(private rps: RpsService) {
    this.availableOptions = rps.turnOptions;
  }

  ngOnInit() {
    console.log(this.rps.turnOptions);
  }

  getValueAttribute(i: number) {
    // @ts-ignore
    return document.getElementById('id'+ i.toString()).value;
  }

  showRenameInput(i: number) {
    this.renameInputShown = true;
    this.currentlyRenaming = i;
    // @ts-ignore
    document.getElementById('id21').disabled = true;
    // @ts-ignore
    document.getElementById('id22').disabled = true;
    setTimeout( () => document.getElementById('id20').focus(), 100);
  }

  toggleColoringRelations(i: number, p: boolean) {
    if (p) {
      document.getElementById('id' + i).style.backgroundColor = 'darkslategrey';
      for (let el of this.rps.turnOptions[i].wins) {
        // @ts-ignore
        document.getElementById('id' + el).style.backgroundColor = '#006400';
      }
      for (let el of this.rps.turnOptions[i].losesTo) {
        document.getElementById('id' + el).style.backgroundColor = '#8b0000';
      }
    }
    else {
      for (let x = 0; x < this.rps.turnOptions.length; x++) {
        document.getElementById('id' + x).style.backgroundColor = 'darkslategrey';
      }
    }
  }

}
