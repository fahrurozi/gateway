import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExpenseActivityComponent } from './list/expense-activity.component';
import { ExpenseActivityDetailComponent } from './detail/expense-activity-detail.component';
import { ExpenseActivityUpdateComponent } from './update/expense-activity-update.component';
import ExpenseActivityResolve from './route/expense-activity-routing-resolve.service';

const expenseActivityRoute: Routes = [
  {
    path: '',
    component: ExpenseActivityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExpenseActivityDetailComponent,
    resolve: {
      expenseActivity: ExpenseActivityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExpenseActivityUpdateComponent,
    resolve: {
      expenseActivity: ExpenseActivityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExpenseActivityUpdateComponent,
    resolve: {
      expenseActivity: ExpenseActivityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default expenseActivityRoute;
