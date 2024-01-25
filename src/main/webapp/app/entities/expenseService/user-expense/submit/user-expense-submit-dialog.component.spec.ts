import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpenseSubmitDialogComponent } from './user-expense-submit-dialog.component';

describe('UserExpenseSubmitDialogComponent', () => {
  let component: UserExpenseSubmitDialogComponent;
  let fixture: ComponentFixture<UserExpenseSubmitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserExpenseSubmitDialogComponent]
    });
    fixture = TestBed.createComponent(UserExpenseSubmitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
