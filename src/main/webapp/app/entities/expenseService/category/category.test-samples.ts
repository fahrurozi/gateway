import dayjs from 'dayjs/esm';

import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: '4e5a3680-c30a-4aa3-bcdb-e40f646a47bd',
  name: 'novel for',
  maxIdr: 26247.54,
  maxAud: 13406.07,
  createdBy: 'which',
  createdDate: dayjs('2024-01-23T14:27'),
  recordStatusId: 638,
};

export const sampleWithPartialData: ICategory = {
  id: 'a72c4b29-26a2-4167-a2db-41ff9637ea14',
  name: 'squander',
  maxIdr: 17943.23,
  maxAud: 2404.54,
  createdBy: 'nor',
  createdDate: dayjs('2024-01-23T09:53'),
  lastModifiedBy: 'brr',
  recordStatusId: 25714,
};

export const sampleWithFullData: ICategory = {
  id: 'ceb3225a-3f81-407e-a742-f0165d99323a',
  name: 'outside quartet since',
  maxIdr: 16756.25,
  maxAud: 16386.64,
  createdBy: 'fooey which patiently',
  createdDate: dayjs('2024-01-23T19:14'),
  lastModifiedBy: 'awkwardly yahoo rigid',
  lastModifiedDate: dayjs('2024-01-23T13:30'),
  recordStatusId: 2467,
};

export const sampleWithNewData: NewCategory = {
  name: 'sadly',
  maxIdr: 5672.23,
  maxAud: 11387.71,
  createdBy: 'checkmate yet',
  createdDate: dayjs('2024-01-23T18:17'),
  recordStatusId: 13331,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
