import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Person } from './types';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  storage: SQLiteObject;
  isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  $allPeople: BehaviorSubject<Person[]> = new BehaviorSubject([]);
  $allGenders: BehaviorSubject<string[]> = new BehaviorSubject([]);

  allPeople: Person[] = [];

  constructor(private http: HttpClient, private platform: Platform, private sqlite: SQLite, private sqlPorter: SQLitePorter) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'people.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
      });
    });
  }

  getFakeData() {
    this.http.get(
      'assets/people.sql', 
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getData();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  getData() {
    return this.storage.executeSql('SELECT * FROM PeopleTable', []).then(res => {
      let people: Person[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          people.push(res.rows.item(i));
        }
      }
      const genders = [...new Set(people.map(person => person.gender))];
      this.$allGenders.next(genders);
      this.allPeople = people;
      console.log(this.allPeople);
      this.$allPeople.next(people);
    });
  }

  // getData() {
  //   this.http.get<Person[]>('assets/people.json').pipe(
  //     tap(people => {
  //       this.$allPeople.next(people);
  //       this.allPeople = people;
  //     }),
  //     map(people => people.map(person => person.gender)),
  //     map(genders => this.$allGenders.next([...new Set(genders)]))
  //   ).subscribe();
  // }

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
