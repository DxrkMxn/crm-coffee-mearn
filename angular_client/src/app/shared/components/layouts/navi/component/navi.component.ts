import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { MaterialService } from '../../../../classes/material.service';
import { NaviInterface } from '../navi.interface';
import { RouterPathsEnum } from '../../../../enums/routerPaths.enum';

@Component({
      selector: 'crm-navi',
      templateUrl: './navi.component.html',
      styleUrls: ['./navi.component.css'],
})
export class NaviComponent implements OnInit, OnDestroy, AfterViewInit {
      routerPathsEnum = RouterPathsEnum;
      isAdmin: boolean;
      linksList: NaviInterface[];
      private destroy$ = new Subject<void>();

      @ViewChild('floatingB') floatingRef!: ElementRef;

      constructor(
            private authService: AuthService,
            private materialService: MaterialService,
      ) {
            this.isAdmin = this.authService.isAdmin();
            this.linksList = [
                  { path: RouterPathsEnum.OVERVIEW, title: 'Resumen', display: false },
                  { path: RouterPathsEnum.ANALYTICS, title: 'Análisis', display: false },
                  { path: RouterPathsEnum.MAILING, title: 'Emails', display: false },
                  { path: RouterPathsEnum.HISTORY, title: 'Historial', display: true },
                  { path: RouterPathsEnum.ORDER, title: 'Agregar pedido', display: true },
                  { path: RouterPathsEnum.CATEGORIES, title: 'Categorías', display: false },
                  { path: RouterPathsEnum.PROFILE, title: 'Perfil', display: true },
            ];
      }

      ngOnInit(): void {
            this.authService.currentUser
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((user) => {
                        this.isAdmin = user?.admin === true;
                        this.updateLinksDisplay();
                  });
      }

      ngOnDestroy(): void {
            this.destroy$.next();
            this.destroy$.complete();
      }

      ngAfterViewInit(): void {
            this.materialService.initializeFloatingButton(this.floatingRef);
      }

      logout(): void {
            this.authService.logout();
      }

      private updateLinksDisplay(): void {
            this.linksList = this.linksList.map(link => {
                  if (link.title === 'Resumen' || link.title === 'Análisis' || link.title === 'Categorías' || link.title === 'Emails') {
                        return { ...link, display: this.isAdmin };
                  }
                  return link;
            });
      }

      trackByName(index: number, item: NaviInterface): string {
            return item.title;
      }

}
