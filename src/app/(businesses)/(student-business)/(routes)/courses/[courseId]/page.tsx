type Props = {
  params: {
    courseId: string;
  };
};
const SingleCoursePage = ({ params: { courseId } }: Props) => {
  return (
    <div className="text-xl text-center">
      This screen is on progress. We&apos;ll handle the course with id:{" "}
      {courseId}. Please check back later.
    </div>
  );
};

export default SingleCoursePage;
