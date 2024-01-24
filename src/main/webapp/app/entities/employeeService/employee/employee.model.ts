import dayjs from 'dayjs/esm';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IEmployee {
  id: string;
  name?: string | null;
  gender?: keyof typeof Gender | null;
  position?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  recordStatusId?: number | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
