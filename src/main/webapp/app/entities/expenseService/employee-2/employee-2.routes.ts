import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { Employee2Component } from './list/employee-2.component';
import { Employee2DetailComponent } from './detail/employee-2-detail.component';
import { Employee2UpdateComponent } from './update/employee-2-update.component';
import Employee2Resolve from './route/employee-2-routing-resolve.service';

const employee2Route: Routes = [
  {
    path: '',
    component: Employee2Component,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Employee2DetailComponent,
    resolve: {
      employee2: Employee2Resolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Employee2UpdateComponent,
    resolve: {
      employee2: Employee2Resolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Employee2UpdateComponent,
    resolve: {
      employee2: Employee2Resolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default employee2Route;
