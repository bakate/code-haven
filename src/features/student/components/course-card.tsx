import { Currency } from "@/components/currency";
import { IconBadge } from "@/components/icon-badge";
import { CategoriesType } from "@/features/teacher/data/use-get-categories";
import { Card, CardBody, CardFooter, Chip, Image } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuBookOpen } from "react-icons/lu";
import { PublishedCourseType } from "../data/use-get-published-courses";

type Props = {
  course: PublishedCourseType[0];
  categories: CategoriesType;
};
export const CourseCard = ({ course, categories }: Props) => {
  const locale = useLocale();
  const categoryLabel = categories.find(
    (category) => category.id === course.categoryId
  )?.name;
  const translatedTitle = course.titles.find(
    (title) => title.lang === locale
  )?.title;
  const router = useRouter();

  const t = useTranslations("coursesList");
  return (
    <Card
      shadow="md"
      className="group"
      isPressable
      onPress={() => router.push(`/courses/${course.id}`)}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="none"
          width="100%"
          isZoomed
          alt={translatedTitle}
          className="w-full object-cover h-[150px]"
          src={course.imageUrl ?? ""}
        />
      </CardBody>
      <CardFooter className="text-small flex flex-col gap-2 items-start">
        <div
          title={translatedTitle}
          className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-1"
        >
          {translatedTitle}
        </div>
        <Chip variant="flat">{categoryLabel}</Chip>
        {course.price ? (
          <Currency value={course.price ?? 0} />
        ) : (
          <Chip variant="flat" color="success">
            {t("free")}
          </Chip>
        )}

        <div className="flex items-center gap-x-1 text-slate-500 dark:text-slate-300">
          <IconBadge size="sm" icon={LuBookOpen} />
          <span>{t("totalChapters", { count: course.totalChapters })}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
