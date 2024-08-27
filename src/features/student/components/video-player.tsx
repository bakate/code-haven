"use client";

import { useConfetti } from "@/hooks/use-confetti";
import type MuxPlayerElement from "@mux/mux-player";
import MuxPlayer from "@mux/mux-player-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuLoader2, LuLock } from "react-icons/lu";
import { useDebounce } from "react-use";
import { useCreateUserProgression } from "../data/use-create-user-progression";
import { useEditUserProgression } from "../data/use-edit-user-progression";

type Props = {
  playbackId: string;
  title: string;
  isLocked: boolean;
  courseId: string;
  chapterId: string;
  nextChapterId: string | null;
  lastVideoPosition: number | null;
  isCompleted: boolean | null;
};
export const VideoPlayer = ({
  playbackId,
  title,
  isLocked,
  courseId,
  chapterId,
  nextChapterId,
  lastVideoPosition,
  isCompleted,
}: Props) => {
  const [isReady, setIsReady] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const confetti = useConfetti();
  const t = useTranslations("studentCourseById");

  const session = useSession();
  const isAuthenticated = session?.status === "authenticated";
  const coursesPage = pathname?.startsWith("/courses");

  useEffect(() => {
    if (!lastVideoPosition || !videoElement) return;

    videoElement.currentTime = lastVideoPosition;
  }, [videoElement, lastVideoPosition]);

  useDebounce(
    () => {
      if (videoElement) {
        setCurrentTime(videoElement.currentTime);
      }
    },
    7000,
    [videoElement]
  );

  const { mutate: createUserProgression } = useCreateUserProgression(chapterId);
  const { mutate: editUserProgression } = useEditUserProgression(courseId);

  const createOrUpdateUserProgression = () => {
    if (!isAuthenticated && !coursesPage) {
      return;
    }

    if (currentTime === 0) {
      createUserProgression({
        id: courseId,
      });
    } else {
      editUserProgression({
        videoPlaybackPosition: currentTime,
        isCompleted: Boolean(isCompleted),
        chapterId: chapterId,
      });
    }
  };

  const handleTimeUpdate = (event: Event) => {
    const video = event.target as MuxPlayerElement;
    setCurrentTime(video?.currentTime);
  };

  const onEnd = () => {
    editUserProgression({
      videoPlaybackPosition: currentTime,
      isCompleted: true,
      chapterId: chapterId,
    });

    if (!nextChapterId) {
      confetti.onOpen();
      //   toast.success(t("chapterCompleted"));
    } else {
      router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
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
          ref={(muxPlayerElement) => {
            setVideoElement(muxPlayerElement?.media?.nativeEl ?? null);
          }}
          startTime={lastVideoPosition ?? 0}
          {...(isAuthenticated && {
            metadata: {
              video_id: chapterId,
              video_title: title,
              video_series: courseId,
              viewer_user_id: session?.data?.user?.id,
            },
          })}
          className="aspect-video w-full"
          primaryColor="#006FEE"
          onPlay={() => {
            createOrUpdateUserProgression();
          }}
          onPause={() => {
            createOrUpdateUserProgression();
          }}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
};
