import { Component } from '@angular/core';
import {IUserExpense} from "../user-expense.model";
import {UserExpenseService} from "../service/user-expense.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ITEM_SUBMITTED_EVENT} from "../../../../config/navigation.constants";
import {FormsModule} from "@angular/forms";
import SharedModule from "../../../../shared/shared.module";

@Component({
  standalone: true,
  selector: 'jhi-user-expense-submit-dialog',
  templateUrl: './user-expense-submit-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserExpenseSubmitDialogComponent {
  userExpense?: IUserExpense;

  constructor(
    protected userExpenseService: UserExpenseService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmSubmit(id: string): void {
    const statusData = { status: 'Waiting' };
    this.userExpenseService.changeStatus(id, statusData).subscribe(() => {
      this.activeModal.close(ITEM_SUBMITTED_EVENT);
    });
  }
}
