"use client";

import useClientCheck from "@/features/auth/hooks/use-client-check";
import MuxPlayer from "@mux/mux-player-react";
import { Button, CircularProgress } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { memo, useEffect, useReducer } from "react";
import { FaPencil, FaPlus, FaVideo } from "react-icons/fa6";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";
import { useVideoStatus } from "../../data/use-get-chapter-by-id";
import { SelectMuxDataType } from "../../types/mux.type";
import FileUpload from "../file-upload";

type Props = {
  initialData: {
    courseId: string;
    playbackId?: string;
    title: string;
    chapterId: SelectMuxDataType["chapterId"];
  };
};

type ChapterVideoState = {
  isEditing: boolean;
  playbackId: string | null;
  videoStatus?: SelectMuxDataType["status"] | null;
  isLoading: boolean;
  isUploading: false;
};

type ChapterVideoAction =
  | { type: "SET_EDITING"; payload: boolean }
  | {
      type: "SET_VIDEO_DATA";
      payload: {
        videoStatus: SelectMuxDataType["status"];
        playbackId?: string | null;
        isUploading: boolean;
      };
    }
  | { type: "SET_LOADING"; payload: boolean };

const chapterVideoReducer = (
  state: ChapterVideoState,
  action: ChapterVideoAction
): ChapterVideoState => {
  switch (action.type) {
    case "SET_EDITING":
      return { ...state, isEditing: action.payload };
    case "SET_VIDEO_DATA":
      return {
        ...state,
        videoStatus: action.payload.videoStatus,
        ...(action.payload.playbackId && {
          playbackId: action.payload.playbackId,
        }),
        isUploading: action.payload.isUploading ?? false,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};

const initialState: ChapterVideoState = {
  isEditing: false,
  playbackId: null,
  videoStatus: undefined,
  isLoading: false,
  isUploading: false,
};

export const ChapterVideoForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useEditChapterById(initialData.chapterId);
  const { data: videoStatus, isPending: videoStatusPending } = useVideoStatus(
    initialData.chapterId
  );
  const [state, dispatch] = useReducer(chapterVideoReducer, initialState);

  const isClient = useClientCheck();

  useEffect(() => {
    if (videoStatusPending) {
      dispatch({ type: "SET_LOADING", payload: true });
    }
    if (!videoStatus || videoStatus === "ready") {
      if (!state.videoStatus || state.videoStatus === "processing") {
        dispatch({
          type: "SET_VIDEO_DATA",
          payload: {
            videoStatus: "ready",
            ...(state.playbackId === null && {
              playbackId: initialData.playbackId,
            }),
            isUploading: false,
          },
        });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    }
    if (videoStatus === "processing") {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({
        type: "SET_VIDEO_DATA",
        payload: { videoStatus: "processing" },
      });
    }
  }, [
    videoStatus,
    initialData.playbackId,
    state.playbackId,
    state.videoStatus,
    videoStatusPending,
  ]);

  const t = useTranslations("createOrEditCourseForm");

  const getButtonContent = (isEditing: boolean, playbackId: string | null) => {
    if (isEditing) {
      return t("cancel");
    }
    if (!isEditing && !playbackId) {
      return "Add a video";
    }
    if (!isEditing && playbackId) {
      return "Edit video";
    }
    return "";
  };

  const getButtonStartIcon = (
    isEditing: boolean,
    playbackId: string | null
  ) => {
    if (!isEditing && playbackId) {
      return <FaPencil />;
    }
    if (!isEditing && !playbackId) {
      return <FaPlus />;
    }
    return null;
  };

  const handleFileUpload = (url?: string, name?: string) => {
    queryClient.invalidateQueries({
      queryKey: ["videoStatus", { chapterId: initialData.chapterId }],
    });
    if (url) {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_EDITING", payload: false });
      mutate(
        {
          videoUrl: url,
          courseId: initialData.courseId,
        },
        {
          onSuccess(data) {
            if (data.status === "processing" && data.playbackId) {
              dispatch({ type: "SET_LOADING", payload: true });
              dispatch({
                type: "SET_VIDEO_DATA",
                payload: {
                  playbackId: data.playbackId,
                  videoStatus: "processing",
                  isUploading: true,
                },
              });
            }
          },
        }
      );
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md relative">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button
          variant="ghost"
          color="primary"
          onPress={() =>
            dispatch({ type: "SET_EDITING", payload: !state.isEditing })
          }
          disabled={state.isLoading || isPending}
          startContent={getButtonStartIcon(state.isEditing, state.playbackId)}
        >
          {getButtonContent(state.isEditing, state.playbackId)}
        </Button>
      </div>

      {state.isLoading ? (
        <Loader withLabel={Boolean(state.videoStatus === "processing")} />
      ) : state.isEditing ? (
        <>
          <FileUpload endpoint="chapterVideo" onChange={handleFileUpload} />
          <div className="text-small mt-4 text-slate-500">
            Upload this chapter&apos;s video. The maximum file size is 512GB
          </div>
        </>
      ) : (
        <VideoDisplay
          playbackId={state.playbackId}
          videoStatus={state.videoStatus ?? null}
          courseId={initialData.courseId}
          title={initialData.title}
          isUploading={state.isUploading}
        />
      )}
    </div>
  );
};

type VideoDisplayProps = {
  playbackId: string | null;
  videoStatus: SelectMuxDataType["status"] | null;
  courseId: string;
  title: string;
  isUploading: boolean;
};

const VideoDisplay = memo<VideoDisplayProps>(
  ({ playbackId, videoStatus, courseId, title, isUploading }) => {
    if (!playbackId || !videoStatus || isUploading) {
      return (
        <div className="flex items-center justify-center mt-4 h-60 bg-slate-200 rounded-md">
          <FaVideo className="size-10 text-slate-500" />
        </div>
      );
    }

    return (
      <div className="relative aspect-video mt-4">
        {videoStatus === "ready" && playbackId ? (
          <MuxPlayer
            className="aspect-video mb-6 w-full"
            playbackId={playbackId}
            streamType="on-demand"
            title={title}
            metadata={{
              video_series: courseId,
              video_title: title,
            }}
          />
        ) : null}
      </div>
    );
  }
);

VideoDisplay.displayName = "VideoDisplay";

const Loader = ({ withLabel = false }: { withLabel?: boolean }) => (
  <div className="grid place-items-center gap-3">
    <CircularProgress color="primary" aria-label="Loading..." />
    {withLabel ? (
      <h2 className="text-slate-500">Video is processing. Please wait.</h2>
    ) : null}
  </div>
);
