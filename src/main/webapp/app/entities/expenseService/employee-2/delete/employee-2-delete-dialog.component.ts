import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEmployee2 } from '../employee-2.model';
import { Employee2Service } from '../service/employee-2.service';

@Component({
  standalone: true,
  templateUrl: './employee-2-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class Employee2DeleteDialogComponent {
  employee2?: IEmployee2;

  constructor(
    protected employee2Service: Employee2Service,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.employee2Service.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
