export interface Clinic {
  id: number;
  name: string;
  address?: string;
  [key: string]: any;
}