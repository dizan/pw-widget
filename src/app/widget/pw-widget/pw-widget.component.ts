import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CountryModel} from '../models/country.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PaymentMethodModel} from '../models/payment-method.model';
import {MzModalService} from 'ngx-materialize';
import {SuccessScreenComponent} from '../success-screen/success-screen.component';
import {ValidateLuhn} from '../validators/luhn.validator';

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
  now = new Date();
  paymentSuccessFull = false;

  private _expiredDateYear: number = this.now.getFullYear();
  private _expiredDateMonth: number = this.now.getMonth() + 1;

  availableMonths: number[];
  availableYears: number[];

  selectedCountry: CountryModel = {name: '', alpha2Code: '', flag: ''};

  // trick for adding missing features for components of ngx-materialize
  countriesMapByName = {};
  countriesMapByCode = {};

  paymentMethods: PaymentMethodModel[] = [];
  paymentMethod: PaymentMethodModel = null;

  cardMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  amount: number = 0;
  cardNumber = "";
  cvv: number;
  cardHolder = "";
  submitted=false;

  formGroup: FormGroup;
  errorMessageResources = {
    amount: {
      required: 'Amount is required',
      pattern: 'Only numbers'
    },
    cardHolder: {
      required: 'Card holder is required',
      pattern: 'Characters only'
    },
    cardNumber: {
      required: 'Card number is required',
      pattern: 'Numbers only',
      luhn: 'Invalid credit card number'
    },
    cvv: {
      required: 'Cvv is required',
      pattern: 'Must be 3 number',
    }
  };


  get expiredDateYear(): number {
    return this._expiredDateYear;
  }

  set expiredDateYear(value: number) {
    console.log(this.formGroup.get('cardNumber').errors);
    this._expiredDateYear = value;

    this.availableYears = this.getAvailableYears();
    this.availableMonths = this.getAvailableMonths();

    console.log(this.availableMonths);

  }

  get expiredDateMonth(): number {
    return this._expiredDateMonth;
  }

  set expiredDateMonth(value: number) {
    this._expiredDateMonth = value;

    this.availableYears = this.getAvailableYears();
    this.availableMonths = this.getAvailableMonths();

    console.log(this.availableYears);
  }

  constructor(private httpClient: HttpClient, private modalService: MzModalService) {

  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      amount: new FormControl(this.amount,[
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      paymentMethod: new FormControl(this.paymentMethod),
      cardHolder: new FormControl(this.cardHolder,[
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),

      ]),
      cardNumber: new FormControl(this.cardNumber,[
        Validators.required,
        Validators.pattern('[0-9]*'),
        ValidateLuhn
      ]),
      expiredDateMonth: new FormControl(this.expiredDateMonth),
      expiredDateYear: new FormControl(this.expiredDateYear),
      cvv: new FormControl(this.cvv,[
        Validators.required,
        Validators.pattern('[0-9]{3}'),
      ])
    });

    this.availableMonths = this.getAvailableMonths();
    this.availableYears = this.getAvailableYears();


    this.httpClient.get<CountryModel[]>(environment.countriesApiUrl).subscribe(data => {
       this.fillCountriesMaps(data);
       this.countryData = data;

       this.httpClient.get<any>(environment.currentCountryApiUrl).subscribe(location => {
         this.selectedCountry = this.getCountryByCode(location.countryCode);

         this.loadPaymentMethods(this.selectedCountry.alpha2Code);
       });

     });
  }

  setSelectedCountry(event) {
    this.selectedCountry = this.getCountryByName(event.target.value);
    this.loadPaymentMethods(this.selectedCountry.alpha2Code);
    console.log(this.selectedCountry);
  }

  fillCountriesMaps(data: CountryModel[]) {
    data.forEach((countryModel) => {
      this.countries.data[countryModel.name] = countryModel.flag;
      this.countriesMapByName[countryModel.name] = countryModel;
      this.countriesMapByCode[countryModel.alpha2Code] = countryModel;
    });
  }


  getCountryByCode(countryCode: string): CountryModel {
    // trick for adding missing features for components of ngx-materialize
    return this.countriesMapByCode[countryCode];
  }

  getCountryByName(countryName: string): CountryModel {
    // trick for adding missing features for components of ngx-materialize
    return this.countriesMapByName[countryName];
  }

  getAvailableMonths(): number[] {
    const availableMonths = [];
    const currentYear = this.now.getFullYear();
    let startMonth = this.now.getMonth() + 1;

    console.log(this.expiredDateYear !== currentYear);
    if (this.expiredDateYear !== currentYear) {
      console.log(this.expiredDateYear + "!=" + currentYear);
      startMonth = 1;
    }

    for (let i = 0; i <= 12 - startMonth; i++) {
      availableMonths.push(startMonth + i);
    }

    return availableMonths;
  }

  getAvailableYears(): number[] {
    const currentYear = this.now.getFullYear();
    const availableYears = [];

    for (let i = 0; i < 11; i++ ) {
      availableYears.push(currentYear + i);
    }

    return availableYears;
  }


  private loadPaymentMethods(countryCode: string) {
    const params = new HttpParams().set('country_code', countryCode);
    this.httpClient.get<PaymentMethodModel[]>(environment.pwApi, {params: params} ).subscribe((data) => {
      if (data) {
        this.paymentMethods = data;
        this.paymentMethod = data[0];

      } else {
        this.paymentMethods = [];
        this.paymentMethod = null;
      }
    });
  }

  onSubmit() {
    this.formGroup.markAsTouched();
    this.submitted = true;

    if (this.formGroup.valid) {
      this.paymentSuccessFull = true;
      this.modalService.open(SuccessScreenComponent);
    } else {
      return;
    }
  }

}
