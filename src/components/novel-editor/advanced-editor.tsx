"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";

import { useState } from "react";
import { defaultExtensions } from "./extensions";

import { cn } from "@/lib/utils";
import { EditorMenuWithContent } from "./editor-menu";
import { uploadFn } from "./image-upload";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

interface EditorProps {
  content: string | null;
  teacherView?: boolean;
  setEditor?: (editor: EditorInstance) => void;
}

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}
export const NovelEditor = ({
  content,
  setEditor,
  teacherView,
}: EditorProps) => {
  const [saveStatus, setSaveStatus] = useState("saved");
  const [charsCount, setCharsCount] = useState();

  const initialContent = content ? JSON.parse(content) : defaultEditorContent;

  if (!initialContent) return null;

  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        extensions={extensions}
        initialContent={initialContent}
        className={cn(
          "border p-4 rounded-xl relative w-full max-w-screen-lg 2xl:max-w-screen-2xl bg-background mt-4 dark:border-slate-700"
        )}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          setSaveStatus("unSaved");
          // onChange(editor.getJSON());
        }}
        onCreate={({ editor }) => {
          if (setEditor) {
            setEditor(editor);
          }
          if (!teacherView) {
            editor.setEditable(false);
          }
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorMenuWithContent />
      </EditorContent>
    </EditorRoot>
  );
};
