"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};
const FileUpload = ({ onChange, endpoint }: Props) => {
  const t = useTranslations("createOrEditCourseForm");
  return (
    <UploadDropzone
      endpoint={endpoint}
      content={{
        label: t("chooseFilesOrDragAndDrop"),
      }}
      onClientUploadComplete={(res) => onChange(res?.[0]?.url)}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};

export default FileUpload;
