"use client";

import { useLocale, useTranslations } from "next-intl";
import { Key, useCallback, useMemo, useReducer } from "react";
import { useGetCoursesByTeacher } from "../data/use-get-courses-by-teacher";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useGetCategories } from "../data/use-get-categories";
import { StateType } from "../types";
import { CourseTableSkeleton } from "./courses-table/course-table-skeleton";
import {
  coursesTableReducer,
  initialCourseTableState,
} from "./courses-table/reducer";
import { TableBottomContent } from "./courses-table/table-bottom-content";
import { TableRowContent } from "./courses-table/table-row-content";
import { TableTopContent } from "./courses-table/table-top-content";

export const CoursesTable = () => {
  const t = useTranslations("createOrEditCourseForm");
  const locale = useLocale();
  const { data: allCategories, isLoading: areCategoriesLoading } =
    useGetCategories();
  const {
    data: allCourses,
    isError,
    isLoading,
    isFetched,
  } = useGetCoursesByTeacher();

  const [state, dispatch] = useReducer(
    coursesTableReducer,
    initialCourseTableState
  );

  const statusOptions = useMemo(
    () => [
      { name: t("published"), uid: "published" },
      { name: t("draft"), uid: "draft" },
    ],
    [t]
  );

  const hasSearchFilter = Boolean(state.filterValue);

  const headerColumns = useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      { name: t("titleLabel"), uid: "titles", sortable: true },
      { name: t("priceLabel"), uid: "price", sortable: true },
      { name: t("status"), uid: "isPublished", sortable: true },
      { name: t("category"), uid: "categoryId", sortable: true },
      { name: t("actions"), uid: "actions", sortable: false },
    ];
    if (state.visibleColumns.has("all")) return columns;
    return columns.filter((column) =>
      Array.from(state.visibleColumns).includes(column.uid)
    );
  }, [state.visibleColumns, t]);

  const filteredItems = useMemo(() => {
    let filteredCourses = allCourses ? [...allCourses] : [];
    if (hasSearchFilter) {
      filteredCourses = filteredCourses.filter((course) =>
        course.titles
          .find((t) => t.lang === locale)
          ?.title?.toLowerCase()
          .includes(state.filterValue.toLowerCase())
      );
    }
    if (
      state.statusFilter !== "all" &&
      Array.from(state.statusFilter).length !== statusOptions.length
    ) {
      filteredCourses = filteredCourses.filter((course) =>
        Array.from(state.statusFilter).includes(
          course.isPublished ? "published" : "draft"
        )
      );
    }

    return filteredCourses;
  }, [
    allCourses,
    locale,
    hasSearchFilter,
    state.statusFilter,
    state.filterValue,
    statusOptions.length,
  ]);

  const pages = Math.ceil(filteredItems.length / state.rowsPerPage);

  const items = useMemo(() => {
    const start = (state.page - 1) * state.rowsPerPage;
    const end = start + state.rowsPerPage;
    return filteredItems.slice(start, end);
  }, [state.page, filteredItems, state.rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[state.sortDescriptor.column as keyof typeof a] as number;
      const second = b[state.sortDescriptor.column as keyof typeof b] as number;
      if (state.sortDescriptor.column === "titles") {
        const first = a.titles
          .find((t) => t.lang === locale)
          ?.title?.toLowerCase() as string;
        const second = b.titles
          .find((t) => t.lang === locale)
          ?.title?.toLowerCase() as string;
        return state.sortDescriptor.direction === "descending"
          ? second.localeCompare(first)
          : first.localeCompare(second);
      }
      if (state.sortDescriptor.column === "categoryId") {
        const first = (allCategories?.find((c) => c.id === a.categoryId)
          ?.name ?? "") as string;
        const second = (allCategories?.find((c) => c.id === b.categoryId)
          ?.name ?? "") as string;
        console.log(first, second);

        return state.sortDescriptor.direction === "descending"
          ? second?.localeCompare(first)
          : first?.localeCompare(second);
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return state.sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, state.sortDescriptor, locale, allCategories]);

  const handleSelectionChange = useCallback(
    (keys: "all" | Set<Key>) => {
      if (keys === "all") {
        dispatch({
          type: "SET_SELECTED_KEYS",
          payload: new Set<string>(items.map((item) => item.id.toString())),
        });
      } else {
        dispatch({
          type: "SET_SELECTED_KEYS",
          payload: new Set<string>(
            Array.from(keys).map((key) => key.toString())
          ),
        });
      }
    },
    [items]
  );

  if (isLoading || !isFetched || areCategoriesLoading) {
    return <CourseTableSkeleton headerColumns={headerColumns} />;
  }
  if (isError) {
    // TODO handle error gracefully
    return <div>Error</div>;
  }
  if (!allCourses) {
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
        <TableBody emptyContent={t("youHaveNotCreatedAnyCourse")}>
          {[]}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table
      aria-label="Courses list for a specific teacher"
      isHeaderSticky
      bottomContent={
        <TableBottomContent
          dispatch={dispatch}
          pages={pages}
          state={state}
          totalItems={filteredItems.length}
        />
      }
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={state.selectedKeys}
      selectionMode="multiple"
      topContent={
        <TableTopContent
          state={state}
          dispatch={dispatch}
          statusOptions={statusOptions}
          headerColumns={headerColumns}
        />
      }
      topContentPlacement="outside"
      sortDescriptor={state.sortDescriptor}
      onSortChange={(sortDescriptor) => {
        dispatch({
          type: "SET_SORT_DESCRIPTOR",
          payload: sortDescriptor as StateType["sortDescriptor"],
        });
      }}
      onSelectionChange={handleSelectionChange}
    >
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
      <TableBody emptyContent={t("noCoursesFound")} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {
                  <TableRowContent
                    course={item}
                    allCategories={allCategories}
                    columnKey={columnKey}
                  />
                }
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
