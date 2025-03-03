import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../shared/DataTable/DataTable';
import { FilterOption } from '../shared/DataTable/DataTable.types';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


type User = {
  firstName: string;
  lastName: string;
  address: { city: string; state: string };
  phone: string;
};

function Users() {
  const columns: MRT_ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'Id',
      grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
      size: 80, //small column
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      minSize: 100, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 180, //medium column
    },
    { accessorKey: 'lastName', header: 'Last Name' },
    {
      accessorKey: 'address.city',
      header: 'Address',
      grow: true, //allow this column to grow to fill in remaining space - new in v2.8
      size: 300, //large column
    },
    { accessorKey: 'address.state', header: 'State' },
    { accessorKey: 'phone', header: 'Phone Number' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      enableSorting: false, //disable sorting for this column
      enableColumnFilter: false, //disable column filtering for this column
      enableColumnActions: false, //disable column actions for this column
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
          <IconButton
            color="error"
            onClick={() => {
              console.log('Delete row:', row.original);
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filters: FilterOption[] = [
    {
      label: 'Type',
      labelKey: 'type',
      type: 'radio', // Ensure this is explicitly one of the allowed values
      options: { full_time: 'Full Time', part_time: 'Part Time' },
    },
    {
      label: 'Department',
      labelKey: 'department',
      type: 'dropdown',
      options: { hr: 'HR', engineering: 'Engineering', sales: 'Sales' },
    },
    {
      label: 'Location',
      labelKey: 'location',
      type: 'checkbox',
      options: { remote: 'Remote', onsite: 'Onsite' },
    },
    // {
    //   label: 'Date',
    //   labelKey: 'date',
    //   type: 'date',
    // },
    // {
    //   label: 'Date Range',
    //   labelKey: 'date_range',
    //   type: 'date_range',
    // },
  ];

  return (
    <DataTable
      columns={columns}
      apiUrl="/users"
      // filters={filters} // Dynamic filters passed as props
      addButtonText="Add Application"
      addButtonOnClick={() => console.log('Add Application clicked')}
      // customButtonUi={
      //   <Button variant='contained' onClick={() => console.log('Custom Button clicked')}>
      //     {'addButtonText'}
      //   </Button>
      // }
      tableTitle="Title"
      // canExportExcel
    />
  );
}

export default Users;
