import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  return c.json({
    data: [
      {
        id: 1,
        name: "user 1",
      },
      {
        id: 2,
        name: "user 2",
      },
    ],
  });
});

export default app;
