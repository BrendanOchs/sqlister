import { Component, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PeopleService } from '../people.service';
import { Person } from '../types';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent {

  @Input() allPeople: Person[];
  constructor(private people: PeopleService, private ac: AlertController) { }

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
