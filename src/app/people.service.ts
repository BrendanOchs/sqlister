import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, skip, startWith, tap } from 'rxjs/operators';
import { Person, PersonAge } from './types';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  storage: SQLiteObject;
  isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  $allPeople: BehaviorSubject<Person[]> = new BehaviorSubject([]);
  $allGenders: Observable<string[]>;
  $allCreatedDates: Observable<any[]>;
  $allBirthdays: Observable<string[]>;
  results: Observable<Person[]>;
  filter: Observable<string>;

  oldestData: Observable<string>;
  youngestData: Observable<string>;
  averageData: Observable<string>;

  peopleAge: Observable<PersonAge[]>;

  flooredAges: Observable<number[]>;
  distinctAges: Observable<{labels: string[], ageOccurances: number[]}>;

  allPeople: Person[] = [];

  constructor(private http: HttpClient, private platform: Platform, private sqlite: SQLite, private sqlPorter: SQLitePorter, private route: ActivatedRoute) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'people.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.mockDataPreFill();
        })
        .catch(console.error);
    });

    this.filter = this.route.queryParamMap.pipe(
      map(params => params.get('filter') || 'All'),
      startWith('All')
    );

    this.results = combineLatest([this.$allPeople, this.filter]).pipe(
      map(([people, filter]) => {
        return filter == 'All' ? [...people] : [...people.filter(p => p.gender == filter)]
      }),
      shareReplay()
    )

    this.$allGenders = this.results.pipe(
      map(people => {
        return [...new Set(people.map(person => person.gender))];
      })
    );

    this.$allCreatedDates = this.results.pipe(
      map(people => {
        return [...new Set(people.map(person => person.createdDate))];
      })
    );

    this.$allBirthdays = this.results.pipe(
      map(people => {
        return [...new Set(people.map(person => person.birthday))];
      })
    );

    this.peopleAge = this.results.pipe(
      map(people => {
        return people.map(person => {
          return {
            person: person.firstName, age: moment().diff(moment(person.birthday), 'years', false)
          }
        });
      }),
      shareReplay()
    );

    this.flooredAges = this.peopleAge.pipe(
      map(people => {
        return people.map(person => Math.floor(person.age / 10) * 10);
      }),
      filter(array => array.length > 0),
    );

    this.distinctAges = this.flooredAges.pipe(
      map(ages => {
        const distinct = [...new Set(ages.sort(function (a, b) { return a - b }))]
        const labels = [ (distinct[0] == 0 ? '>0' : distinct[0].toString()), ...distinct.map(age => age.toString()).slice(1)]
        const ageOccurances: number[] = [];
        distinct.forEach((age, i) => {
          for (let j = 0; j < ages.length; j++) {
            if (ages[j] == distinct[i])
              ageOccurances[i] > 0 ? ageOccurances[i] += 1 : ageOccurances[i] = 1;
          }
        })
        return {labels, ageOccurances}
      }),
    );

    this.oldestData = this.results.pipe(
      map(people => {
        const createdDates = [...new Set(people.map(person => person.createdDate))];
        return moment.min(createdDates.map(date => moment(date))).format('MM/DD/YYYY');
      })
    );

    this.averageData = this.results.pipe(
      map(people => {
        const createdDates = [...new Set(people.map(person => person.createdDate))];
        return (createdDates.map(date => moment().diff(moment(date), 'days')).reduce((a, b) => a + b, 0) / createdDates.length).toFixed(1);
      })
    );

    this.youngestData = this.results.pipe(
      map(people => {
        const createdDates = [...new Set(people.map(person => person.createdDate))];
        return moment.max(createdDates.map(date => moment(date))).format('MM/DD/YYYY');
      })
    );

  }

  mockDataPreFill() {
    this.http.get(
      'assets/people.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(() => {
          this.getData();
          this.isDbReady.next(true);
        })
        .catch(console.error);
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
      this.allPeople = people;
      this.$allPeople.next(people);
    }).catch(console.error);
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
      })
      .catch(console.error);
  }

  update(edits: Partial<Person>) {
    const data = [edits.firstName, edits.lastName, edits.gender, edits.birthday];
    return this.storage.executeSql(`UPDATE PeopleTable SET firstName = ?, lastName = ?, gender = ?, birthday = ? WHERE id = ${edits.id}`, data)
      .then(() => {
        this.getData();
      })
      .catch(console.error)
  }

  delete(id: number) {
    return this.storage.executeSql('DELETE FROM PeopleTable WHERE id = ?', [id])
      .then(() => {
        this.getData();
      })
      .catch(console.error);
  }
}
