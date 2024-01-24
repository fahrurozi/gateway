import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUserExpense } from 'app/entities/expenseService/user-expense/user-expense.model';
import { UserExpenseService } from 'app/entities/expenseService/user-expense/service/user-expense.service';
import { IEmployee2 } from 'app/entities/expenseService/employee-2/employee-2.model';
import { Employee2Service } from 'app/entities/expenseService/employee-2/service/employee-2.service';
import { ExpenseActivityService } from '../service/expense-activity.service';
import { IExpenseActivity } from '../expense-activity.model';
import { ExpenseActivityFormService, ExpenseActivityFormGroup } from './expense-activity-form.service';

@Component({
  standalone: true,
  selector: 'jhi-expense-activity-update',
  templateUrl: './expense-activity-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExpenseActivityUpdateComponent implements OnInit {
  isSaving = false;
  expenseActivity: IExpenseActivity | null = null;

  userExpensesSharedCollection: IUserExpense[] = [];
  employee2sSharedCollection: IEmployee2[] = [];

  editForm: ExpenseActivityFormGroup = this.expenseActivityFormService.createExpenseActivityFormGroup();

  constructor(
    protected expenseActivityService: ExpenseActivityService,
    protected expenseActivityFormService: ExpenseActivityFormService,
    protected userExpenseService: UserExpenseService,
    protected employee2Service: Employee2Service,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUserExpense = (o1: IUserExpense | null, o2: IUserExpense | null): boolean => this.userExpenseService.compareUserExpense(o1, o2);

  compareEmployee2 = (o1: IEmployee2 | null, o2: IEmployee2 | null): boolean => this.employee2Service.compareEmployee2(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expenseActivity }) => {
      this.expenseActivity = expenseActivity;
      if (expenseActivity) {
        this.updateForm(expenseActivity);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const expenseActivity = this.expenseActivityFormService.getExpenseActivity(this.editForm);
    if (expenseActivity.id !== null) {
      this.subscribeToSaveResponse(this.expenseActivityService.update(expenseActivity));
    } else {
      this.subscribeToSaveResponse(this.expenseActivityService.create(expenseActivity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExpenseActivity>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(expenseActivity: IExpenseActivity): void {
    this.expenseActivity = expenseActivity;
    this.expenseActivityFormService.resetForm(this.editForm, expenseActivity);

    this.userExpensesSharedCollection = this.userExpenseService.addUserExpenseToCollectionIfMissing<IUserExpense>(
      this.userExpensesSharedCollection,
      expenseActivity.userExpense,
    );
    this.employee2sSharedCollection = this.employee2Service.addEmployee2ToCollectionIfMissing<IEmployee2>(
      this.employee2sSharedCollection,
      expenseActivity.employee2,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userExpenseService
      .query()
      .pipe(map((res: HttpResponse<IUserExpense[]>) => res.body ?? []))
      .pipe(
        map((userExpenses: IUserExpense[]) =>
          this.userExpenseService.addUserExpenseToCollectionIfMissing<IUserExpense>(userExpenses, this.expenseActivity?.userExpense),
        ),
      )
      .subscribe((userExpenses: IUserExpense[]) => (this.userExpensesSharedCollection = userExpenses));

    this.employee2Service
      .query()
      .pipe(map((res: HttpResponse<IEmployee2[]>) => res.body ?? []))
      .pipe(
        map((employee2s: IEmployee2[]) =>
          this.employee2Service.addEmployee2ToCollectionIfMissing<IEmployee2>(employee2s, this.expenseActivity?.employee2),
        ),
      )
      .subscribe((employee2s: IEmployee2[]) => (this.employee2sSharedCollection = employee2s));
  }
}
