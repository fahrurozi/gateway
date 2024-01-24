import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserExpense } from '../user-expense.model';
import { UserExpenseService } from '../service/user-expense.service';

export const userExpenseResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserExpense> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserExpenseService)
      .find(id)
      .pipe(
        mergeMap((userExpense: HttpResponse<IUserExpense>) => {
          if (userExpense.body) {
            return of(userExpense.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userExpenseResolve;
