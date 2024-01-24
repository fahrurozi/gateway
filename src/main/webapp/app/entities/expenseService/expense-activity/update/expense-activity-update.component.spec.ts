import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUserExpense } from 'app/entities/expenseService/user-expense/user-expense.model';
import { UserExpenseService } from 'app/entities/expenseService/user-expense/service/user-expense.service';
import { IEmployee2 } from 'app/entities/expenseService/employee-2/employee-2.model';
import { Employee2Service } from 'app/entities/expenseService/employee-2/service/employee-2.service';
import { IExpenseActivity } from '../expense-activity.model';
import { ExpenseActivityService } from '../service/expense-activity.service';
import { ExpenseActivityFormService } from './expense-activity-form.service';

import { ExpenseActivityUpdateComponent } from './expense-activity-update.component';

describe('ExpenseActivity Management Update Component', () => {
  let comp: ExpenseActivityUpdateComponent;
  let fixture: ComponentFixture<ExpenseActivityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let expenseActivityFormService: ExpenseActivityFormService;
  let expenseActivityService: ExpenseActivityService;
  let userExpenseService: UserExpenseService;
  let employee2Service: Employee2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ExpenseActivityUpdateComponent],
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
      .overrideTemplate(ExpenseActivityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExpenseActivityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    expenseActivityFormService = TestBed.inject(ExpenseActivityFormService);
    expenseActivityService = TestBed.inject(ExpenseActivityService);
    userExpenseService = TestBed.inject(UserExpenseService);
    employee2Service = TestBed.inject(Employee2Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserExpense query and add missing value', () => {
      const expenseActivity: IExpenseActivity = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const userExpense: IUserExpense = { id: '4fc5ef30-6e30-4654-abd4-a249357e212b' };
      expenseActivity.userExpense = userExpense;

      const userExpenseCollection: IUserExpense[] = [{ id: '4864b437-de48-43a2-ba56-86e29ccff0c7' }];
      jest.spyOn(userExpenseService, 'query').mockReturnValue(of(new HttpResponse({ body: userExpenseCollection })));
      const additionalUserExpenses = [userExpense];
      const expectedCollection: IUserExpense[] = [...additionalUserExpenses, ...userExpenseCollection];
      jest.spyOn(userExpenseService, 'addUserExpenseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ expenseActivity });
      comp.ngOnInit();

      expect(userExpenseService.query).toHaveBeenCalled();
      expect(userExpenseService.addUserExpenseToCollectionIfMissing).toHaveBeenCalledWith(
        userExpenseCollection,
        ...additionalUserExpenses.map(expect.objectContaining),
      );
      expect(comp.userExpensesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Employee2 query and add missing value', () => {
      const expenseActivity: IExpenseActivity = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const employee2: IEmployee2 = { id: '8e7c1c05-14db-4abd-b79a-880c0b4f92fb' };
      expenseActivity.employee2 = employee2;

      const employee2Collection: IEmployee2[] = [{ id: '14a32876-783f-4c7e-ae31-e841fe1999c7' }];
      jest.spyOn(employee2Service, 'query').mockReturnValue(of(new HttpResponse({ body: employee2Collection })));
      const additionalEmployee2s = [employee2];
      const expectedCollection: IEmployee2[] = [...additionalEmployee2s, ...employee2Collection];
      jest.spyOn(employee2Service, 'addEmployee2ToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ expenseActivity });
      comp.ngOnInit();

      expect(employee2Service.query).toHaveBeenCalled();
      expect(employee2Service.addEmployee2ToCollectionIfMissing).toHaveBeenCalledWith(
        employee2Collection,
        ...additionalEmployee2s.map(expect.objectContaining),
      );
      expect(comp.employee2sSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const expenseActivity: IExpenseActivity = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const userExpense: IUserExpense = { id: '224f8f58-5396-44f7-b875-fdbe397096bc' };
      expenseActivity.userExpense = userExpense;
      const employee2: IEmployee2 = { id: '8c5cf848-2786-44f3-b274-5bb3cdac1dbe' };
      expenseActivity.employee2 = employee2;

      activatedRoute.data = of({ expenseActivity });
      comp.ngOnInit();

      expect(comp.userExpensesSharedCollection).toContain(userExpense);
      expect(comp.employee2sSharedCollection).toContain(employee2);
      expect(comp.expenseActivity).toEqual(expenseActivity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenseActivity>>();
      const expenseActivity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(expenseActivityFormService, 'getExpenseActivity').mockReturnValue(expenseActivity);
      jest.spyOn(expenseActivityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenseActivity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expenseActivity }));
      saveSubject.complete();

      // THEN
      expect(expenseActivityFormService.getExpenseActivity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(expenseActivityService.update).toHaveBeenCalledWith(expect.objectContaining(expenseActivity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenseActivity>>();
      const expenseActivity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(expenseActivityFormService, 'getExpenseActivity').mockReturnValue({ id: null });
      jest.spyOn(expenseActivityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenseActivity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: expenseActivity }));
      saveSubject.complete();

      // THEN
      expect(expenseActivityFormService.getExpenseActivity).toHaveBeenCalled();
      expect(expenseActivityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExpenseActivity>>();
      const expenseActivity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(expenseActivityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ expenseActivity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(expenseActivityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserExpense', () => {
      it('Should forward to userExpenseService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(userExpenseService, 'compareUserExpense');
        comp.compareUserExpense(entity, entity2);
        expect(userExpenseService.compareUserExpense).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
