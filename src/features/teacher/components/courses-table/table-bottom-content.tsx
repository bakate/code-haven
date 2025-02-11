
import { Button, divider, Pagination } from "@heroui/react";
import { Dispatch } from "react";
import { CourseTableAction } from "./reducer";

import { useTranslations } from "next-intl";
import { StateType } from "../../types";


type Props = {
  dispatch: Dispatch<CourseTableAction>;
  totalItems: number;
  state: StateType;
  pages: number;
}
export const TableBottomContent = ({ dispatch, pages, state, totalItems }: Props) => {

  const t = useTranslations("createOrEditCourseForm");
  return (
    <div className="p-2 flex justify-between items-center">
      {state.selectedKeys.size ? <span className="text-small text-default-400">
        {state.selectedKeys.has("all")
          ? t('allCoursesSelected')
          : t('selectedCourses', { count: state.selectedKeys.size, total: totalItems })}


      </span> : <span></span>}
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={state.page}
        total={pages}
        onChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
      />
      <div className="hidden md:flex justify-end gap-2">
        <label className="flex items-center text-default-400 text-small">
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
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={() => {
            if (state.page > 1) {
              dispatch({ type: 'SET_PAGE', payload: state.page - 1 })
            }
          }}
        >
          {t('previous')}
        </Button>
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={() => {
            if (state.page < pages) {
              dispatch({ type: 'SET_PAGE', payload: state.page + 1 })
            }
          }}
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
