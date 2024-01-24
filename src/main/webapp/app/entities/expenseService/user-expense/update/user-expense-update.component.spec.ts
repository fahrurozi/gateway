import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IEmployee2 } from 'app/entities/expenseService/employee-2/employee-2.model';
import { Employee2Service } from 'app/entities/expenseService/employee-2/service/employee-2.service';
import { UserExpenseService } from '../service/user-expense.service';
import { IUserExpense } from '../user-expense.model';
import { UserExpenseFormService } from './user-expense-form.service';

import { UserExpenseUpdateComponent } from './user-expense-update.component';

describe('UserExpense Management Update Component', () => {
  let comp: UserExpenseUpdateComponent;
  let fixture: ComponentFixture<UserExpenseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userExpenseFormService: UserExpenseFormService;
  let userExpenseService: UserExpenseService;
  let employee2Service: Employee2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UserExpenseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UserExpenseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExpenseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userExpenseFormService = TestBed.inject(UserExpenseFormService);
    userExpenseService = TestBed.inject(UserExpenseService);
    employee2Service = TestBed.inject(Employee2Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Employee2 query and add missing value', () => {
      const userExpense: IUserExpense = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const employee2: IEmployee2 = { id: '3beb917d-9c07-406f-a243-dcaed25e5d41' };
      userExpense.employee2 = employee2;

      const employee2Collection: IEmployee2[] = [{ id: '7b8cc86b-d74a-472f-bad7-c1dd66a06025' }];
      jest.spyOn(employee2Service, 'query').mockReturnValue(of(new HttpResponse({ body: employee2Collection })));
      const additionalEmployee2s = [employee2];
      const expectedCollection: IEmployee2[] = [...additionalEmployee2s, ...employee2Collection];
      jest.spyOn(employee2Service, 'addEmployee2ToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userExpense });
      comp.ngOnInit();

      expect(employee2Service.query).toHaveBeenCalled();
      expect(employee2Service.addEmployee2ToCollectionIfMissing).toHaveBeenCalledWith(
        employee2Collection,
        ...additionalEmployee2s.map(expect.objectContaining),
      );
      expect(comp.employee2sSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userExpense: IUserExpense = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const employee2: IEmployee2 = { id: 'be7b438e-e149-4fe3-b123-7f30273b6231' };
      userExpense.employee2 = employee2;

      activatedRoute.data = of({ userExpense });
      comp.ngOnInit();

      expect(comp.employee2sSharedCollection).toContain(employee2);
      expect(comp.userExpense).toEqual(userExpense);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExpense>>();
      const userExpense = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(userExpenseFormService, 'getUserExpense').mockReturnValue(userExpense);
      jest.spyOn(userExpenseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExpense });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExpense }));
      saveSubject.complete();

      // THEN
      expect(userExpenseFormService.getUserExpense).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userExpenseService.update).toHaveBeenCalledWith(expect.objectContaining(userExpense));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExpense>>();
      const userExpense = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(userExpenseFormService, 'getUserExpense').mockReturnValue({ id: null });
      jest.spyOn(userExpenseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExpense: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExpense }));
      saveSubject.complete();

      // THEN
      expect(userExpenseFormService.getUserExpense).toHaveBeenCalled();
      expect(userExpenseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExpense>>();
      const userExpense = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(userExpenseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExpense });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userExpenseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee2', () => {
      it('Should forward to employee2Service', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(employee2Service, 'compareEmployee2');
        comp.compareEmployee2(entity, entity2);
        expect(employee2Service.compareEmployee2).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
