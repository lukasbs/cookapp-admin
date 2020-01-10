import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-parse-page',
  templateUrl: './parse-page.component.html',
  styleUrls: ['./parse-page.component.scss']
})
export class ParsePageComponent implements OnInit {
  @ViewChild('message') messageRef: ElementRef;

  constructor(private appService: AppService) { }

  ngOnInit() {
  }

  validateForm(form: NgForm) {
    return !(form.value.urlValue === null || form.value.urlValue === '' || form.value.site === null || form.value.site === '');
  }

  parseHandler(form: NgForm) {
    if (this.validateForm(form)) {
      this.appService.parseHTML(form.value.urlValue, form.value.site);
    } else {
      this.appService.addErrorMessage(this.messageRef.nativeElement, 'Proszę wypełnić polę adresu!');
    }
  }

}
