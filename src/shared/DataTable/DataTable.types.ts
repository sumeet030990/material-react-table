import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

export type FilterOption = {
  label: string;
  labelKey: string;
  type: 'checkbox' | 'dropdown' | 'radio' | 'date_range' | 'date'; 
  options?: { [key: string]: string }; // Key-value pair of filter values
};

export interface FilterUIProps {
  filters: FilterOption[];
  onApplyFilters: (selectedFilters: Record<string, string | string[]>) => void;
}

export interface DataTableProps<TData extends MRT_RowData> {
  columns: MRT_ColumnDef<TData>[]; // Dynamic columns based on data type
  fetchSize?: number; // Number of records per fetch
  apiUrl: string; // API endpoint URL
  filters?: FilterOption[]; // Dynamic filter options
  addButtonText?: string;
  addButtonOnClick?: () => void;
  customButtonUi?: React.ReactNode; // Custom button UI
  tableTitle?: string; // Title for the table
  canExportExcel: boolean;
  pageSize?: number; // Number of records per page
}