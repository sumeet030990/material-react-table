/* eslint-disable react/jsx-pascal-case */
import { type UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_RowVirtualizer,
  type MRT_RowData,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import { Box, Button, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DataTableProps } from './DataTable.types';
import FilterUI from './FilterUI';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'https://dummyjson.com';

const ServerSideDataTable = <TData extends MRT_RowData>({
  columns,
  fetchSize = 20,
  apiUrl,
  filters, // Dynamic filters passed as props
  addButtonText,
  addButtonOnClick,
  customButtonUi,
  tableTitle,
  canExportExcel,
}: DataTableProps<TData>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } = useInfiniteQuery({
    queryKey: [`${apiUrl}-data-table`, { columnFilters, globalFilter, sorting }],
    queryFn: async ({ pageParam = 0 }) => {
      // Convert filters to query parameters
      const filterParams = `${globalFilter ? `search=${encodeURIComponent(globalFilter)}` : ''}`;

      // Convert sorting to query parameters
      const sortingParams = sorting.map(({ id, desc }) => `sortBy=${id}&order=${desc ? 'desc' : 'asc'}`).join('&');

      const queryString = `${filterParams ? `&${filterParams}` : ''}${sortingParams ? `&${sortingParams}` : ''}`;

      const response = await fetch(
        `${API_URL}${apiUrl}?skip=${pageParam * fetchSize}&limit=${fetchSize}${queryString}`
      );

      const jsonResponse = await response.json();

      // need to change the return value to match the expected format
      return {
        items: jsonResponse.users,
        total: jsonResponse.total,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.items).length;
      const totalAvailable = lastPage?.total ?? 0;
      if (totalFetched >= totalAvailable) return undefined;
      if (lastPage?.items?.length < fetchSize) return undefined;
      return allPages.length;
    },
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const totalDBRowCount = data?.pages?.[0]?.total ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 400 && !isFetching && totalFetched < totalDBRowCount) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  // Function to handle Excel export
  // This function contains code from base Table, so ll need to format the code once ll do the integration
  const handleExportExcel = async () => {
    // function displayModalTable(value) {
    //   let filterArrFromVal = modalOptionData.filter((x) => x.configSettings.key === value);
    //   let filterObjFromVal = filterArrFromVal[0];
    //   let selectDataArr = Object.entries(filterObjFromVal.configSettings.value);
    //   let tableFields = { [value]: { displayName: value, width: 20 } };
    //   tableFields = filterObjFromVal.shouldRenderId
    //     ? (tableFields = { id: { displayName: 'Id', width: 20 }, ...tableFields })
    //     : tableFields;
    //   let tableRowData = selectDataArr.map((x) => {
    //     let recordRowData = {
    //       id: parseInt(x[0]),
    //       [value]: x[1],
    //     };
    //     return recordRowData;
    //   });
    //   setModalTableFields(tableFields);
    //   setModalTableRows(tableRowData);
    // }
    // await gApp.loadingOn(async () => {
    //    try {
    //      let fields = this.props.excelData ? this.props.excelData.columns : this.props.fields;
    //      let data = this.props.excelData ? this.props.excelData.data : this.state.processedData;
    //      let fileName = this.props.tableName ? this.props.tableName + '_' : 'Export_';
    //      fileName += new Date().getTime();
    //      let headerNameMap = {};
    //      Object.keys(fields).forEach((key) => {
    //        let obj = fields[key];
    //        if (!obj.ignoreOnExcel) {
    //          headerNameMap[key] = obj.displayName != null ? obj.displayName : nblyu.camelCaseToSpaced(key);
    //        }
    //      });
    //      let payloadData = data.reduce((r, dat) => {
    //        let tmpObj = {};
    //        Object.keys(fields).forEach((key) => {
    //          let columnInfo = fields[key];
    //          if (!columnInfo.ignoreOnExcel) {
    //            tmpObj[key] = columnInfo.excelFormatter
    //              ? columnInfo.excelFormatter(dat)
    //              : columnInfo.formatter
    //                ? columnInfo.formatter(dat[key])
    //                : dat[key];
    //          }
    //        });
    //        r.push(tmpObj);
    //        return r;
    //      }, []);
    //      let payload = {
    //        fileName: fileName + '.xlsx',
    //        headerNameMap: headerNameMap,
    //        data: payloadData,
    //      };
    //      new GenericExportService().exportToExcel(
    //        JSON.stringify(payload),
    //        () => {
    //          gApp.loadingOff();
    //        },
    //        () => {
    //          gApp.loadingOff();
    //        }
    //      );
    //    } catch {
    //      gApp.loadingOff();
    //    }
    // });
  };
  const table = useMaterialReactTable<TData>({
    columns,
    data: flatData,
    enablePagination: false,
    enableRowVirtualization: true,
    enableGlobalFilter: true,
    enableColumnFilters: true, // per column filtering
    enableHiding: false, // show/hide columns
    muiTableContainerProps: {
      ref: tableContainerRef,
      sx: { maxHeight: '600px' },
      onScroll: (event: UIEvent<HTMLDivElement>) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
    },
    muiToolbarAlertBannerProps: isError ? { color: 'error', children: 'Error loading data' } : undefined,
    onColumnFiltersChange: setColumnFilters, // Capture filtering state
    onGlobalFilterChange: setGlobalFilter, // Capture global filter state
    onSortingChange: setSorting, // Capture sorting state
    renderBottomToolbarCustomActions: () => (
      <Typography>
        Fetched {totalFetched} of {totalDBRowCount} total rows.
      </Typography>
    ),
    state: { columnFilters, globalFilter, isLoading, showAlertBanner: isError, showProgressBars: isFetching, sorting },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        tableTitle && (
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {tableTitle}
          </Typography>
        )
      );
    },
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        {canExportExcel && (
          <img
            key="Export Excel"
            className="option image right-side"
            src="/Content/images/excel-icon.png"
            alt="excel icon"
            onClick={handleExportExcel}
          ></img>
        )}
        {/* along-side built-in buttons in whatever order you want them */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />

        {/* Custom Button */}
        {customButtonUi ? customButtonUi : null}

        {/* Add Button */}
        {addButtonText && addButtonOnClick && (
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addButtonOnClick}>
            {addButtonText}
          </Button>
        )}
      </Box>
    ),
  });

  const handleApplyFilters = (selectedFilters: Record<string, string | string[]>) => {
    console.log('Selected Filters:', selectedFilters);
  };

  return (
    <>
      {filters && <FilterUI filters={filters} onApplyFilters={handleApplyFilters} />}
      <MaterialReactTable table={table} />
    </>
  );
};

export default ServerSideDataTable;
