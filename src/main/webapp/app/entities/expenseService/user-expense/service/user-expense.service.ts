import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserExpense, NewUserExpense } from '../user-expense.model';

export type PartialUpdateUserExpense = Partial<IUserExpense> & Pick<IUserExpense, 'id'>;

type RestOf<T extends IUserExpense | NewUserExpense> = Omit<T, 'date' | 'createdDate' | 'lastModifiedDate'> & {
  date?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestUserExpense = RestOf<IUserExpense>;

export type NewRestUserExpense = RestOf<NewUserExpense>;

export type PartialUpdateRestUserExpense = RestOf<PartialUpdateUserExpense>;

export type EntityResponseType = HttpResponse<IUserExpense>;
export type EntityArrayResponseType = HttpResponse<IUserExpense[]>;

@Injectable({ providedIn: 'root' })
export class UserExpenseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-expenses', 'expenseservice');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(userExpense: NewUserExpense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userExpense);
    return this.http
      .post<RestUserExpense>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userExpense: IUserExpense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userExpense);
    return this.http
      .put<RestUserExpense>(`${this.resourceUrl}/${this.getUserExpenseIdentifier(userExpense)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userExpense: PartialUpdateUserExpense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userExpense);
    return this.http
      .patch<RestUserExpense>(`${this.resourceUrl}/${this.getUserExpenseIdentifier(userExpense)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestUserExpense>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserExpense[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserExpenseIdentifier(userExpense: Pick<IUserExpense, 'id'>): string {
    return userExpense.id;
  }

  compareUserExpense(o1: Pick<IUserExpense, 'id'> | null, o2: Pick<IUserExpense, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserExpenseIdentifier(o1) === this.getUserExpenseIdentifier(o2) : o1 === o2;
  }

  addUserExpenseToCollectionIfMissing<Type extends Pick<IUserExpense, 'id'>>(
    userExpenseCollection: Type[],
    ...userExpensesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userExpenses: Type[] = userExpensesToCheck.filter(isPresent);
    if (userExpenses.length > 0) {
      const userExpenseCollectionIdentifiers = userExpenseCollection.map(
        userExpenseItem => this.getUserExpenseIdentifier(userExpenseItem)!,
      );
      const userExpensesToAdd = userExpenses.filter(userExpenseItem => {
        const userExpenseIdentifier = this.getUserExpenseIdentifier(userExpenseItem);
        if (userExpenseCollectionIdentifiers.includes(userExpenseIdentifier)) {
          return false;
        }
        userExpenseCollectionIdentifiers.push(userExpenseIdentifier);
        return true;
      });
      return [...userExpensesToAdd, ...userExpenseCollection];
    }
    return userExpenseCollection;
  }

  protected convertDateFromClient<T extends IUserExpense | NewUserExpense | PartialUpdateUserExpense>(userExpense: T): RestOf<T> {
    return {
      ...userExpense,
      date: userExpense.date?.toJSON() ?? null,
      createdDate: userExpense.createdDate?.toJSON() ?? null,
      lastModifiedDate: userExpense.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUserExpense: RestUserExpense): IUserExpense {
    return {
      ...restUserExpense,
      date: restUserExpense.date ? dayjs(restUserExpense.date) : undefined,
      createdDate: restUserExpense.createdDate ? dayjs(restUserExpense.createdDate) : undefined,
      lastModifiedDate: restUserExpense.lastModifiedDate ? dayjs(restUserExpense.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserExpense>): HttpResponse<IUserExpense> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserExpense[]>): HttpResponse<IUserExpense[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
