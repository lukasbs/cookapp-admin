import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-parse-page',
  templateUrl: './parse-page.component.html',
  styleUrls: ['./parse-page.component.scss']
})
export class ParsePageComponent implements OnInit {
  @ViewChild('message') messageRef: ElementRef;
  messageChanged: Subscription;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.messageChanged = this.appService.messageChanged.subscribe(
      (message) => {
        if (message.type === 'ERROR') {
          this.appService.addErrorMessage(this.messageRef.nativeElement, message.text);
        }
      }
    );
  }

  validateForm(form: NgForm) {
    return !(form.value.urlValue === null || form.value.urlValue === '' || form.value.site === null || form.value.site === '');
  }

  parseHandler(form: NgForm, recipeCreateEdit) {
    if (this.validateForm(form)) {
      this.appService.parseHTML(form.value.urlValue, form.value.site, recipeCreateEdit);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić polę adresu!');
    }
  }
}
