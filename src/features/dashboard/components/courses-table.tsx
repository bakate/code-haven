"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { CoursesType, useGetCoursesByTeacher } from "../data/use-get-courses-by-teacher";

import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { LuChevronDown, LuEye, LuMoreVertical, LuPencil, LuSearch, LuTrash } from "react-icons/lu";
import { useGetCategories } from "../data/use-get-categories";
import { SingleCourseType } from "../data/use-get-single-course-by-teacher";



type Selection = 'all' | Set<Key>;

type SortDescriptorType = {
  column?: keyof CoursesType[number]
  direction: "ascending" | "descending";
};


export const CoursesTable = () => {
  const t = useTranslations("createOrEditCourseForm");

  const statusOptions = useMemo(() => [
    { name: t('published'), uid: "published" },
    { name: t('unpublished'), uid: "unpublished" },
  ], [t])


  const INITIAL_VISIBLE_COLUMNS = ["titles", "categoryId", "price", "isPublished", "actions"];

  const locale = useLocale();
  const { data: allCategories, isLoading: areCategoriesLoading } = useGetCategories();
  const { data: allCourses, isError, isLoading, isFetched } = useGetCoursesByTeacher();


  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptorType>({
    column: "titles",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    const columns = [
      { name: "ID", uid: "id", sortable: true },
      { name: t('titleLabel'), uid: "titles", sortable: true },
      { name: t('priceLabel'), uid: "price", sortable: true },
      { name: t('published'), uid: "isPublished", sortable: true },
      { name: t("category"), uid: "categoryId", sortable: true },
      { name: t("actions"), uid: "actions" },
    ];
    if (visibleColumns.has('all')) return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, t]);

  const filteredItems = useMemo(() => {
    let filteredCourses = allCourses ? [...allCourses] : [];

    if (hasSearchFilter) {
      filteredCourses = filteredCourses.filter((course) =>
        course.titles.find(t => t.lang === locale)?.title?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }


    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredCourses = filteredCourses.filter((course) =>
        Array.from(statusFilter).includes(course.isPublished ? "published" : "unpublished")
      );
    }

    return filteredCourses;
  }, [allCourses, filterValue, locale, hasSearchFilter, statusFilter, statusOptions.length]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage)
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a] as number;
      const second = b[sortDescriptor.column as keyof typeof b] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);


  const handleSelectionChange = (keys: Selection) => {
    if (keys === 'all') {
      // Select all keys
      setSelectedKeys(new Set<string>(
        items.map(item => item.id.toString())
      ));
    } else {
      // Convert Set<Key> to Set<string>
      const newSelectedKeys = new Set<string>(Array.from(keys).map(key => key.toString()));
      setSelectedKeys(newSelectedKeys);
    }

  };


  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement> | undefined) => {
    if (e) {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    }
  }, []);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const topContent = useMemo(() => {
    return (

      <div className="flex justify-between gap-3 items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder={t('searchByCourseName')}
          startContent={<LuSearch className="text-default-300" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<LuChevronDown className="text-small" />} variant="flat">
              {t('filterByStatus')}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Status Filter"
            closeOnSelect={false}
            selectedKeys={statusFilter}
            selectionMode="multiple"
            onSelectionChange={(keys) => setStatusFilter(keys as string)}
            classNames={{
              list: "capitalize"
            }}
          >
            {statusOptions.map((status) => (
              <DropdownItem key={status.uid} className="capitalize">
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<LuChevronDown className="text-small" />} variant="flat">
              {t("hideSomeColumns")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Hide some columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={(keys) => setVisibleColumns(keys as Set<string>)}
            classNames={{
              list: "capitalize"
            }}
          >
            {headerColumns.map((column) => (
              <DropdownItem key={column.uid} className="capitalize" textValue={column.name}>
                {column.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <label className="sm:flex items-center text-default-400 text-small hidden">
          {t('rowsPerPage')}
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5" key="5">5</option>
            <option value="10" key="10">10</option>
            <option value="15" key="15">15</option>
          </select>
        </label>
      </div>


    );
  }, [
    filterValue,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    statusFilter,
    statusOptions,
    headerColumns,
    visibleColumns,
    t
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="p-2 flex justify-between items-center">
        {selectedKeys.size ? <span className="w-[30%] text-small text-default-400">
          {selectedKeys.has("all")
            ? t('allCoursesSelected')
            : t('selectedCourses', { count: selectedKeys.size, total: filteredItems.length })
          }
        </span> : <span className="w-[30%]"></span>}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            {t('previous')}
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    page,
    pages,
    filteredItems.length,
    onNextPage,
    onPreviousPage,
    t
  ]);

  const renderCell = useCallback((course: CoursesType[number], columnKey: keyof CoursesType[number] | 'actions') => {

    switch (columnKey) {
      case "id":
        return course.id;
      case "titles":
        return course.titles.find(t => t.lang === locale)?.title;
      case "price":
        return course.price;
      case "isPublished":
        return (
          <Chip variant="flat" size="sm"
            color={course.isPublished ? "success" : 'warning'}
          >
            {course.isPublished ? t('published') : t('unpublish')}
          </Chip>
        )
      case "categoryId":
        const category = (allCategories ?? [])?.find(c => c.id === course.categoryId)?.names.find(n => n.lang === locale)?.name;

        return <Chip variant="flat" size="sm">{category}</Chip>

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <LuMoreVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="courses table Actions" variant="flat">
                <DropdownItem key="view" startContent={<LuEye />}>{t("view")}</DropdownItem>
                <DropdownItem key="edit" startContent={<LuPencil />} href={`/teacher/courses/${course.id}`}>{t('edit')}</DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger" startContent={<LuTrash />}>{t('delete')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      default:
        return null;

    }
  }, [locale, t, allCategories])



  if (isLoading || !isFetched || areCategoriesLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }
  if (!allCourses) {
    return <div>No data</div>;
  }


  return (
    <Table
      aria-label="Courses list for a specific teacher"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      topContent={topContent}
      topContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      onSortChange={(sortDescriptor) => setSortDescriptor(sortDescriptor as SortDescriptorType)}
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
      <TableBody emptyContent={t('noCoursesFound')} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as keyof SingleCourseType)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
