import { LoginForm } from "@/features/auth/components/login-form";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useToggle } from "@/hooks/use-toggle";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LuPlay } from "react-icons/lu";

type Props = {
  courseId: string;
  chapterId: string;
};

export const CallToAction = ({ courseId, chapterId }: Props) => {
  const { isOpen, onClose, onOpen } = useToggle();
  const session = useSession();
  const isAuthenticatedStudent = session?.status === "authenticated";
  const t = useTranslations("coursesList");
  const router = useRouter();
  const setCallbackUrl = useAuthStore((state) => state.setCallbackUrl);

  const handlePress = () => {
    if (isAuthenticatedStudent) {
      router.push(`/courses/${courseId}/chapters/${chapterId}`);
    } else {
      setCallbackUrl(`/courses/${courseId}/chapters/${chapterId}`);
      onOpen();
    }
  };

  return (
    <div
      className="bg-gradient-to-r
    rounded-md border  p-6 from-sky-900 via-sky-950 to-slate-900 grid gap-3"
    >
      <h2 className="text-2xl font-bold text-white first-letter:capitalize">
        {t("readyToStart")}
      </h2>
      <p className="text-gray-300 text-small first-letter:capitalize">
        {t("trackYourProgress")}
      </p>
      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
            setCallbackUrl(null);
          }
        }}
        showArrow
        offset={10}
        placement="bottom"
        backdrop="blur"
      >
        <PopoverTrigger>
          <Button
            startContent={<LuPlay />}
            onClick={handlePress}
            color="primary"
          >
            {t("startWatching")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {(titleProps) => (
            <div {...titleProps}>
              <LoginForm />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
