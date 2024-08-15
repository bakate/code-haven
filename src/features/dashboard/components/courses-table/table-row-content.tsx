"use client";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { Key } from "react";
import { LuEye, LuMoreVertical, LuPencil, LuTrash } from "react-icons/lu";
import { useDeleteCourseByTeacher } from "../../data/use-delete-course-by-teacher";
import { CategoriesType } from "../../data/use-get-categories";
import { CoursesType } from "../../data/use-get-courses-by-teacher";

type Props = {
  course: CoursesType[number];
  columnKey: Key;
  allCategories: CategoriesType | undefined;
};
export const TableRowContent = ({
  columnKey,
  course,
  allCategories,
}: Props) => {
  const locale = useLocale();
  const t = useTranslations("createOrEditCourseForm");
  const { mutate: onDeleteCourseMutation } = useDeleteCourseByTeacher();
  const { ConfirmationDialog, dialogResponse } = useConfirm({
    title: t("deleteCourse"),
    message: t("deleteCourseConfirmation"),
  });

  switch (columnKey) {
    case "id":
      return course.id;
    case "titles":
      return course.titles.find((t) => t.lang === locale)?.title;
    case "price":
      return course.price;
    case "isPublished":
      return (
        <Chip
          variant="flat"
          size="sm"
          color={course.isPublished ? "success" : "warning"}
        >
          {course.isPublished ? t("published") : t("draft")}
        </Chip>
      );
    case "categoryId":
      const category = (allCategories ?? [])
        ?.find((c) => c.id === course.categoryId)
        ?.names.find((n) => n.lang === locale)?.name;

      return category ? (
        <Chip variant="flat" size="sm">
          {category}
        </Chip>
      ) : (
        ""
      );

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
              <DropdownItem key="view" startContent={<LuEye />}>
                {t("view")}
              </DropdownItem>
              <DropdownItem
                key="edit"
                startContent={<LuPencil />}
                href={`/teacher/courses/${course.id}`}
              >
                {t("edit")}
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<LuTrash />}
                onPress={async () => {
                  const confirmed = await dialogResponse();
                  if (confirmed) {
                    onDeleteCourseMutation({
                      param: {
                        courseId: course.id,
                      },
                    });
                  }
                }}
              >
                {t("delete")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <ConfirmationDialog />
        </div>
      );
  }
};
