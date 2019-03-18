import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwWidgetComponent } from './pw-widget/pw-widget.component';
import {MzDatepickerModule, MzDropdownModule, MzInputModule, MzModalModule, MzValidationModule} from 'ngx-materialize';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MzSelectModule } from 'ngx-materialize';
import { MzButtonModule } from 'ngx-materialize'
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatButtonModule, MatDatepicker, MatFormFieldModule, MatInputModule} from '@angular/material';
import {TextMaskModule} from 'angular2-text-mask';
import { SuccessScreenComponent } from './success-screen/success-screen.component';

@NgModule({
  declarations: [PwWidgetComponent, SuccessScreenComponent],
  imports: [
    CommonModule,
    MzInputModule,
    BrowserAnimationsModule,
    MzSelectModule,
    MzButtonModule,
    MzDropdownModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    MzDatepickerModule,
    MzValidationModule,
    MzModalModule
  ],
  entryComponents: [SuccessScreenComponent]
})
export class WidgetModule { }
