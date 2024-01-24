import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INotification, NewNotification } from '../notification.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INotification for edit and NewNotificationFormGroupInput for create.
 */
type NotificationFormGroupInput = INotification | PartialWithRequiredKeyOf<NewNotification>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends INotification | NewNotification> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type NotificationFormRawValue = FormValueOf<INotification>;

type NewNotificationFormRawValue = FormValueOf<NewNotification>;

type NotificationFormDefaults = Pick<NewNotification, 'id' | 'isShow' | 'createdDate' | 'lastModifiedDate'>;

type NotificationFormGroupContent = {
  id: FormControl<NotificationFormRawValue['id'] | NewNotification['id']>;
  userId: FormControl<NotificationFormRawValue['userId']>;
  description: FormControl<NotificationFormRawValue['description']>;
  isShow: FormControl<NotificationFormRawValue['isShow']>;
  createdBy: FormControl<NotificationFormRawValue['createdBy']>;
  createdDate: FormControl<NotificationFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<NotificationFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<NotificationFormRawValue['lastModifiedDate']>;
  recordStatusId: FormControl<NotificationFormRawValue['recordStatusId']>;
};

export type NotificationFormGroup = FormGroup<NotificationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotificationFormService {
  createNotificationFormGroup(notification: NotificationFormGroupInput = { id: null }): NotificationFormGroup {
    const notificationRawValue = this.convertNotificationToNotificationRawValue({
      ...this.getFormDefaults(),
      ...notification,
    });
    return new FormGroup<NotificationFormGroupContent>({
      id: new FormControl(
        { value: notificationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      userId: new FormControl(notificationRawValue.userId, {
        validators: [Validators.required],
      }),
      description: new FormControl(notificationRawValue.description, {
        validators: [Validators.maxLength(150)],
      }),
      isShow: new FormControl(notificationRawValue.isShow, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(notificationRawValue.createdBy, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      createdDate: new FormControl(notificationRawValue.createdDate, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(notificationRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(notificationRawValue.lastModifiedDate),
      recordStatusId: new FormControl(notificationRawValue.recordStatusId, {
        validators: [Validators.required],
      }),
    });
  }

  getNotification(form: NotificationFormGroup): INotification | NewNotification {
    return this.convertNotificationRawValueToNotification(form.getRawValue() as NotificationFormRawValue | NewNotificationFormRawValue);
  }

  resetForm(form: NotificationFormGroup, notification: NotificationFormGroupInput): void {
    const notificationRawValue = this.convertNotificationToNotificationRawValue({ ...this.getFormDefaults(), ...notification });
    form.reset(
      {
        ...notificationRawValue,
        id: { value: notificationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): NotificationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isShow: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertNotificationRawValueToNotification(
    rawNotification: NotificationFormRawValue | NewNotificationFormRawValue,
  ): INotification | NewNotification {
    return {
      ...rawNotification,
      createdDate: dayjs(rawNotification.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawNotification.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertNotificationToNotificationRawValue(
    notification: INotification | (Partial<NewNotification> & NotificationFormDefaults),
  ): NotificationFormRawValue | PartialWithRequiredKeyOf<NewNotificationFormRawValue> {
    return {
      ...notification,
      createdDate: notification.createdDate ? notification.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: notification.lastModifiedDate ? notification.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
