import dayjs from 'dayjs/esm';

import { IExpenseActivity, NewExpenseActivity } from './expense-activity.model';

export const sampleWithRequiredData: IExpenseActivity = {
  id: '28527a73-f358-455a-91bf-4dee7e2adfdf',
  createdDate: dayjs('2024-01-24T02:30'),
  createdBy: 'nearly eek',
  recordStatusId: 31005,
};

export const sampleWithPartialData: IExpenseActivity = {
  id: 'adbb94d2-c4ca-44fc-a595-0b2cdd84daaf',
  createdDate: dayjs('2024-01-23T20:26'),
  createdBy: 'mushy than espadrille',
  recordStatusId: 15629,
};

export const sampleWithFullData: IExpenseActivity = {
  id: '4ee825ad-fae4-4043-91f1-5081fb31503b',
  description: 'book',
  createdDate: dayjs('2024-01-23T04:23'),
  createdBy: 'failing hence openly',
  lastModifiedBy: 'briskly qua',
  lastModifiedDate: dayjs('2024-01-23T23:31'),
  recordStatusId: 29313,
};

export const sampleWithNewData: NewExpenseActivity = {
  createdDate: dayjs('2024-01-23T07:55'),
  createdBy: 'flummox reassuringly at',
  recordStatusId: 8392,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
