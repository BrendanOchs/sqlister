import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, distinct, map, filter } from 'rxjs/operators';
import { Person } from './types';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  allPeople: BehaviorSubject<Person[]> = new BehaviorSubject([]);
  allGenders: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  getData() {
    this.http.get<Person[]>('assets/people.json').pipe(
      tap(people => this.allPeople.next(people)),
      map(people => people.map(person => person.gender)),
      map(genders => this.allGenders.next([...new Set(genders)]))
    ).subscribe();
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
