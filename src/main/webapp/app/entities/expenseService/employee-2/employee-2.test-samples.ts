import { IEmployee2, NewEmployee2 } from './employee-2.model';

export const sampleWithRequiredData: IEmployee2 = {
  id: 'a9d84eaa-b0c2-43b6-854e-06fee2394da6',
  name: 'than questionably gently',
};

export const sampleWithPartialData: IEmployee2 = {
  id: 'e7b19c1d-b513-4f2b-bf0e-665c4146736e',
  name: 'official hefty compassionate',
};

export const sampleWithFullData: IEmployee2 = {
  id: 'c96c7860-4e06-4ae3-9d91-875a84a30e49',
  name: 'tensely',
};

export const sampleWithNewData: NewEmployee2 = {
  name: 'besides insist',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
