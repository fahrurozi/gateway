import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployee2 } from '../employee-2.model';
import { Employee2Service } from '../service/employee-2.service';

export const employee2Resolve = (route: ActivatedRouteSnapshot): Observable<null | IEmployee2> => {
  const id = route.params['id'];
  if (id) {
    return inject(Employee2Service)
      .find(id)
      .pipe(
        mergeMap((employee2: HttpResponse<IEmployee2>) => {
          if (employee2.body) {
            return of(employee2.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default employee2Resolve;
