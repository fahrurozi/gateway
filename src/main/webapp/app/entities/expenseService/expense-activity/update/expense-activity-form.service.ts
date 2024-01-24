import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExpenseActivity, NewExpenseActivity } from '../expense-activity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExpenseActivity for edit and NewExpenseActivityFormGroupInput for create.
 */
type ExpenseActivityFormGroupInput = IExpenseActivity | PartialWithRequiredKeyOf<NewExpenseActivity>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IExpenseActivity | NewExpenseActivity> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ExpenseActivityFormRawValue = FormValueOf<IExpenseActivity>;

type NewExpenseActivityFormRawValue = FormValueOf<NewExpenseActivity>;

type ExpenseActivityFormDefaults = Pick<NewExpenseActivity, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ExpenseActivityFormGroupContent = {
  id: FormControl<ExpenseActivityFormRawValue['id'] | NewExpenseActivity['id']>;
  description: FormControl<ExpenseActivityFormRawValue['description']>;
  createdDate: FormControl<ExpenseActivityFormRawValue['createdDate']>;
  createdBy: FormControl<ExpenseActivityFormRawValue['createdBy']>;
  lastModifiedBy: FormControl<ExpenseActivityFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ExpenseActivityFormRawValue['lastModifiedDate']>;
  recordStatusId: FormControl<ExpenseActivityFormRawValue['recordStatusId']>;
  userExpense: FormControl<ExpenseActivityFormRawValue['userExpense']>;
  employee2: FormControl<ExpenseActivityFormRawValue['employee2']>;
};

export type ExpenseActivityFormGroup = FormGroup<ExpenseActivityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExpenseActivityFormService {
  createExpenseActivityFormGroup(expenseActivity: ExpenseActivityFormGroupInput = { id: null }): ExpenseActivityFormGroup {
    const expenseActivityRawValue = this.convertExpenseActivityToExpenseActivityRawValue({
      ...this.getFormDefaults(),
      ...expenseActivity,
    });
    return new FormGroup<ExpenseActivityFormGroupContent>({
      id: new FormControl(
        { value: expenseActivityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(expenseActivityRawValue.description, {
        validators: [Validators.maxLength(150)],
      }),
      createdDate: new FormControl(expenseActivityRawValue.createdDate, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(expenseActivityRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      lastModifiedBy: new FormControl(expenseActivityRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(expenseActivityRawValue.lastModifiedDate),
      recordStatusId: new FormControl(expenseActivityRawValue.recordStatusId, {
        validators: [Validators.required],
      }),
      userExpense: new FormControl(expenseActivityRawValue.userExpense),
      employee2: new FormControl(expenseActivityRawValue.employee2),
    });
  }

  getExpenseActivity(form: ExpenseActivityFormGroup): IExpenseActivity | NewExpenseActivity {
    return this.convertExpenseActivityRawValueToExpenseActivity(
      form.getRawValue() as ExpenseActivityFormRawValue | NewExpenseActivityFormRawValue,
    );
  }

  resetForm(form: ExpenseActivityFormGroup, expenseActivity: ExpenseActivityFormGroupInput): void {
    const expenseActivityRawValue = this.convertExpenseActivityToExpenseActivityRawValue({ ...this.getFormDefaults(), ...expenseActivity });
    form.reset(
      {
        ...expenseActivityRawValue,
        id: { value: expenseActivityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ExpenseActivityFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertExpenseActivityRawValueToExpenseActivity(
    rawExpenseActivity: ExpenseActivityFormRawValue | NewExpenseActivityFormRawValue,
  ): IExpenseActivity | NewExpenseActivity {
    return {
      ...rawExpenseActivity,
      createdDate: dayjs(rawExpenseActivity.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawExpenseActivity.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertExpenseActivityToExpenseActivityRawValue(
    expenseActivity: IExpenseActivity | (Partial<NewExpenseActivity> & ExpenseActivityFormDefaults),
  ): ExpenseActivityFormRawValue | PartialWithRequiredKeyOf<NewExpenseActivityFormRawValue> {
    return {
      ...expenseActivity,
      createdDate: expenseActivity.createdDate ? expenseActivity.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: expenseActivity.lastModifiedDate ? expenseActivity.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
