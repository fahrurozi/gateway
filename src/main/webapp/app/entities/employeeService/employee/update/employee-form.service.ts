import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployee, NewEmployee } from '../employee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmployee for edit and NewEmployeeFormGroupInput for create.
 */
type EmployeeFormGroupInput = IEmployee | PartialWithRequiredKeyOf<NewEmployee>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmployee | NewEmployee> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EmployeeFormRawValue = FormValueOf<IEmployee>;

type NewEmployeeFormRawValue = FormValueOf<NewEmployee>;

type EmployeeFormDefaults = Pick<NewEmployee, 'id' | 'createdDate' | 'lastModifiedDate'>;

type EmployeeFormGroupContent = {
  id: FormControl<EmployeeFormRawValue['id'] | NewEmployee['id']>;
  name: FormControl<EmployeeFormRawValue['name']>;
  gender: FormControl<EmployeeFormRawValue['gender']>;
  position: FormControl<EmployeeFormRawValue['position']>;
  createdBy: FormControl<EmployeeFormRawValue['createdBy']>;
  createdDate: FormControl<EmployeeFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EmployeeFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EmployeeFormRawValue['lastModifiedDate']>;
  recordStatusId: FormControl<EmployeeFormRawValue['recordStatusId']>;
};

export type EmployeeFormGroup = FormGroup<EmployeeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmployeeFormService {
  createEmployeeFormGroup(employee: EmployeeFormGroupInput = { id: null }): EmployeeFormGroup {
    const employeeRawValue = this.convertEmployeeToEmployeeRawValue({
      ...this.getFormDefaults(),
      ...employee,
    });
    return new FormGroup<EmployeeFormGroupContent>({
      id: new FormControl(
        { value: employeeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(employeeRawValue.name, {
        validators: [Validators.required],
      }),
      gender: new FormControl(employeeRawValue.gender, {
        validators: [Validators.required],
      }),
      position: new FormControl(employeeRawValue.position, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(employeeRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(employeeRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(employeeRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(employeeRawValue.lastModifiedDate),
      recordStatusId: new FormControl(employeeRawValue.recordStatusId, {
        validators: [Validators.required],
      }),
    });
  }

  getEmployee(form: EmployeeFormGroup): IEmployee | NewEmployee {
    return this.convertEmployeeRawValueToEmployee(form.getRawValue() as EmployeeFormRawValue | NewEmployeeFormRawValue);
  }

  resetForm(form: EmployeeFormGroup, employee: EmployeeFormGroupInput): void {
    const employeeRawValue = this.convertEmployeeToEmployeeRawValue({ ...this.getFormDefaults(), ...employee });
    form.reset(
      {
        ...employeeRawValue,
        id: { value: employeeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EmployeeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEmployeeRawValueToEmployee(rawEmployee: EmployeeFormRawValue | NewEmployeeFormRawValue): IEmployee | NewEmployee {
    return {
      ...rawEmployee,
      createdDate: dayjs(rawEmployee.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEmployee.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEmployeeToEmployeeRawValue(
    employee: IEmployee | (Partial<NewEmployee> & EmployeeFormDefaults),
  ): EmployeeFormRawValue | PartialWithRequiredKeyOf<NewEmployeeFormRawValue> {
    return {
      ...employee,
      createdDate: employee.createdDate ? employee.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: employee.lastModifiedDate ? employee.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
