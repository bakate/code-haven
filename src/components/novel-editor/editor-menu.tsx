import { Divider } from "@nextui-org/react";
import { EditorBubble, useEditor } from "novel";
import { type ReactNode, useEffect, useState } from "react";
import {
  ColorSelector,
  LinkSelector,
  NodeSelector,
  TextButtons,
} from "./selectors";
import { MathSelector } from "./selectors/math-selector";

interface EditorMenuProps {
  children?: ReactNode;
}

export const EditorMenuWithContent = ({ children }: EditorMenuProps) => {
  const { editor } = useEditor();
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  useEffect(() => {
    if (!editor) return;
  }, [editor]);

  return (
    <EditorBubble
      tippyOptions={{
        placement: "top",
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      <Divider orientation="vertical" />
      <NodeSelector open={openNode} onOpenChange={setOpenNode} />
      <Divider orientation="vertical" />
      <LinkSelector open={openLink} onOpenChange={setOpenLink} />
      <Divider orientation="vertical" />
      <MathSelector />
      <Divider orientation="vertical" />
      <TextButtons />
      <Divider orientation="vertical" />
      <ColorSelector open={openColor} onOpenChange={setOpenColor} />
      {children}
    </EditorBubble>
  );
};
