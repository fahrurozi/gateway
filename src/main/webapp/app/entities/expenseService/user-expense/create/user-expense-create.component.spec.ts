import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpenseCreateComponent } from './user-expense-create.component';

describe('UserExpenseCreateComponent', () => {
  let component: UserExpenseCreateComponent;
  let fixture: ComponentFixture<UserExpenseCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserExpenseCreateComponent]
    });
    fixture = TestBed.createComponent(UserExpenseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
