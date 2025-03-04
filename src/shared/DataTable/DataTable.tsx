import ServerSideDataTable from './ServerSideDataTable';
import ClientSideDataTable from './ClientSideDataTable';

const DataTable = ({ serverSideRender, ...props }: any) => {
  return serverSideRender ? <ServerSideDataTable {...props} /> : <ClientSideDataTable {...props} />;
};

export default DataTable;

DataTable.defaultProps = {
  serverSideRender: false,
  fetchSize: 20,
  filters: null,
  canExportExcel: false,
};
