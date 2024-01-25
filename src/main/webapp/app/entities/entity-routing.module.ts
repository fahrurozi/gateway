import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Authority} from "../config/authority.constants";
import {UserRouteAccessService} from "../core/auth/user-route-access.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'category',
        canActivate: [UserRouteAccessService],
        data: { pageTitle: 'gatewayApp.expenseServiceCategory.home.title' , authorities: [Authority.ADMIN]},
        loadChildren: () => import('./expenseService/category/category.routes'),
      },
      {
        path: 'user-expense',
        data: { pageTitle: 'gatewayApp.expenseServiceUserExpense.home.title' },
        loadChildren: () => import('./expenseService/user-expense/user-expense.routes'),
      },
      {
        path: 'expense-activity',
        data: { pageTitle: 'gatewayApp.expenseServiceExpenseActivity.home.title' },
        loadChildren: () => import('./expenseService/expense-activity/expense-activity.routes'),
      },
      {
        path: 'notification',
        data: { pageTitle: 'gatewayApp.notificationServiceNotification.home.title' },
        loadChildren: () => import('./notificationService/notification/notification.routes'),
      },
      {
        path: 'employee',
        data: { pageTitle: 'gatewayApp.employeeServiceEmployee.home.title' },
        loadChildren: () => import('./employeeService/employee/employee.routes'),
      },
      {
        path: 'employee-2',
        data: { pageTitle: 'gatewayApp.expenseServiceEmployee2.home.title' },
        loadChildren: () => import('./expenseService/employee-2/employee-2.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
