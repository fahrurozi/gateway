import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICategory, NewCategory } from '../category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICategory for edit and NewCategoryFormGroupInput for create.
 */
type CategoryFormGroupInput = ICategory | PartialWithRequiredKeyOf<NewCategory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICategory | NewCategory> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CategoryFormRawValue = FormValueOf<ICategory>;

type NewCategoryFormRawValue = FormValueOf<NewCategory>;

type CategoryFormDefaults = Pick<NewCategory, 'id' | 'createdDate' | 'lastModifiedDate'>;

type CategoryFormGroupContent = {
  id: FormControl<CategoryFormRawValue['id'] | NewCategory['id']>;
  name: FormControl<CategoryFormRawValue['name']>;
  maxIdr: FormControl<CategoryFormRawValue['maxIdr']>;
  maxAud: FormControl<CategoryFormRawValue['maxAud']>;
  createdBy: FormControl<CategoryFormRawValue['createdBy']>;
  createdDate: FormControl<CategoryFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CategoryFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CategoryFormRawValue['lastModifiedDate']>;
  recordStatusId: FormControl<CategoryFormRawValue['recordStatusId']>;
};

export type CategoryFormGroup = FormGroup<CategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CategoryFormService {
  createCategoryFormGroup(category: CategoryFormGroupInput = { id: null }): CategoryFormGroup {
    const categoryRawValue = this.convertCategoryToCategoryRawValue({
      ...this.getFormDefaults(),
      ...category,
    });
    return new FormGroup<CategoryFormGroupContent>({
      id: new FormControl(
        { value: categoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(categoryRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      maxIdr: new FormControl(categoryRawValue.maxIdr, {
        validators: [Validators.required, Validators.min(0)],
      }),
      maxAud: new FormControl(categoryRawValue.maxAud, {
        validators: [Validators.required, Validators.min(0)],
      }),
      createdBy: new FormControl(categoryRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(categoryRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(categoryRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(categoryRawValue.lastModifiedDate),
      recordStatusId: new FormControl(categoryRawValue.recordStatusId, {
        validators: [Validators.required],
      }),
    });
  }

  getCategory(form: CategoryFormGroup): ICategory | NewCategory {
    return this.convertCategoryRawValueToCategory(form.getRawValue() as CategoryFormRawValue | NewCategoryFormRawValue);
  }

  resetForm(form: CategoryFormGroup, category: CategoryFormGroupInput): void {
    const categoryRawValue = this.convertCategoryToCategoryRawValue({ ...this.getFormDefaults(), ...category });
    form.reset(
      {
        ...categoryRawValue,
        id: { value: categoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CategoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertCategoryRawValueToCategory(rawCategory: CategoryFormRawValue | NewCategoryFormRawValue): ICategory | NewCategory {
    return {
      ...rawCategory,
      createdDate: dayjs(rawCategory.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCategory.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCategoryToCategoryRawValue(
    category: ICategory | (Partial<NewCategory> & CategoryFormDefaults),
  ): CategoryFormRawValue | PartialWithRequiredKeyOf<NewCategoryFormRawValue> {
    return {
      ...category,
      createdDate: category.createdDate ? category.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: category.lastModifiedDate ? category.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
