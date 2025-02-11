import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

type SkeletonProps = {
  headerColumns: {
    name: string;
    uid: string;
    sortable: boolean;
  }[];
};
export const CourseTableSkeleton = ({ headerColumns }: SkeletonProps) => {
  const RowSkeleton = () => <Skeleton className="h-10 w-full" />;
  return (
    <Table aria-label="Courses list for a specific teacher" isHeaderSticky>
      <TableHeader columns={headerColumns}>
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
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <RowSkeleton />
            </TableCell>
            <TableCell>
              <RowSkeleton />
            </TableCell>
            <TableCell>
              <RowSkeleton />
            </TableCell>
            <TableCell>
              <RowSkeleton />
            </TableCell>
            <TableCell>
              <div className="flex justify-center items-center flex-col gap-1">
                <Skeleton className="size-1 rounded-full animate-pulse" />
                <Skeleton className="size-1 rounded-full animate-pulse" />
                <Skeleton className="size-1 rounded-full animate-pulse" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
