import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
      selector: 'crm-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css']
})
export class HeaderComponent {
      currentUrl: string = '';

      constructor(private router: Router) {
            this.router.events.pipe(
                  filter(event => event instanceof NavigationEnd)
            ).subscribe((event: any) => {
                  if (event instanceof NavigationEnd) {
                        this.currentUrl = event.urlAfterRedirects;
                  }
            });
      }

      isRouteActive(route: string): boolean {
            return this.currentUrl.includes(route);
      }
}
