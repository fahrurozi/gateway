export interface IEmployee2 {
  id: string;
  name?: string | null;
}

export type NewEmployee2 = Omit<IEmployee2, 'id'> & { id: null };
