"use client";

import { useConfirm } from "@/hooks/use-confirm";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Key } from "react";
import { LuEye, LuPencil, LuTrash, LuTrash2 } from "react-icons/lu";
import { useMedia } from "react-use";
import { useDeleteCourseByTeacher } from "../../data/use-delete-course-by-teacher";
import { CategoriesType } from "../../data/use-get-categories";
import { CoursesType } from "../../data/use-get-courses-by-teacher";
import { FiMoreVertical } from "react-icons/fi";

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
  const isTablet = useMedia("(min-width: 640px)", false);
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
      const category =
        (allCategories ?? [])?.find((c) => c.id === course.categoryId)?.name ??
        "";

      return category ? (
        <Chip variant="flat" size="sm">
          {category}
        </Chip>
      ) : (
        ""
      );

    case "actions":
      if (!isTablet) {
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <LuEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Link href={`/teacher/courses/${course.id}`}>
                  <LuPencil />
                </Link>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={async () => {
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
                <LuTrash2 />
              </span>
            </Tooltip>
            <ConfirmationDialog />
          </div>
        );
      }
      return (
        <div className="relative flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <FiMoreVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="courses table Actions" variant="flat">
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
