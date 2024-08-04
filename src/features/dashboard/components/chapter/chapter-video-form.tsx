"use client";

import useClientCheck from "@/features/auth/hooks/use-client-check";
import MuxPlayer from "@mux/mux-player-react";
import { Button, CircularProgress } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useEffect, useReducer } from "react";
import { FaPencil, FaPlus, FaVideo } from "react-icons/fa6";
import { useEditChapterById } from "../../data/chapter/use-edit-chapter";
import { SelectMuxDataType } from "../../types/mux.type";
import FileUpload from "../file-upload";

type Props = {
  initialData: {
    courseId: string;
    playbackId?: string;
    title: string;
    chapterId: SelectMuxDataType["chapterId"];
    videoStatus?: SelectMuxDataType["status"] | null;
  };
};

type ChapterVideoState = {
  isEditing: boolean;
  playbackId: string | null;
  videoUrl: string | null;
  videoStatus?: SelectMuxDataType["status"] | null;
  isLoading: boolean;
};

type ChapterVideoAction =
  | { type: "SET_EDITING"; payload: boolean }
  | {
      type: "SET_PLAYBACK_ID";
      payload: {
        playbackId: string;
        videoStatus: SelectMuxDataType["status"] | null;
      };
    }
  | {
      type: "SET_VIDEO_URL";
      payload: string | null;
    }
  | { type: "SET_LOADING"; payload: boolean };

const chapterVideoReducer = (
  state: ChapterVideoState,
  action: ChapterVideoAction
): ChapterVideoState => {
  switch (action.type) {
    case "SET_EDITING":
      return { ...state, isEditing: action.payload };
    case "SET_PLAYBACK_ID":
      return {
        ...state,
        playbackId: action.payload.playbackId,
        videoStatus: action.payload.videoStatus,
      };
    case "SET_VIDEO_URL":
      return {
        ...state,
        videoUrl: action.payload || null,
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
  videoUrl: null,
  isLoading: false,
};

export const ChapterVideoForm = ({ initialData }: Props) => {
  const { mutate, isPending } = useEditChapterById(initialData.chapterId);
  const [state, dispatch] = useReducer(chapterVideoReducer, initialState);

  const isClient = useClientCheck();

  useEffect(() => {
    if (initialData.playbackId) {
      if (
        state.playbackId === null ||
        initialData.playbackId !== state.playbackId
      ) {
        dispatch({
          type: "SET_PLAYBACK_ID",
          payload: {
            playbackId: initialData.playbackId,
            videoStatus: initialData.videoStatus ?? null,
          },
        });
      }
    }
    dispatch({ type: "SET_EDITING", payload: false });
    dispatch({ type: "SET_LOADING", payload: false });
  }, [initialData.playbackId, initialData.videoStatus, state.playbackId]);

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
    if (url) {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_EDITING", payload: false });
      dispatch({
        type: "SET_VIDEO_URL",
        payload: url,
      });
      mutate({
        videoUrl: url,
        courseId: initialData.courseId,
      });
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
          disabled={isPending}
          startContent={getButtonStartIcon(state.isEditing, state.playbackId)}
        >
          {getButtonContent(state.isEditing, state.playbackId)}
        </Button>
      </div>

      {state.isLoading ? (
        <Loader />
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
        />
      )}
    </div>
  );
};

// const youtubeVideo = "https://www.youtube.com/watch?v=Xmwl5cPoWWk&list=PPSV&ab_channel=TypedRocks",

const VideoDisplay = ({
  playbackId,
  videoStatus,
  courseId,
  title,
}: {
  playbackId: string | null;
  videoStatus: SelectMuxDataType["status"] | null;
  courseId: string;
  title: string;
}) => {
  if (!playbackId) {
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
          metadata={{
            video_series: courseId,
            video_title: title,
          }}
        />
      ) : null}
    </div>
  );
};

const Loader = () => (
  <div className="grid place-items-center gap-3">
    <CircularProgress color="primary" aria-label="Loading..." />
    <h2 className="text-slate-500">Video is processing. Please wait.</h2>
  </div>
);
