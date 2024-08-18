"use client";

import useClientCheck from "@/hooks/use-client-check";
import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Chip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LuGrip, LuPencil } from "react-icons/lu";
import { selectChapterType } from "../types";

type Props = {
  items: selectChapterType[];
  onEdit: (id: string) => void;
  onReorder: (
    updateData: { id: string; position: number; courseId: string }[]
  ) => void;
};
export const ChaptersList = ({ items, onEdit, onReorder }: Props) => {
  const isClient = useClientCheck();
  const [chapters, setChapters] = useState(() => items);
  const t = useTranslations("createOrEditCourseForm");

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isClient) {
    return null;
  }
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    if (source.index === destination.index) {
      return;
    }
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const startIndex = Math.min(source.index, destination.index);
    const endIndex = Math.max(source.index, destination.index);

    const updatedData = items.slice(startIndex, endIndex + 1);
    setChapters(updatedData);

    const bulkUpdateData = updatedData.map((chapter) => ({
      id: chapter.id!,
      position: items.findIndex((item) => item.id === chapter.id),
      courseId: chapter.courseId,
    }));

    onReorder(bulkUpdateData);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id!}
                draggableId={chapter.id!}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm dark:bg-slate-900  dark:border-slate-700 dark:text-slate-300",
                      chapter.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "relative px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition dark:border-r-slate-700 hover:dark:bg-slate-800",
                        chapter.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <LuGrip className="size-5 w-full" />
                    </div>
                    {chapter.title}

                    <div className="ml-auto pr-2 flex items-center gap-x-2 relative">
                      {chapter.isFree && (
                        <Chip variant="flat">{t("free")}</Chip>
                      )}
                      <Chip
                        variant="flat"
                        color={chapter.isPublished ? "success" : "secondary"}
                      >
                        {chapter.isPublished ? t("published") : t("draft")}
                      </Chip>
                      <LuPencil
                        onClick={() => onEdit(chapter.id!)}
                        className="w-4 h-4 hover:cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
