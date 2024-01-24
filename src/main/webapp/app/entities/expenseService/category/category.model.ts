import dayjs from 'dayjs/esm';

export interface ICategory {
  id: string;
  name?: string | null;
  maxIdr?: number | null;
  maxAud?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  recordStatusId?: number | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
