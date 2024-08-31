import { EditorBubbleItem, useEditor } from "novel";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import {
  LuBold,
  LuCode,
  LuItalic,
  LuStrikethrough,
  LuUnderline,
} from "react-icons/lu";
import type { SelectorItem } from "./node-selector";

export const TextButtons = () => {
  const { editor } = useEditor();
  if (!editor) return null;

  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: LuBold,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: LuItalic,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: LuUnderline,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: LuStrikethrough,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: LuCode,
    },
  ];

  return (
    <div className="flex">
      {items.map((item, index) => (
        <EditorBubbleItem key={index} onSelect={() => item.command(editor)}>
          <Button
            className={cn("rounded-none", {
              "text-blue-500 border-blue-500": item.isActive(editor),
            })}
            variant="ghost"
            size="sm"
            onPress={() => item.command(editor)}
          >
            <item.icon className="size-4" />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
