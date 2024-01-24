import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../expense-activity.test-samples';

import { ExpenseActivityFormService } from './expense-activity-form.service';

describe('ExpenseActivity Form Service', () => {
  let service: ExpenseActivityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseActivityFormService);
  });

  describe('Service methods', () => {
    describe('createExpenseActivityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExpenseActivityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            recordStatusId: expect.any(Object),
            userExpense: expect.any(Object),
            employee2: expect.any(Object),
          }),
        );
      });

      it('passing IExpenseActivity should create a new form with FormGroup', () => {
        const formGroup = service.createExpenseActivityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            createdDate: expect.any(Object),
            createdBy: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            recordStatusId: expect.any(Object),
            userExpense: expect.any(Object),
            employee2: expect.any(Object),
          }),
        );
      });
    });

    describe('getExpenseActivity', () => {
      it('should return NewExpenseActivity for default ExpenseActivity initial value', () => {
        const formGroup = service.createExpenseActivityFormGroup(sampleWithNewData);

        const expenseActivity = service.getExpenseActivity(formGroup) as any;

        expect(expenseActivity).toMatchObject(sampleWithNewData);
      });

      it('should return NewExpenseActivity for empty ExpenseActivity initial value', () => {
        const formGroup = service.createExpenseActivityFormGroup();

        const expenseActivity = service.getExpenseActivity(formGroup) as any;

        expect(expenseActivity).toMatchObject({});
      });

      it('should return IExpenseActivity', () => {
        const formGroup = service.createExpenseActivityFormGroup(sampleWithRequiredData);

        const expenseActivity = service.getExpenseActivity(formGroup) as any;

        expect(expenseActivity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExpenseActivity should not enable id FormControl', () => {
        const formGroup = service.createExpenseActivityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExpenseActivity should disable id FormControl', () => {
        const formGroup = service.createExpenseActivityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
