"use client";

import { useConfetti } from "@/hooks/use-confetti";
import MuxPlayer from "@mux/mux-player-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuLoader2, LuLock } from "react-icons/lu";
import { toast } from "sonner";
type Props = {
  playbackId: string;
  title: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  courseId: string;
  chapterId: string;
  nextChapterId: string | null;
};
export const VideoPlayer = ({
  playbackId,
  title,
  isLocked,
  completeOnEnd,
  courseId,
  chapterId,
  nextChapterId,
}: Props) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfetti();
  const t = useTranslations("studentCourseById");

  const onEnd = () => {
    if (completeOnEnd) {
      if (!nextChapterId) {
        confetti.onOpen();
      }
      toast.success(t("chapterCompleted"));

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    }
  };
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <LuLoader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked ? (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center flex-col gap-y-2 text-secondary">
          <LuLock className="size-8" />
          <p className="text-sm">{t("lockedChapterLabel")}</p>
        </div>
      ) : (
        <MuxPlayer
          playbackId={playbackId}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          title={title}
          className="aspect-video w-full"
          primaryColor="#006FEE"
        />
      )}
    </div>
  );
};
