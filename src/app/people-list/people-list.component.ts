import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PeopleService } from '../people.service';
import { Person } from '../types';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent {

  allPeople: Observable<Person[]>;
  allGenders: Observable<string[]>;
  constructor(private people: PeopleService, private ac: AlertController) {
    this.allPeople = this.people.results;
    this.allGenders = this.people.$allGenders;
  }

  async deleteConfirm(id: number) {
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Delete',
          handler: () => {
            this.people.delete(id);
          }
        }
      ]
    });

    await alert.present();
  }
}
