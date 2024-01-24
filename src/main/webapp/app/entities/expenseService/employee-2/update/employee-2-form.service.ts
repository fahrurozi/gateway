import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmployee2, NewEmployee2 } from '../employee-2.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmployee2 for edit and NewEmployee2FormGroupInput for create.
 */
type Employee2FormGroupInput = IEmployee2 | PartialWithRequiredKeyOf<NewEmployee2>;

type Employee2FormDefaults = Pick<NewEmployee2, 'id'>;

type Employee2FormGroupContent = {
  id: FormControl<IEmployee2['id'] | NewEmployee2['id']>;
  name: FormControl<IEmployee2['name']>;
};

export type Employee2FormGroup = FormGroup<Employee2FormGroupContent>;

@Injectable({ providedIn: 'root' })
export class Employee2FormService {
  createEmployee2FormGroup(employee2: Employee2FormGroupInput = { id: null }): Employee2FormGroup {
    const employee2RawValue = {
      ...this.getFormDefaults(),
      ...employee2,
    };
    return new FormGroup<Employee2FormGroupContent>({
      id: new FormControl(
        { value: employee2RawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(employee2RawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getEmployee2(form: Employee2FormGroup): IEmployee2 | NewEmployee2 {
    return form.getRawValue() as IEmployee2 | NewEmployee2;
  }

  resetForm(form: Employee2FormGroup, employee2: Employee2FormGroupInput): void {
    const employee2RawValue = { ...this.getFormDefaults(), ...employee2 };
    form.reset(
      {
        ...employee2RawValue,
        id: { value: employee2RawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): Employee2FormDefaults {
    return {
      id: null,
    };
  }
}
