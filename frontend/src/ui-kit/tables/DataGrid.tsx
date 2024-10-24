/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from '@mui/material';
import { ArrowUp } from '@phosphor-icons/react';
import {
  TableOptions,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Header,
  getPaginationRowModel,
  Table,
  getFilteredRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { FormCheckbox } from '../inputs';
import {
  JSXElementConstructor,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cx } from 'cva';
import { DropdownPagination } from '../pagination';

// TODO: HANDLE DESCRIPTION IN META

export interface DataGridProps<T>
  extends Omit<TableOptions<T>, 'getCoreRowModel'> {
  checkboxSelection?: boolean;
  getRowHeight?: () => 'auto' | number;
  hideFooter?: boolean;
  hideToolbar?: boolean;
  loading?: boolean;
  slots?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toolbar?: JSXElementConstructor<any>;
  };
}

export type DataGridColDef<T> = ColumnDef<T>;

export interface DataGridToolbarProps<T> {
  table: Table<T>;
  setGlobalFilter: (value: string) => void;
}

const tBodyClasses = {
  tr: 'border-b border-solid border-[#EAECF4]',
  td: [
    'text-ellipsis px-[10px] py-4 first-of-type:pl-6',
    'focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary-main',
    'focus-within:outline focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-primary-main/50',
  ],
};

const DataGridHeader = <T,>({
  header,
  table,
}: {
  header: Header<T, unknown>;
  table: Table<T>;
}) => {
  const thRef = useRef<HTMLTableCellElement | null>(null);
  const size = header.getSize();
  const sorted = header.column.getIsSorted();
  const headerAlign = header.column.columnDef.meta?.headerAlign || 'left';
  const resizeHandler = header.getResizeHandler();

  // This fix an issue related to after trying to resize when width is auth
  useEffect(() => {
    const autoSize = thRef.current?.getBoundingClientRect().width;

    if (autoSize && size === 150) {
      table.setColumnSizing((prev) => {
        return {
          ...prev,
          [header.id]: autoSize,
        };
      });
    }
  }, [header.id, size, table]);

  return (
    <th
      className={cx([`relative p-0 [&:first-of-type>div:first-of-type]:pl-6`])}
      colSpan={header.colSpan}
      ref={thRef}
      style={{
        width: size === 150 ? 'auto' : size,
        // flex: header.column.columnDef.meta?.flex,
      }}
    >
      <div
        className={cx([
          'flex h-14 items-center px-[10px] [&_.Table-sortIconButton]:hover:!visible [&_.Table-sortIconButton]:hover:!w-auto',
          header.column.getCanSort() && 'cursor-pointer select-none',
        ])}
        onClick={header.column.getToggleSortingHandler()}
      >
        <div
          className={cx([
            `flex h-full flex-1 items-center overflow-hidden`,
            [
              headerAlign === 'left' && 'justify-start',
              headerAlign === 'center' && 'justify-center',
              headerAlign === 'right' && 'flex-row-reverse text-right',
            ],
          ])}
        >
          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-normal text-[#96A2C1]">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </div>
          {header.column.getCanSort() && (
            <div
              className={`Table-sortIconButton  ${
                sorted === false ? 'invisible' : ''
              }`}
              title="Sort"
            >
              <IconButton className={`select-none `} size="small">
                <ArrowUp
                  className={`${sorted === 'desc' ? 'rotate-180' : ''} ${
                    sorted === false ? 'opacity-50' : ''
                  }`}
                  size={18}
                />
              </IconButton>
            </div>
          )}
        </div>
      </div>
      {header.column.getCanResize() && (
        <div
          onMouseDown={resizeHandler}
          onTouchStart={resizeHandler}
          className={`absolute right-0 top-0 z-[1] flex h-full w-2.5 cursor-col-resize touch-none select-none items-center justify-center  hover:!opacity-80 group-hover:opacity-50 ${
            header.column.getIsResizing() ? 'opacity-80' : 'opacity-0'
          }`}
        >
          <div className="h-4 w-0.5 bg-[#96A2C1]"></div>
        </div>
      )}
    </th>
  );
};

const DataGridFooter = <T,>({ table }: { table: Table<T> }) => {
  const tableState = table.getState();

  return (
    <div className="px-6">
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
  );
};

const emptyArray: any[] = [];

export const DataGrid = <T,>(props: DataGridProps<T>) => {
  const [ready, setReady] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => {
    let copy = props.columns || [];

    if (props.checkboxSelection) {
      copy = [
        {
          id: 'select',
          header: ({ table }) => {
            const isAllSelected = table.getIsAllRowsSelected();
            return (
              <FormCheckbox
                checked={isAllSelected}
                indeterminate={!isAllSelected && table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            );
          },
          cell: ({ row }) => {
            const selected = row.getIsSelected();

            return (
              <FormCheckbox
                checked={selected}
                indeterminate={!selected && row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
                disabled={!row.getCanSelect()}
              />
            );
          },
          size: 60,
        },

        ...copy,
      ];
    }

    return copy;
  }, [props.columns, props.checkboxSelection]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: 'onChange',
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter: globalFilter,
      ...props.state,
    },
    ...props,
    data: props.data || emptyArray, // This fixes an issue when resizing, causing infinite loop - https://github.com/TanStack/table/issues/4240
    columns,
  });

  const rowModel = table.getRowModel();

  const isEmpty = !props.data?.length;

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="grid h-full grid-rows-[min-content_1fr_min-content]">
      {!props.hideToolbar && props.slots?.toolbar && (
        <props.slots.toolbar table={table} setGlobalFilter={setGlobalFilter} />
      )}

      <div className="relative flex-1 overflow-auto border-t border-solid border-[#EAECF4]">
        <table
          className="w-full border-collapse"
          ref={(node) => {
            if (!node?.classList.contains('table-fixed')) {
              setTimeout(() => {
                node?.classList.add('table-fixed');
              }, 0);
            }
          }}
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <thead className="sticky top-0 z-[1] bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DataGridHeader
                    header={header}
                    key={header.id}
                    table={table}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="relative">
            {Boolean(isEmpty || props?.loading) && (
              <tr
                className={cx(
                  'sticky left-1/2 top-0 inline-flex -translate-x-1/2 justify-center',
                )}
              >
                <td className="py-8">
                  {props?.loading ? 'Loading...' : 'No Rows'}
                </td>
              </tr>
            )}
            {rowModel.rows.map((row) => {
              let rowHeight = '88px';

              if (props.getRowHeight) {
                const newRowHeight = props.getRowHeight();
                if (newRowHeight === 'auto') rowHeight = newRowHeight;
                else rowHeight = `${newRowHeight}px`;
              }

              const isSelectable = row.getCanSelect();
              const isSelected = row.getIsSelected();
              const isDynamicHeight = rowHeight === 'auto';

              return (
                <tr
                  key={row.id}
                  onClick={() => isSelectable && row.toggleSelected()}
                  className={`${tBodyClasses.tr} ${
                    isSelected
                      ? 'bg-primary-main/10 hover:bg-primary-main/[.15]'
                      : 'hover:bg-[rgba(0,_0,_0,_0.04)]'
                  } `}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align || 'left';
                    const size = cell.column.getSize();
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: size === 150 ? 'auto' : size,
                        }}
                        className={cx([
                          tBodyClasses.td,
                          !isDynamicHeight &&
                            'overflow-hidden whitespace-nowrap ',
                        ])}
                        tabIndex={0}
                      >
                        <div
                          className={cx(
                            'flex items-center',

                            [
                              align === 'left' && 'justify-start',
                              align === 'center' && 'justify-center',
                              align === 'right' && 'justify-end',
                            ],
                          )}
                          style={{
                            minHeight: rowHeight,
                            maxHeight:
                              rowHeight === 'auto' ? 'none' : rowHeight,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!props?.hideFooter && <DataGridFooter table={table} />}
    </div>
  );
};
