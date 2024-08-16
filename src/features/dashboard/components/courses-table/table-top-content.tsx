import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Link } from "@nextui-org/react";
import { Dispatch } from "react";
import { LuChevronDown, LuPlus, LuSearch } from "react-icons/lu";
import { CourseTableAction } from "./reducer";

import { useTranslations } from "next-intl";
import { StateType } from "../../types";
import { useMedia } from "react-use";

type Props = {
  statusOptions: {
    name: string;
    uid: string;
  }[]
  headerColumns: {
    name: string;
    uid: string;
    sortable: boolean;
  }[]
  dispatch: Dispatch<CourseTableAction>
  state: StateType

}
export const TableTopContent = ({ dispatch, headerColumns, state, statusOptions }: Props) => {
  const t = useTranslations("createOrEditCourseForm");
  const isTablet = useMedia("(min-width: 640px)", false);
  return (
    <div className="flex justify-between gap-3 items-center">
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder={t('searchByCourseName')}
        startContent={<LuSearch className="text-default-300" />}
        value={state.filterValue}
        onClear={() => {
          dispatch({ type: 'SET_FILTER_VALUE', payload: '' });
          dispatch({ type: 'SET_PAGE', payload: 1 });
        }}
        onValueChange={(value) => {
          if (value) {
            dispatch({ type: 'SET_FILTER_VALUE', payload: value });
            dispatch({ type: 'SET_PAGE', payload: 1 });
          } else {
            dispatch({ type: 'SET_FILTER_VALUE', payload: '' });
          }
        }}
      />
      <div className="flex gap-3">
        <Dropdown>
          <DropdownTrigger className="hidden md:flex">
            <Button endContent={<LuChevronDown className="text-small" />} variant="flat">
              {t('filterByStatus')}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            color="primary"
            disallowEmptySelection
            aria-label="Table Status Filter"
            closeOnSelect={false}
            selectedKeys={state.statusFilter}
            selectionMode="multiple"
            onSelectionChange={(keys) => dispatch({ type: 'SET_STATUS_FILTER', payload: keys as string })}
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
          <DropdownTrigger className="hidden md:flex">
            <Button endContent={<LuChevronDown className="text-small" />} variant="flat">
              {t("hideSomeColumns")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="flat"
            color="primary"
            disallowEmptySelection
            aria-label="Hide some columns"
            closeOnSelect={false}
            selectedKeys={state.visibleColumns}
            selectionMode="multiple"
            onSelectionChange={(keys) => dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: keys as Set<string> })}

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
        <Button color="primary" href="/teacher/create" as={Link} startContent={<LuPlus />} isIconOnly={!isTablet}>
          {isTablet ? t("newCourse"):""}
        </Button>
      </div>
    </div>

  );
}
