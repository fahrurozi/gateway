import dayjs from 'dayjs/esm';

import { IUserExpense, NewUserExpense } from './user-expense.model';

export const sampleWithRequiredData: IUserExpense = {
  id: 'e4b138d5-4943-4460-8258-6fe77ee78509',
  date: dayjs('2024-01-24T03:36'),
  category: 'heartfelt minority',
  total: 7828.36,
  evidence: 'coppice appearance overproduce',
  status: 'Revision',
  createdDate: dayjs('2024-01-23T04:01'),
  recordStatusId: 5692,
  createdBy: 'ha bah astride',
};

export const sampleWithPartialData: IUserExpense = {
  id: 'd2ef3296-c42b-4880-ad81-e5763b56f166',
  date: dayjs('2024-01-23T15:06'),
  category: 'hoarse around',
  total: 24985.72,
  evidence: 'mosque',
  exchangeRate: 16756.9,
  status: 'Revision',
  createdDate: dayjs('2024-01-24T01:41'),
  recordStatusId: 22722,
  createdBy: 'maintenance',
  lastModifiedBy: 'pickup entire clogs',
};

export const sampleWithFullData: IUserExpense = {
  id: 'c315d440-f957-40cc-83c0-e7c44fb1918b',
  date: dayjs('2024-01-23T09:24'),
  category: 'smug instead sticky',
  total: 24515.24,
  evidence: 'rapidly',
  exchangeRate: 11180.31,
  acceptedTotal: 19570.1,
  status: 'Revision',
  createdDate: dayjs('2024-01-23T09:37'),
  lastModifiedDate: dayjs('2024-01-24T01:01'),
  recordStatusId: 23363,
  createdBy: 'frizz without loudly',
  lastModifiedBy: 'hence golf nor',
};

export const sampleWithNewData: NewUserExpense = {
  date: dayjs('2024-01-23T08:13'),
  category: 'overload surprised',
  total: 19638.4,
  evidence: 'psst',
  status: 'NotSubmitted',
  createdDate: dayjs('2024-01-23T07:29'),
  recordStatusId: 919,
  createdBy: 'display slushy',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
