import { IconType } from "react-icons/lib";
import { Category } from "./category.type";
import { FaReact } from "react-icons/fa6";
import {
  SiAngular,
  SiDrizzle,
  SiHono,
  SiJest,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiReactquery,
  SiTailwindcss,
  SiTestinglibrary,
} from "react-icons/si";

export const categoryIconMap: Record<Category["name"], IconType> = {
  "React.js": FaReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Prisma: SiPrisma,
  Drizzle: SiDrizzle,
  Hono: SiHono,
  Jest: SiJest,
  "React Testing Library": SiTestinglibrary,
  "TanStack Query (React Query)": SiReactquery,
  Angular: SiAngular,
};
