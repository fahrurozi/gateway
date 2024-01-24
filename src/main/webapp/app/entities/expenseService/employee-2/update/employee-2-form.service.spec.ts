import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../employee-2.test-samples';

import { Employee2FormService } from './employee-2-form.service';

describe('Employee2 Form Service', () => {
  let service: Employee2FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Employee2FormService);
  });

  describe('Service methods', () => {
    describe('createEmployee2FormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmployee2FormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IEmployee2 should create a new form with FormGroup', () => {
        const formGroup = service.createEmployee2FormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmployee2', () => {
      it('should return NewEmployee2 for default Employee2 initial value', () => {
        const formGroup = service.createEmployee2FormGroup(sampleWithNewData);

        const employee2 = service.getEmployee2(formGroup) as any;

        expect(employee2).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmployee2 for empty Employee2 initial value', () => {
        const formGroup = service.createEmployee2FormGroup();

        const employee2 = service.getEmployee2(formGroup) as any;

        expect(employee2).toMatchObject({});
      });

      it('should return IEmployee2', () => {
        const formGroup = service.createEmployee2FormGroup(sampleWithRequiredData);

        const employee2 = service.getEmployee2(formGroup) as any;

        expect(employee2).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmployee2 should not enable id FormControl', () => {
        const formGroup = service.createEmployee2FormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmployee2 should disable id FormControl', () => {
        const formGroup = service.createEmployee2FormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
