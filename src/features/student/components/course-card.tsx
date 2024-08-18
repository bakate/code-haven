import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useLocale } from "next-intl";
import { PublishedCourseType } from "../data/use-get-published-courses";

type Props = {
  course: PublishedCourseType[0];
};
export const CourseCard = ({ course }: Props) => {
  const locale = useLocale();
  const translatedTitle = course.titles.find(
    (title) => title.lang === locale
  )?.title;
  return (
    <Card shadow="md" isPressable onPress={() => console.log("item pressed")}>
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          isZoomed
          alt={translatedTitle}
          className="w-full object-cover h-[140px]"
          src={course.imageUrl ?? ""}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{translatedTitle}</b>
        <p className="text-default-500">{course.price}</p>
      </CardFooter>
    </Card>
  );
};
