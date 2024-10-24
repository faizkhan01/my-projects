import '@tanstack/react-table';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerAlign?: 'left' | 'center' | 'right';
    description?: string;
    align?: 'left' | 'center' | 'right';
    mobileColSpan?: number;
    mobileHideLabel?: boolean;
    flex?: number;
  }
}
