import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PeopleService } from '../people.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnDestroy {
  allGenders: string[];

  controlSub: Subscription;
  filter = new FormControl();

  constructor(private ps: PeopleService, private router: Router) { 
    this.filter.setValue('All');
    this.allGenders = [
      'All',
      'Genderfluid',
      'Genderqueer',
      'Polygender',
      'Non-binary',
      'Bigender',
      'Female',
      'Male'
    ]
    this.controlSub = this.filter.valueChanges
      .subscribe(searchTerm => {
        // If filter is an empty string, replace with undefined
        // to avoid having an empty key-value pair in the URL
        const filter = searchTerm || undefined;
        const queryParams = { filter };
        // Navigate returns a promise, best practices dictate that you should always handle them
        // Intentionally choosing not to, and casting it to a void to pass lint
        void this.router.navigate([], {
          queryParams,
          queryParamsHandling: 'merge'
        });
      });
  }

  ngOnDestroy() {
    this.controlSub.unsubscribe();
  }
}
