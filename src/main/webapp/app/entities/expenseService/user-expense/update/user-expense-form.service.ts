import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserExpense, NewUserExpense } from '../user-expense.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserExpense for edit and NewUserExpenseFormGroupInput for create.
 */
type UserExpenseFormGroupInput = IUserExpense | PartialWithRequiredKeyOf<NewUserExpense>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserExpense | NewUserExpense> = Omit<T, 'date' | 'createdDate' | 'lastModifiedDate'> & {
  date?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type UserExpenseFormRawValue = FormValueOf<IUserExpense>;

type NewUserExpenseFormRawValue = FormValueOf<NewUserExpense>;

type UserExpenseFormDefaults = Pick<NewUserExpense, 'id' | 'date' | 'createdDate' | 'lastModifiedDate'>;

type UserExpenseFormGroupContent = {
  id: FormControl<UserExpenseFormRawValue['id'] | NewUserExpense['id']>;
  date: FormControl<UserExpenseFormRawValue['date']>;
  category: FormControl<UserExpenseFormRawValue['category']>;
  total: FormControl<UserExpenseFormRawValue['total']>;
  evidence: FormControl<UserExpenseFormRawValue['evidence']>;
  exchangeRate: FormControl<UserExpenseFormRawValue['exchangeRate']>;
  acceptedTotal: FormControl<UserExpenseFormRawValue['acceptedTotal']>;
  status: FormControl<UserExpenseFormRawValue['status']>;
  createdDate: FormControl<UserExpenseFormRawValue['createdDate']>;
  lastModifiedDate: FormControl<UserExpenseFormRawValue['lastModifiedDate']>;
  recordStatusId: FormControl<UserExpenseFormRawValue['recordStatusId']>;
  createdBy: FormControl<UserExpenseFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<UserExpenseFormRawValue['lastModifiedBy']>;
  employee2: FormControl<UserExpenseFormRawValue['employee2']>;
};

export type UserExpenseFormGroup = FormGroup<UserExpenseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserExpenseFormService {
  createUserExpenseFormGroup(userExpense: UserExpenseFormGroupInput = { id: null }): UserExpenseFormGroup {
    const userExpenseRawValue = this.convertUserExpenseToUserExpenseRawValue({
      ...this.getFormDefaults(),
      ...userExpense,
    });
    return new FormGroup<UserExpenseFormGroupContent>({
      id: new FormControl(
        { value: userExpenseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(userExpenseRawValue.date, {
        validators: [Validators.required],
      }),
      category: new FormControl(userExpenseRawValue.category, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      total: new FormControl(userExpenseRawValue.total, {
        validators: [Validators.required, Validators.min(0)],
      }),
      evidence: new FormControl(userExpenseRawValue.evidence, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      exchangeRate: new FormControl(userExpenseRawValue.exchangeRate, {
        validators: [Validators.min(0)],
      }),
      acceptedTotal: new FormControl(userExpenseRawValue.acceptedTotal, {
        validators: [Validators.min(0)],
      }),
      status: new FormControl(userExpenseRawValue.status, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(userExpenseRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedDate: new FormControl(userExpenseRawValue.lastModifiedDate),
      recordStatusId: new FormControl(userExpenseRawValue.recordStatusId, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(userExpenseRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      lastModifiedBy: new FormControl(userExpenseRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      employee2: new FormControl(userExpenseRawValue.employee2),
    });
  }

  getUserExpense(form: UserExpenseFormGroup): IUserExpense | NewUserExpense {
    return this.convertUserExpenseRawValueToUserExpense(form.getRawValue() as UserExpenseFormRawValue | NewUserExpenseFormRawValue);
  }

  resetForm(form: UserExpenseFormGroup, userExpense: UserExpenseFormGroupInput): void {
    const userExpenseRawValue = this.convertUserExpenseToUserExpenseRawValue({ ...this.getFormDefaults(), ...userExpense });
    form.reset(
      {
        ...userExpenseRawValue,
        id: { value: userExpenseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserExpenseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertUserExpenseRawValueToUserExpense(
    rawUserExpense: UserExpenseFormRawValue | NewUserExpenseFormRawValue,
  ): IUserExpense | NewUserExpense {
    return {
      ...rawUserExpense,
      date: dayjs(rawUserExpense.date, DATE_TIME_FORMAT),
      createdDate: dayjs(rawUserExpense.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawUserExpense.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertUserExpenseToUserExpenseRawValue(
    userExpense: IUserExpense | (Partial<NewUserExpense> & UserExpenseFormDefaults),
  ): UserExpenseFormRawValue | PartialWithRequiredKeyOf<NewUserExpenseFormRawValue> {
    return {
      ...userExpense,
      date: userExpense.date ? userExpense.date.format(DATE_TIME_FORMAT) : undefined,
      createdDate: userExpense.createdDate ? userExpense.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: userExpense.lastModifiedDate ? userExpense.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
