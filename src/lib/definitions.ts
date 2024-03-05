export interface User {
  id: string;
  about: string | null;
  created: Date;
  karma: number;
  submitted: number[];
}
