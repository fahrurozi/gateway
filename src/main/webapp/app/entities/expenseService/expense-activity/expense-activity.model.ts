import dayjs from 'dayjs/esm';
import { IUserExpense } from 'app/entities/expenseService/user-expense/user-expense.model';
import { IEmployee2 } from 'app/entities/expenseService/employee-2/employee-2.model';

export interface IExpenseActivity {
  id: string;
  description?: string | null;
  createdDate?: dayjs.Dayjs | null;
  createdBy?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  recordStatusId?: number | null;
  userExpense?: Pick<IUserExpense, 'id'> | null;
  employee2?: Pick<IEmployee2, 'id'> | null;
}

export type NewExpenseActivity = Omit<IExpenseActivity, 'id'> & { id: null };
