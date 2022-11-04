import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'rating';
  ratingCount = 10;
  value = 0;
  value2 = 0;
  hoverValue = 0;

  halfValue = 0;
  count = 0;
  totalRates = 0;

  myForm: FormGroup;
  styles = {backgroundColor: '#0965ee', margin: '10px', fontSize: '32px'};
  faIcon = '<i class="fa fa-car"></i>';
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      rating: [null, Validators.required]
    });
  }

  halfChange($event) {
    this.count++;
    this.totalRates += $event;
    console.log($event, this.totalRates, this.count);
    this.halfValue = this.totalRates / this.count;
  }

  /*  onChange($event) {
    const value = $event > 0 ? $event : null;
    console.log(value);
    this.myForm.get('rating').setValue(value);
    this.myForm.get('rating').markAllAsTouched();
  }
*/
  submitForm() {
    this.myForm.get('rating').markAllAsTouched();
    console.log(this.myForm.value);
  }


}
