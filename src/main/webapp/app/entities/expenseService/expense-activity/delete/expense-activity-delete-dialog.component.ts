import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IExpenseActivity } from '../expense-activity.model';
import { ExpenseActivityService } from '../service/expense-activity.service';

@Component({
  standalone: true,
  templateUrl: './expense-activity-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ExpenseActivityDeleteDialogComponent {
  expenseActivity?: IExpenseActivity;

  constructor(
    protected expenseActivityService: ExpenseActivityService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.expenseActivityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
