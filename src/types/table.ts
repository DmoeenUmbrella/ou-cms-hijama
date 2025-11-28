import type { Appointment } from "./appointments";
import type { Component } from "vue";

// Define the shape of a column definition item
export interface ColumnDef<TData> {
  accessorKey?: keyof TData | string;
  header: string | Component;
  cell: (props: {
    row: TData;
    getValue: () => any;
  }) => Component | string | number | undefined | null;
  enableSorting?: boolean;
  enableHiding?: boolean;
  minSize?: number;
  size?: number;
}
