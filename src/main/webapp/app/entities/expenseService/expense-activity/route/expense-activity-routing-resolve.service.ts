import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExpenseActivity } from '../expense-activity.model';
import { ExpenseActivityService } from '../service/expense-activity.service';

export const expenseActivityResolve = (route: ActivatedRouteSnapshot): Observable<null | IExpenseActivity> => {
  const id = route.params['id'];
  if (id) {
    return inject(ExpenseActivityService)
      .find(id)
      .pipe(
        mergeMap((expenseActivity: HttpResponse<IExpenseActivity>) => {
          if (expenseActivity.body) {
            return of(expenseActivity.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default expenseActivityResolve;
