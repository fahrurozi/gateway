import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserExpense } from '../user-expense.model';
import { UserExpenseService } from '../service/user-expense.service';

@Component({
  standalone: true,
  templateUrl: './user-expense-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserExpenseDeleteDialogComponent {
  userExpense?: IUserExpense;

  constructor(
    protected userExpenseService: UserExpenseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.userExpenseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
