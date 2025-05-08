import { DataGrid } from '@mui/x-data-grid';
import { Pagination} from '@mui/material';
const CmDataGrid =  ({rows, columns, loading, sortS, pageCount, page, onPageChange, children })  => {
  return (
    <>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter={true}
          disableColumnMenu={true}
          hideFooter={true}
          loading={loading}
          // Sort
          sortingMode='server'
          sortingOrder={['desc', 'asc']}
          onSortModelChange={sortS} />
      </div>
      <br/>
      <div style={{ width: '100%' , display: 'flex',justifyContent: 'center'}}>
        <Pagination variant="outlined" shape="rounded" count={pageCount} page={page} showFirstButton showLastButton onChange={(e,value) => onPageChange(value)} />
        {children}
      </div>
    </>
    );
  }
  
  export default CmDataGrid;