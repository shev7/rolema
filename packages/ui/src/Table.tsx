import { Table as RadixTable } from "@radix-ui/themes";

export const Table = (props: RadixTable.RootProps) => (
  <RadixTable.Root size="2" {...props} />
);

Table.Header = RadixTable.Header;
Table.Row = RadixTable.Row;
Table.ColumnHeaderCell = RadixTable.ColumnHeaderCell;
Table.Body = RadixTable.Body;
Table.RowHeaderCell = RadixTable.RowHeaderCell;
Table.Cell = RadixTable.Cell;
