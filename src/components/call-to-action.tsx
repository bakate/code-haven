import { LoginForm } from "@/features/auth/components/login-form";
import { useToggle } from "@/hooks/use-toggle";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { LuPlay } from "react-icons/lu";

type Props = {
  content: {
    title: string;
    button: string;
    description: string;
  };
  onPress: () => void;
};
export const CallToAction = ({ content, onPress }: Props) => {
  const { isOpen, onClose, onOpen } = useToggle();
  const session = useSession();
  const isAuthenticatedStudent = session?.status === "authenticated";

  const handlePress = () => {
    if (isAuthenticatedStudent) {
      onPress();
    } else {
      onOpen();
    }
  };

  return (
    <div
      className="bg-gradient-to-r
    rounded-md border  p-6 from-sky-900 via-sky-950 to-slate-900 grid gap-3"
    >
      <h2 className="text-2xl font-bold text-white first-letter:capitalize">
        {content.title}
      </h2>
      <p className="text-gray-300 text-small first-letter:capitalize">
        {content.description}
      </p>
      <Popover
        isOpen={isOpen}
        onOpenChange={() => onClose()}
        showArrow
        offset={10}
        placement="bottom"
        backdrop="blur"
      >
        <PopoverTrigger>
          <Button
            startContent={<LuPlay />}
            onClick={handlePress}
            color="primary"
          >
            {content.button}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {(titleProps) => (
            <div {...titleProps}>
              <LoginForm />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
