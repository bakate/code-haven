"use client";

import useClientCheck from "@/hooks/use-client-check";

import MuxPlayer from "@mux/mux-player-react";
import { Button, CircularProgress } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { memo, useEffect, useReducer } from "react";
import { FaPencil, FaPlus, FaVideo } from "react-icons/fa6";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";
import { SelectMuxDataType } from "../../types/mux.type";
import FileUpload from "../file-upload";
import { FormContainer } from "../form-container";

type Props = {
  initialData: {
    courseId: string;
    playbackId?: string;
    title: string;
    chapterId: SelectMuxDataType["chapterId"];
    videoStatus: SelectMuxDataType["status"] | null;
  };
};

type ChapterVideoState = {
  isEditing: boolean;
  playbackId: string | null;
  isLoading: boolean;
};

type ChapterVideoAction =
  | { type: "SET_EDITING"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PLAYBACK_ID"; payload: string | null };

const chapterVideoReducer = (
  state: ChapterVideoState,
  action: ChapterVideoAction
): ChapterVideoState => {
  switch (action.type) {
    case "SET_EDITING":
      return { ...state, isEditing: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PLAYBACK_ID":
      return { ...state, playbackId: action.payload };

    default:
      return state;
  }
};

const initialState: ChapterVideoState = {
  isEditing: false,
  playbackId: null,
  isLoading: false,
};

export const ChapterVideoForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useEditChapterById(initialData.chapterId);
  const [state, dispatch] = useReducer(chapterVideoReducer, initialState);

  const isClient = useClientCheck();

  useEffect(() => {
    const { videoStatus, playbackId } = initialData;
    if (!videoStatus && playbackId) {
      dispatch({
        type: "SET_PLAYBACK_ID",
        payload: playbackId,
      });
    }
    if (videoStatus === "ready") {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
      if (playbackId && !state.playbackId) {
        dispatch({
          type: "SET_PLAYBACK_ID",
          payload: playbackId,
        });
      }
    }
    if (videoStatus === "processing") {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_EDITING", payload: false });
    }
  }, [initialData, state.playbackId]);

  const t = useTranslations("createOrEditCourseForm");

  const getButtonContent = (isEditing: boolean, playbackId: string | null) => {
    if (isEditing) {
      return t("cancel");
    }
    if (!isEditing && !playbackId) {
      return t("addVideo");
    }
    if (!isEditing && playbackId) {
      return t("editVideo");
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
      mutate(
        {
          videoUrl: url,
          courseId: initialData.courseId,
        },
        {
          onSuccess(data) {
            if (data.status === "processing" && data.playbackId) {
              dispatch({
                type: "SET_PLAYBACK_ID",
                payload: data.playbackId,
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
    <FormContainer>
      <div className="font-medium flex items-center justify-between">
        {t("chapterVideo")}
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
        <Loader
          withLabel={Boolean(initialData.videoStatus === "processing")}
          label={t("videoProcessing")}
        />
      ) : state.isEditing ? (
        <>
          <FileUpload endpoint="chapterVideo" onChange={handleFileUpload} />
          <div className="text-small mt-4 text-slate-500 dark:text-slate-200">
            {t("uploadInstruction", { size: 512 })}
          </div>
        </>
      ) : (
        <VideoDisplay
          playbackId={state.playbackId}
          courseId={initialData.courseId}
          title={initialData.title}
        />
      )}
    </FormContainer>
  );
};

type VideoDisplayProps = {
  playbackId: string | null;
  courseId: string;
  title: string;
};

const VideoDisplay = memo<VideoDisplayProps>(
  ({ playbackId, courseId, title }) => {
    if (!playbackId) {
      return (
        <div className="flex items-center justify-center mt-4 h-60 bg-slate-200 rounded-md dark:bg-slate-800">
          <FaVideo className="size-10 text-slate-500" />
        </div>
      );
    }

    return (
      <div className="relative aspect-video mt-4">
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
      </div>
    );
  }
);

VideoDisplay.displayName = "VideoDisplay";

const Loader = ({
  withLabel = false,
  label,
}: {
  withLabel?: boolean;
  label?: string;
}) => (
  <div className="grid place-items-center gap-3">
    <CircularProgress color="primary" aria-label="Loading..." />
    {withLabel ? <h2 className="text-slate-500">{label}</h2> : null}
  </div>
);
