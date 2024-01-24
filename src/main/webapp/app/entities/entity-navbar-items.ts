import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Category',
    route: '/category',
    translationKey: 'global.menu.entities.expenseServiceCategory',
  },
  {
    name: 'UserExpense',
    route: '/user-expense',
    translationKey: 'global.menu.entities.expenseServiceUserExpense',
  },
  {
    name: 'ExpenseActivity',
    route: '/expense-activity',
    translationKey: 'global.menu.entities.expenseServiceExpenseActivity',
  },
  {
    name: 'Notification',
    route: '/notification',
    translationKey: 'global.menu.entities.notificationServiceNotification',
  },
  {
    name: 'Employee',
    route: '/employee',
    translationKey: 'global.menu.entities.employeeServiceEmployee',
  },
  {
    name: 'Employee2',
    route: '/employee-2',
    translationKey: 'global.menu.entities.expenseServiceEmployee2',
  },
];
