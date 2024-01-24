import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEmployee2 } from '../employee-2.model';
import { Employee2Service } from '../service/employee-2.service';
import { Employee2FormService, Employee2FormGroup } from './employee-2-form.service';

@Component({
  standalone: true,
  selector: 'jhi-employee-2-update',
  templateUrl: './employee-2-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class Employee2UpdateComponent implements OnInit {
  isSaving = false;
  employee2: IEmployee2 | null = null;

  editForm: Employee2FormGroup = this.employee2FormService.createEmployee2FormGroup();

  constructor(
    protected employee2Service: Employee2Service,
    protected employee2FormService: Employee2FormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee2 }) => {
      this.employee2 = employee2;
      if (employee2) {
        this.updateForm(employee2);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employee2 = this.employee2FormService.getEmployee2(this.editForm);
    if (employee2.id !== null) {
      this.subscribeToSaveResponse(this.employee2Service.update(employee2));
    } else {
      this.subscribeToSaveResponse(this.employee2Service.create(employee2));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployee2>>): void {
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

  protected updateForm(employee2: IEmployee2): void {
    this.employee2 = employee2;
    this.employee2FormService.resetForm(this.editForm, employee2);
  }
}
