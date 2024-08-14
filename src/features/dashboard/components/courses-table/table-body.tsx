import { TableBody as NextUITableBody, TableRow, TableCell } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";


type Props = {
  items: any[];
  renderCell: (item: any, columnKey: string, locale: string, allCategories: any, t: any) => JSX.Element;
  allCategories: any;
}
export const TableBody = ({ items, renderCell, allCategories }: Props) => {
  const locale = useLocale();
  const t = useTranslations("createOrEditCourseForm");

  return (
    <NextUITableBody emptyContent={t('noCoursesFound')} items={items}>
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => (
            <TableCell>{renderCell(item, columnKey, locale, allCategories, t)}</TableCell>
          )}
        </TableRow>
      )}
    </NextUITableBody>
  )
}
