import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExpenseActivity, NewExpenseActivity } from '../expense-activity.model';

export type PartialUpdateExpenseActivity = Partial<IExpenseActivity> & Pick<IExpenseActivity, 'id'>;

type RestOf<T extends IExpenseActivity | NewExpenseActivity> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestExpenseActivity = RestOf<IExpenseActivity>;

export type NewRestExpenseActivity = RestOf<NewExpenseActivity>;

export type PartialUpdateRestExpenseActivity = RestOf<PartialUpdateExpenseActivity>;

export type EntityResponseType = HttpResponse<IExpenseActivity>;
export type EntityArrayResponseType = HttpResponse<IExpenseActivity[]>;

@Injectable({ providedIn: 'root' })
export class ExpenseActivityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/expense-activities', 'expenseservice');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(expenseActivity: NewExpenseActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenseActivity);
    return this.http
      .post<RestExpenseActivity>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(expenseActivity: IExpenseActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenseActivity);
    return this.http
      .put<RestExpenseActivity>(`${this.resourceUrl}/${this.getExpenseActivityIdentifier(expenseActivity)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(expenseActivity: PartialUpdateExpenseActivity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(expenseActivity);
    return this.http
      .patch<RestExpenseActivity>(`${this.resourceUrl}/${this.getExpenseActivityIdentifier(expenseActivity)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestExpenseActivity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExpenseActivity[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExpenseActivityIdentifier(expenseActivity: Pick<IExpenseActivity, 'id'>): string {
    return expenseActivity.id;
  }

  compareExpenseActivity(o1: Pick<IExpenseActivity, 'id'> | null, o2: Pick<IExpenseActivity, 'id'> | null): boolean {
    return o1 && o2 ? this.getExpenseActivityIdentifier(o1) === this.getExpenseActivityIdentifier(o2) : o1 === o2;
  }

  addExpenseActivityToCollectionIfMissing<Type extends Pick<IExpenseActivity, 'id'>>(
    expenseActivityCollection: Type[],
    ...expenseActivitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const expenseActivities: Type[] = expenseActivitiesToCheck.filter(isPresent);
    if (expenseActivities.length > 0) {
      const expenseActivityCollectionIdentifiers = expenseActivityCollection.map(
        expenseActivityItem => this.getExpenseActivityIdentifier(expenseActivityItem)!,
      );
      const expenseActivitiesToAdd = expenseActivities.filter(expenseActivityItem => {
        const expenseActivityIdentifier = this.getExpenseActivityIdentifier(expenseActivityItem);
        if (expenseActivityCollectionIdentifiers.includes(expenseActivityIdentifier)) {
          return false;
        }
        expenseActivityCollectionIdentifiers.push(expenseActivityIdentifier);
        return true;
      });
      return [...expenseActivitiesToAdd, ...expenseActivityCollection];
    }
    return expenseActivityCollection;
  }

  protected convertDateFromClient<T extends IExpenseActivity | NewExpenseActivity | PartialUpdateExpenseActivity>(
    expenseActivity: T,
  ): RestOf<T> {
    return {
      ...expenseActivity,
      createdDate: expenseActivity.createdDate?.toJSON() ?? null,
      lastModifiedDate: expenseActivity.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restExpenseActivity: RestExpenseActivity): IExpenseActivity {
    return {
      ...restExpenseActivity,
      createdDate: restExpenseActivity.createdDate ? dayjs(restExpenseActivity.createdDate) : undefined,
      lastModifiedDate: restExpenseActivity.lastModifiedDate ? dayjs(restExpenseActivity.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExpenseActivity>): HttpResponse<IExpenseActivity> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExpenseActivity[]>): HttpResponse<IExpenseActivity[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
