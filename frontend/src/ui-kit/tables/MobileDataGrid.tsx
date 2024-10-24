import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DropdownPagination } from '../pagination';
import { DataGridProps } from './DataGrid';
import { cx } from 'cva';

export type MobileDataGridProps<T> = DataGridProps<T> & {
  columnNumber?: number;
  columnsSpaceBetween?: boolean;
};

const MobileDataGrid = <T,>(props: MobileDataGridProps<T>) => {
  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...props,
  });

  const headers = table.getLeafHeaders();
  const tableState = table.getState();
  const columnsSpaceBetween = props.columnsSpaceBetween ?? false;
  const isEmpty = !props.data.length;

  return (
    <div className="flex flex-col">
      {!props.hideToolbar && props.slots?.toolbar && (
        <props.slots.toolbar table={table} />
      )}
      <div className="flex w-full flex-col gap-1">
        {isEmpty && (
          <div className="flex w-full items-center justify-center">No Rows</div>
        )}
        {table.getRowModel().rows.map((row) => {
          return (
            <div
              key={row.id}
              className={cx(
                `grid gap-2 gap-y-4 border-b border-solid border-[#EAECF4] py-6 first:pt-0 last:border-b-0 last:pb-0`,
                columnsSpaceBetween && 'justify-between',
              )}
              style={{
                ...(props.columnNumber && {
                  gridTemplateColumns: `repeat(${props.columnNumber}, ${
                    columnsSpaceBetween ? 'auto' : '1fr'
                  })`,
                }),
              }}
            >
              {row.getVisibleCells().map((cell, index) => {
                const header = headers[index % headers.length];
                return (
                  <div
                    key={cell.id}
                    className={cx('flex flex-col gap-1.5')}
                    style={{
                      gridColumnStart: `span ${
                        cell.column.columnDef.meta?.mobileColSpan || 1
                      }`,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cx(
                          `text-xs/[18px] font-medium text-text-secondary`,
                          header.column.columnDef.meta?.mobileHideLabel &&
                            'sr-only',
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 items-center break-all text-sm/none font-normal text-text-primary">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {!props.hideFooter && (
        <div>
          <DropdownPagination
            total={table.getFilteredRowModel().rows.length}
            page={tableState.pagination.pageIndex + 1}
            perPage={tableState.pagination.pageSize}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPerPageChange={(perPage) => {
              table.setPageSize(perPage);
            }}
            perPageOptions={[10, 25, 50]}
          />
        </div>
      )}
    </div>
  );
};

export default MobileDataGrid;
