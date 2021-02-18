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
          this.mockDataPreFill();
      });
    });
  }

  mockDataPreFill() {
    this.http.get(
      'assets/people.sql', 
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(() => {
          this.getData();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  getData() {
    return this.storage.executeSql('SELECT * FROM PeopleTable', []).then(res => {
      const people: Person[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) { 
          people.push(res.rows.item(i));
        }
      }
      const genders = [...new Set(people.map(person => person.gender))];
      this.$allGenders.next(genders);
      this.allPeople = people;
      this.$allPeople.next(people);
    });
  }

  getPerson(id: number) {
    return this.allPeople.find(person => person.id == id);
  }

  create(p: Person) {
    p.createdDate = new Date().toISOString();
    const data = [p.firstName, p.lastName, p.gender, p.createdDate, p.birthday];
    return this.storage.executeSql('INSERT INTO PeopleTable (firstName, lastName, gender, createdDate, birthday) VALUES (?, ?, ?, ?, ?)', data)
    .then(() => {
      this.getData();
    });
  }

  update(edits: Partial<Person>) {
    const data = [edits.firstName, edits.lastName, edits.gender, edits.birthday];
    return this.storage.executeSql(`UPDATE PeopleTable SET firstName = ?, lastName = ?, gender = ?, birthday = ? WHERE id = ${edits.id}`, data)
    .then(() => {
      this.getData();
    })
  }

  delete(id: number) {
    return this.storage.executeSql('DELETE FROM PeopleTable WHERE id = ?', [id])
    .then(() => {
      this.getData();
    });
  }
}
