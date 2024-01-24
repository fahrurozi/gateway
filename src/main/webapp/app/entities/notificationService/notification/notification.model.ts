import dayjs from 'dayjs/esm';

export interface INotification {
  id: string;
  userId?: string | null;
  description?: string | null;
  isShow?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  recordStatusId?: number | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
