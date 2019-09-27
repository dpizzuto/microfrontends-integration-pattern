import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-my-custom-component',
  templateUrl: './my-custom-component.component.html',
  styleUrls: ['./my-custom-component.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyCustomComponentComponent implements OnInit {

  @Input() text: string;
  @Output() helloEvt: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
