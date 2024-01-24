import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmployee2, NewEmployee2 } from '../employee-2.model';

export type PartialUpdateEmployee2 = Partial<IEmployee2> & Pick<IEmployee2, 'id'>;

export type EntityResponseType = HttpResponse<IEmployee2>;
export type EntityArrayResponseType = HttpResponse<IEmployee2[]>;

@Injectable({ providedIn: 'root' })
export class Employee2Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employee-2-s', 'expenseservice');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(employee2: NewEmployee2): Observable<EntityResponseType> {
    return this.http.post<IEmployee2>(this.resourceUrl, employee2, { observe: 'response' });
  }

  update(employee2: IEmployee2): Observable<EntityResponseType> {
    return this.http.put<IEmployee2>(`${this.resourceUrl}/${this.getEmployee2Identifier(employee2)}`, employee2, { observe: 'response' });
  }

  partialUpdate(employee2: PartialUpdateEmployee2): Observable<EntityResponseType> {
    return this.http.patch<IEmployee2>(`${this.resourceUrl}/${this.getEmployee2Identifier(employee2)}`, employee2, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IEmployee2>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployee2[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmployee2Identifier(employee2: Pick<IEmployee2, 'id'>): string {
    return employee2.id;
  }

  compareEmployee2(o1: Pick<IEmployee2, 'id'> | null, o2: Pick<IEmployee2, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmployee2Identifier(o1) === this.getEmployee2Identifier(o2) : o1 === o2;
  }

  addEmployee2ToCollectionIfMissing<Type extends Pick<IEmployee2, 'id'>>(
    employee2Collection: Type[],
    ...employee2sToCheck: (Type | null | undefined)[]
  ): Type[] {
    const employee2s: Type[] = employee2sToCheck.filter(isPresent);
    if (employee2s.length > 0) {
      const employee2CollectionIdentifiers = employee2Collection.map(employee2Item => this.getEmployee2Identifier(employee2Item)!);
      const employee2sToAdd = employee2s.filter(employee2Item => {
        const employee2Identifier = this.getEmployee2Identifier(employee2Item);
        if (employee2CollectionIdentifiers.includes(employee2Identifier)) {
          return false;
        }
        employee2CollectionIdentifiers.push(employee2Identifier);
        return true;
      });
      return [...employee2sToAdd, ...employee2Collection];
    }
    return employee2Collection;
  }
}
