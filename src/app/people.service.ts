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
  $allCreatedDates: BehaviorSubject<string[]> = new BehaviorSubject([]);
  $allBirthdays: BehaviorSubject<string[]> = new BehaviorSubject([]);
  results: Observable<Person[]>;
  filter: Observable<string>;

  oldestData: BehaviorSubject<string> = new BehaviorSubject('');
  youngestData: BehaviorSubject<string> = new BehaviorSubject('');
  averageData: BehaviorSubject<string> = new BehaviorSubject('');

  peopleAge: BehaviorSubject<PersonAge[]> = new BehaviorSubject([]);

  flooredAges: BehaviorSubject<number[]> = new BehaviorSubject([]);
  distinctAges: BehaviorSubject<{labels: string[], ageOccurances: number[]}> = new BehaviorSubject({labels: [], ageOccurances: []});

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
      skip(1),
      filter(people => people.length > 0),
      tap(people => {
        this.$allCreatedDates.next([...new Set(people.map(person => person.createdDate))])
        this.$allBirthdays.next([...new Set(people.map(person => person.birthday))])
        const ages = people.map(person => {
          return {
            person: person.firstName, age: moment().diff(moment(person.birthday), 'years', false)
          }
        })
        this.peopleAge.next(ages)
        const createdDates = [...new Set(people.map(person => person.createdDate))];
        this.oldestData.next(moment.min(createdDates.map(date => moment(date))).format('MM/DD/YYYY'));
        this.youngestData.next(moment.max(createdDates.map(date => moment(date))).format('MM/DD/YYYY'))
        this.averageData.next((createdDates.map(date => moment().diff(moment(date), 'days')).reduce((a, b) => a + b, 0) / createdDates.length).toFixed(1))
        const floorAges = ages.map(person => Math.floor(person.age / 10) * 10)
        this.flooredAges.next(floorAges)
        const distinct = [...new Set(floorAges.sort(function (a, b) { return a - b }))]
        const labels = [ (distinct[0] == 0 ? '>0' : distinct[0].toString()), ...distinct.map(age => age.toString()).slice(1)]
        const ageOccurances: number[] = [];
        distinct.forEach((age, i) => {
          for (let j = 0; j < floorAges.length; j++) {
            if (floorAges[j] == distinct[i])
              ageOccurances[i] > 0 ? ageOccurances[i] += 1 : ageOccurances[i] = 1;
          }
        })
        this.distinctAges.next({labels, ageOccurances})
      }),
      shareReplay()
    )
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
