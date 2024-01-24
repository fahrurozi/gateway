import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-expense.test-samples';

import { UserExpenseFormService } from './user-expense-form.service';

describe('UserExpense Form Service', () => {
  let service: UserExpenseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExpenseFormService);
  });

  describe('Service methods', () => {
    describe('createUserExpenseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserExpenseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            category: expect.any(Object),
            total: expect.any(Object),
            evidence: expect.any(Object),
            exchangeRate: expect.any(Object),
            acceptedTotal: expect.any(Object),
            status: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            recordStatusId: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            employee2: expect.any(Object),
          }),
        );
      });

      it('passing IUserExpense should create a new form with FormGroup', () => {
        const formGroup = service.createUserExpenseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            category: expect.any(Object),
            total: expect.any(Object),
            evidence: expect.any(Object),
            exchangeRate: expect.any(Object),
            acceptedTotal: expect.any(Object),
            status: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            recordStatusId: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            employee2: expect.any(Object),
          }),
        );
      });
    });

    describe('getUserExpense', () => {
      it('should return NewUserExpense for default UserExpense initial value', () => {
        const formGroup = service.createUserExpenseFormGroup(sampleWithNewData);

        const userExpense = service.getUserExpense(formGroup) as any;

        expect(userExpense).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserExpense for empty UserExpense initial value', () => {
        const formGroup = service.createUserExpenseFormGroup();

        const userExpense = service.getUserExpense(formGroup) as any;

        expect(userExpense).toMatchObject({});
      });

      it('should return IUserExpense', () => {
        const formGroup = service.createUserExpenseFormGroup(sampleWithRequiredData);

        const userExpense = service.getUserExpense(formGroup) as any;

        expect(userExpense).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserExpense should not enable id FormControl', () => {
        const formGroup = service.createUserExpenseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserExpense should disable id FormControl', () => {
        const formGroup = service.createUserExpenseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
