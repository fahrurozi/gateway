import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEmployee2 } from 'app/entities/expenseService/employee-2/employee-2.model';
import { Employee2Service } from 'app/entities/expenseService/employee-2/service/employee-2.service';
import { Status } from 'app/entities/enumerations/status.model';
import { UserExpenseService } from '../service/user-expense.service';
import { IUserExpense } from '../user-expense.model';
import { UserExpenseFormService, UserExpenseFormGroup } from './user-expense-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-expense-update',
  templateUrl: './user-expense-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserExpenseUpdateComponent implements OnInit {
  isSaving = false;
  userExpense: IUserExpense | null = null;
  statusValues = Object.keys(Status);

  employee2sSharedCollection: IEmployee2[] = [];

  editForm: UserExpenseFormGroup = this.userExpenseFormService.createUserExpenseFormGroup();

  constructor(
    protected userExpenseService: UserExpenseService,
    protected userExpenseFormService: UserExpenseFormService,
    protected employee2Service: Employee2Service,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareEmployee2 = (o1: IEmployee2 | null, o2: IEmployee2 | null): boolean => this.employee2Service.compareEmployee2(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExpense }) => {
      this.userExpense = userExpense;
      if (userExpense) {
        this.updateForm(userExpense);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userExpense = this.userExpenseFormService.getUserExpense(this.editForm);
    if (userExpense.id !== null) {
      this.subscribeToSaveResponse(this.userExpenseService.update(userExpense));
    } else {
      this.subscribeToSaveResponse(this.userExpenseService.create(userExpense));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserExpense>>): void {
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

  protected updateForm(userExpense: IUserExpense): void {
    this.userExpense = userExpense;
    this.userExpenseFormService.resetForm(this.editForm, userExpense);

    this.employee2sSharedCollection = this.employee2Service.addEmployee2ToCollectionIfMissing<IEmployee2>(
      this.employee2sSharedCollection,
      userExpense.employee2,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employee2Service
      .query()
      .pipe(map((res: HttpResponse<IEmployee2[]>) => res.body ?? []))
      .pipe(
        map((employee2s: IEmployee2[]) =>
          this.employee2Service.addEmployee2ToCollectionIfMissing<IEmployee2>(employee2s, this.userExpense?.employee2),
        ),
      )
      .subscribe((employee2s: IEmployee2[]) => (this.employee2sSharedCollection = employee2s));
  }
}
