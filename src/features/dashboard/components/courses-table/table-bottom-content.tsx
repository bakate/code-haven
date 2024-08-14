
import { Button, Pagination } from "@nextui-org/react";
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
      {state.selectedKeys.size ? <span className="w-[30%] text-small text-default-400">
        {state.selectedKeys.has("all")
          ? t('allCoursesSelected')
          : t('selectedCourses', { count: state.selectedKeys.size, total: totalItems })}

      </span> : <span className="w-[30%]"></span>}
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={state.page}
        total={pages}
        onChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
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
