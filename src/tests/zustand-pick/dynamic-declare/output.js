import { shallow } from "zustand/shallow";
const { [`customer ${id}`]: customer } = useGlobalStore(
  (store) => ({
    [`customer ${id}`]: store[sessionId]?.[`customer ${id}`],
  }),
  shallow
);
