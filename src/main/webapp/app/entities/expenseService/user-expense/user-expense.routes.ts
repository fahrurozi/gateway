import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UserExpenseComponent } from './list/user-expense.component';
import { UserExpenseDetailComponent } from './detail/user-expense-detail.component';
import { UserExpenseUpdateComponent } from './update/user-expense-update.component';
import UserExpenseResolve from './route/user-expense-routing-resolve.service';
import {UserExpenseCreateComponent} from "./create/user-expense-create.component";

const userExpenseRoute: Routes = [
  {
    path: '',
    component: UserExpenseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserExpenseDetailComponent,
    resolve: {
      userExpense: UserExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: UserExpenseCreateComponent,
    resolve: {
      userExpense: UserExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserExpenseUpdateComponent,
    resolve: {
      userExpense: UserExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserExpenseUpdateComponent,
    resolve: {
      userExpense: UserExpenseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userExpenseRoute;
