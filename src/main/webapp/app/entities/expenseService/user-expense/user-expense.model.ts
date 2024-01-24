import dayjs from 'dayjs/esm';
import { IEmployee2 } from 'app/entities/expenseService/employee-2/employee-2.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IUserExpense {
  id: string;
  date?: dayjs.Dayjs | null;
  category?: string | null;
  total?: number | null;
  evidence?: string | null;
  exchangeRate?: number | null;
  acceptedTotal?: number | null;
  status?: keyof typeof Status | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  recordStatusId?: number | null;
  createdBy?: string | null;
  lastModifiedBy?: string | null;
  employee2?: Pick<IEmployee2, 'id'> | null;
}

export type NewUserExpense = Omit<IUserExpense, 'id'> & { id: null };
