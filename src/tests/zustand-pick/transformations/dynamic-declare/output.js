import { shallow } from "zustand/shallow";
const { [`customer ${id}`]: customer } = useGlobalStore(
  store => ({
    [`customer ${id}`]: store[sessionId]?.[`customer ${id}`],
  }),
  shallow
);
const { [orderId]: order } = useGlobalStore(
  store => ({
    [orderId]: store[sessionId]?.["orders"]?.[orderId],
  }),
  shallow
);
