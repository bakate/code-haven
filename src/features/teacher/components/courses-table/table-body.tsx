import {
  TableBody as NextUITableBody,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { Key } from "react";

type Props = {
  items: any[];
  renderCell: (
    item: any,
    columnKey: string | Key,
    locale: string,
    allCategories: { id: string; name: string }[],
    t: any
  ) => JSX.Element;
  allCategories: { id: string; name: string }[];
};
export const TableBody = ({ items, renderCell, allCategories }: Props) => {
  const locale = useLocale();
  const t = useTranslations("createOrEditCourseForm");

  return (
    <NextUITableBody emptyContent={t("noCoursesFound")} items={items}>
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => (
            <TableCell>
              {renderCell(item, columnKey, locale, allCategories, t)}
            </TableCell>
          )}
        </TableRow>
      )}
    </NextUITableBody>
  );
};
