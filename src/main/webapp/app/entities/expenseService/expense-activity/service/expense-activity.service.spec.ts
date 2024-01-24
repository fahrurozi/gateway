import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExpenseActivity } from '../expense-activity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../expense-activity.test-samples';

import { ExpenseActivityService, RestExpenseActivity } from './expense-activity.service';

const requireRestSample: RestExpenseActivity = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ExpenseActivity Service', () => {
  let service: ExpenseActivityService;
  let httpMock: HttpTestingController;
  let expectedResult: IExpenseActivity | IExpenseActivity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExpenseActivityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ExpenseActivity', () => {
      const expenseActivity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(expenseActivity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExpenseActivity', () => {
      const expenseActivity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(expenseActivity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExpenseActivity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExpenseActivity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExpenseActivity', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExpenseActivityToCollectionIfMissing', () => {
      it('should add a ExpenseActivity to an empty array', () => {
        const expenseActivity: IExpenseActivity = sampleWithRequiredData;
        expectedResult = service.addExpenseActivityToCollectionIfMissing([], expenseActivity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expenseActivity);
      });

      it('should not add a ExpenseActivity to an array that contains it', () => {
        const expenseActivity: IExpenseActivity = sampleWithRequiredData;
        const expenseActivityCollection: IExpenseActivity[] = [
          {
            ...expenseActivity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExpenseActivityToCollectionIfMissing(expenseActivityCollection, expenseActivity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExpenseActivity to an array that doesn't contain it", () => {
        const expenseActivity: IExpenseActivity = sampleWithRequiredData;
        const expenseActivityCollection: IExpenseActivity[] = [sampleWithPartialData];
        expectedResult = service.addExpenseActivityToCollectionIfMissing(expenseActivityCollection, expenseActivity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expenseActivity);
      });

      it('should add only unique ExpenseActivity to an array', () => {
        const expenseActivityArray: IExpenseActivity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const expenseActivityCollection: IExpenseActivity[] = [sampleWithRequiredData];
        expectedResult = service.addExpenseActivityToCollectionIfMissing(expenseActivityCollection, ...expenseActivityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const expenseActivity: IExpenseActivity = sampleWithRequiredData;
        const expenseActivity2: IExpenseActivity = sampleWithPartialData;
        expectedResult = service.addExpenseActivityToCollectionIfMissing([], expenseActivity, expenseActivity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expenseActivity);
        expect(expectedResult).toContain(expenseActivity2);
      });

      it('should accept null and undefined values', () => {
        const expenseActivity: IExpenseActivity = sampleWithRequiredData;
        expectedResult = service.addExpenseActivityToCollectionIfMissing([], null, expenseActivity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expenseActivity);
      });

      it('should return initial array if no ExpenseActivity is added', () => {
        const expenseActivityCollection: IExpenseActivity[] = [sampleWithRequiredData];
        expectedResult = service.addExpenseActivityToCollectionIfMissing(expenseActivityCollection, undefined, null);
        expect(expectedResult).toEqual(expenseActivityCollection);
      });
    });

    describe('compareExpenseActivity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExpenseActivity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareExpenseActivity(entity1, entity2);
        const compareResult2 = service.compareExpenseActivity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareExpenseActivity(entity1, entity2);
        const compareResult2 = service.compareExpenseActivity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareExpenseActivity(entity1, entity2);
        const compareResult2 = service.compareExpenseActivity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
