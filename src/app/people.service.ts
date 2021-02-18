import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Person } from './types';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  $allPeople: BehaviorSubject<Person[]> = new BehaviorSubject([]);
  $allGenders: BehaviorSubject<string[]> = new BehaviorSubject([]);

  allPeople: Person[] = [];

  constructor(private http: HttpClient) { }

  getData() {
    this.http.get<Person[]>('assets/people.json').pipe(
      tap(people => {
        this.$allPeople.next(people);
        this.allPeople = people;
      }),
      map(people => people.map(person => person.gender)),
      map(genders => this.$allGenders.next([...new Set(genders)]))
    ).subscribe();
  }

  getPerson(id: number) {
    return this.allPeople.find(person => person.id == id);
  }
  
  create(p: Person) {
    p.id = Math.max(...this.allPeople.map(person => person.id)) + 1;
    p.createdDate = new Date();
    this.allPeople.push(p);
    this.$allPeople.next(this.allPeople);

    //add person to table
  }

  update(edits: Partial<Person>) {
    const index = this.allPeople.findIndex(p => p.id == edits.id);
    this.allPeople[index] = {...this.allPeople[index], ...edits};
    this.$allPeople.next(this.allPeople);
    
    //update a person in the table
  }

  delete(id: number) {
    const index = this.allPeople.findIndex(p => p.id == id);
    this.allPeople = [...this.allPeople.slice(0, index), ...this.allPeople.slice(index + 1)];
    this.$allPeople.next(this.allPeople);
    
    //delete a person from the table
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
