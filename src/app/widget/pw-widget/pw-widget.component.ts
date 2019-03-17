import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CountryModel} from '../models/country.model';
import {FormControl} from '@angular/forms';
import {PaymentMethodModel} from '../models/payment-method.model';

@Component({
  selector: 'app-pw-widget',
  templateUrl: './pw-widget.component.html',
  styleUrls: ['./pw-widget.component.scss']
})
export class PwWidgetComponent implements OnInit {

  countryData: CountryModel[];
  countries = {
    data: {
      '': ''
    }
  };


  myControl = new FormControl();
  selectedCountry: CountryModel = {name: '', alpha2Code: '', flag: ''};

  // trick for adding missing features for components of ngx-materialize
  countriesMapByName = {};
  countriesMapByCode = {};

  paymentMethods: PaymentMethodModel[] = [];
  paymentMethod: PaymentMethodModel = null;

  cardMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  date = new Date();
  amount: number = 0;
  public options = {
    format: 'dd/yy',
    defaultDate: this.date,
    setDefaultDate: true,
    formatSubmit: 'yyyy-mm-dd',
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 10,    // Creates a dropdown of 10 years to control year,
    min: new Date(),
    max: new Date(this.date.getFullYear() + 10, this.date.getMonth(), this.date.getDay()),
    showWeekdaysFull: false,
    isRTL: true
  };
  dateOfBirth = new Date();

  cardNumber = "";

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
     this.httpClient.get<CountryModel[]>('https://restcountries.eu/rest/v2/all').subscribe(data => {
       data.forEach((val) => {
         this.countries.data[val.name] = val.flag;
         this.countriesMapByName[val.name] = val;
         this.countriesMapByCode[val.alpha2Code] = val;
       });
       this.countryData = data;

       this.httpClient.get<any>(environment.currentCountryApiUrl).subscribe(data => {
         this.selectedCountry = this.countriesMapByCode[data.countryCode];

         this.loadPaymentMethods(this.selectedCountry.alpha2Code);
       });

     });


  }

  setSelectedCountry(event) {
    this.selectedCountry = this.countriesMapByName[event.target.value];
    this.loadPaymentMethods(this.selectedCountry.alpha2Code);
    console.log(this.selectedCountry);
  }

  log() {
    console.log(this.paymentMethod);
  }

  private loadPaymentMethods(countryCode: string) {
    const params = new HttpParams().set('country_code', countryCode);
    this.httpClient.get<PaymentMethodModel[]>(environment.pwApi, {params: params} ).subscribe((data) => {
      console.log(data);
      if(data) {
        this.paymentMethods = data;
        this.paymentMethod = data[0];

      } else {
        this.paymentMethods = [];
        this.paymentMethod = null;
      }
    });
  }

}
