import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_RowData,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { DataTableProps } from './DataTable.types';
import FilterUI from './FilterUI';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'https://dummyjson.com';

const ClientSideDataTable = <TData extends MRT_RowData>({
  columns,
  apiUrl,
  filters,
  addButtonText,
  addButtonOnClick,
  customButtonUi,
  tableTitle,
  canExportExcel,
}: DataTableProps<TData>) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: [`${apiUrl}-data-table`],
    queryFn: async () => {
      const response = await fetch(`${API_URL}${apiUrl}`);
      const jsonResponse = await response.json();
      return jsonResponse.users; // Adjust based on API response structure
    },
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(() => data ?? [], [data]);
  const totalFetched = flatData.length;

  const table = useMaterialReactTable<TData>({
    columns,
    data: flatData,
    enablePagination: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enableHiding: false,
    muiToolbarAlertBannerProps: isError ? { color: 'error', children: 'Error loading data' } : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: { columnFilters, globalFilter, isLoading, showAlertBanner: isError, showProgressBars: isFetching, sorting },
    renderTopToolbarCustomActions: () => tableTitle && <Typography variant="h6">{tableTitle}</Typography>,
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        {canExportExcel && (
          <img
            key="Export Excel"
            className="option image right-side"
            src="/Content/images/excel-icon.png"
            alt="excel icon"
            onClick={() => console.log('Export to Excel')}
          />
        )}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        {customButtonUi}
        {addButtonText && addButtonOnClick && (
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addButtonOnClick}>
            {addButtonText}
          </Button>
        )}
      </Box>
    ),
  });

  return (
    <>
      {filters && (
        <FilterUI filters={filters} onApplyFilters={(selectedFilters) => console.log('Filters:', selectedFilters)} />
      )}
      <MaterialReactTable table={table} />
    </>
  );
};

export default ClientSideDataTable;
