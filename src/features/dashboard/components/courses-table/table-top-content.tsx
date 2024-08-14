import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { Dispatch } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";
import { CourseTableAction } from "./reducer";

import { useTranslations } from "next-intl";
import { StateType } from "../../types";

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
        <DropdownTrigger className="hidden sm:flex">
          <Button endContent={<LuChevronDown className="text-small" />} variant="flat">
            {t("hideSomeColumns")}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
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

      <label className="sm:flex items-center text-default-400 text-small hidden">
        {t('rowsPerPage')}
        <select
          className="bg-transparent outline-none text-default-400 text-small"
          onChange={(e) => {
            dispatch({ type: 'SET_ROWS_PER_PAGE', payload: parseInt(e.target.value) });
            dispatch({ type: 'SET_PAGE', payload: 1 });
          }}
        >
          <option value="5" key="5">5</option>
          <option value="10" key="10">10</option>
          <option value="15" key="15">15</option>
        </select>
      </label>
    </div>

  );
}
