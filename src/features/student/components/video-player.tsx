"use client";

import { useConfetti } from "@/hooks/use-confetti";
import type MuxPlayerElement from "@mux/mux-player";
import MuxPlayer from "@mux/mux-player-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { forwardRef, useImperativeHandle, useState } from "react";
import { LuLoader, LuLock } from "react-icons/lu";
import { useDebounce } from "react-use";
import { toast } from "sonner";

type Props = {
  playbackId: string;
  title: string;
  isLocked: boolean;
  courseId: string;
  chapterId: string;
  lastVideoPosition: number | null;
  onEnd?: (currentTime: number, isCompleted: boolean) => void;
  onStart?: () => void;
  onPause?: (currentTime: number, isCompleted: boolean) => void;
  areOtherChaptersCompleted: boolean;
};
export const VideoPlayer = forwardRef<{ seekToEnd: () => void }, Props>(
  (
    {
      playbackId,
      title,
      isLocked,
      courseId,
      chapterId,
      lastVideoPosition,
      onEnd,
      onStart,
      onPause,
      areOtherChaptersCompleted,
    },
    ref
  ) => {
    const [isReady, setIsReady] = useState(false);
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
      null
    );
    const [currentTime, setCurrentTime] = useState<number>(0);

    const pathname = usePathname();
    const confetti = useConfetti();
    const t = useTranslations("studentCourseById");

    const session = useSession();
    const isAuthenticated = session?.status === "authenticated";
    const coursesPage = pathname?.startsWith("/courses");

    useDebounce(
      () => {
        if (videoElement) {
          setCurrentTime(videoElement.currentTime);
        }
      },
      7000,
      [videoElement]
    );

    const handleOnStart = () => {
      if (currentTime === 0) {
        onStart?.();
      }
    };

    const handleOnPause = () => {
      if (onPause) {
        onPause(currentTime, false);
      }
    };

    const handleTimeUpdate = (event: Event) => {
      const video = event.target as MuxPlayerElement;
      setCurrentTime(video?.currentTime);
    };

    const handleOnEnd = () => {
      if (!coursesPage || !isAuthenticated) return;
      const duration = videoElement?.duration || 0;
      onEnd?.(duration, true);

      if (areOtherChaptersCompleted) {
        confetti.onOpen();
        toast.success(t("courseCompleted"));
      } else {
        toast.success(t("chapterCompleted"));
      }
    };

    useImperativeHandle(ref, () => ({
      seekToEnd: () => {
        if (videoElement) {
          videoElement.currentTime = videoElement.duration;
        }
      },
    }));

    return (
      <div className="relative aspect-video">
        {!isReady && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <LuLoader className="h-8 w-8 animate-spin text-secondary" />
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
            onEnded={handleOnEnd}
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
            {...(coursesPage && isAuthenticated
              ? {
                  onPlay: handleOnStart,
                  onPause: handleOnPause,
                  onTimeUpdate: handleTimeUpdate,
                }
              : {})}
          />
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
