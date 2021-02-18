import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PeopleService } from '../people.service';
import { Person } from '../types';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  //generated by mockaroo.com
  genderOptions = [
    'Female',
    'Male',
    'Bigender',
    'Agender',
    'Polygender',
    'Non-binary',
    'Genderfluid',
    'Genderqueer'
  ];

  personForm: FormGroup;

  person: Observable<Person>;

  constructor(private fb: FormBuilder, private ps: PeopleService, private router: Router, private route: ActivatedRoute) {
    this.personForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required]
    });

    this.person = this.route.paramMap.pipe(
      map(params => {
        return this.ps.getPerson(+params.get('id') as number);
      }),
      tap(person => {
        this.personForm.patchValue(person)
      })
    );
  }

  ngOnInit() {
  }

  update(id: number) {
    this.ps.update({id, ...this.personForm.value});
    this.router.navigateByUrl('/');
  }

}