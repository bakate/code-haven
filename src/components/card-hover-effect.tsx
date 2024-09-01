import { AnimatePresence, motion } from "framer-motion";

type Props = {
  idx: number;
  hoveredIndex: number | null;
  onHover: (idx: number | null) => void;
  children: React.ReactNode;
};

export const HoverEffect = ({
  children,
  idx,
  hoveredIndex,
  onHover,
}: Props) => {
  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={() => onHover(null)}
    >
      <AnimatePresence>
        {hoveredIndex === idx && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};
