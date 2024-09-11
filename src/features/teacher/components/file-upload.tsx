"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@/lib/uploadthing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  onChange: (url?: string, name?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};
const FileUpload = ({ onChange, endpoint }: Props) => {
  const t = useTranslations("createOrEditCourseForm");

  return (
    <div className="p-10 lg:p-[7.3rem]">
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0]?.url, res?.[0]?.name);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
    </div>
  );
};

export default FileUpload;
