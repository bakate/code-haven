import { TableHeader as NextUITableHeader, TableColumn } from "@nextui-org/react";
type Props = {
  headerColumns: {
    name: string;
    uid: string;
    sortable: boolean;
  }[]
}



export const TableHeader = ({ headerColumns }: Props) => (
  <NextUITableHeader columns={headerColumns}>
    {(column) => (
      <TableColumn
        className="capitalize"
        key={column.uid}
        hideHeader={column.uid === "actions"}
        allowsSorting={column.sortable}
      >
        {column.name}
      </TableColumn>
    )}
  </NextUITableHeader>
);
