import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HybridGuardService implements CanActivate {
  constructor(
    private router: Router,
    private platform: Platform
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> | UrlTree {
    console.log('Checking user device compatibility...', route);

    if (this.platform.is('hybrid')) {
      return true;
    } else {
      console.log('User does not have a hybrid device');
      // Returning a route to redirect to
      return this.router.parseUrl('forbidden');
    }
  }
}
