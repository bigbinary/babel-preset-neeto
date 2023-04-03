import { shallow } from "zustand/shallow";
const { order, customer } = useGlobalStore(
  (store) => ({
    order: store["state"]?.[sessionId]?.["current"]?.[data]?.["order"],
    customer: store["state"]?.[sessionId]?.["current"]?.[data]?.["customer"],
  }),
  shallow
);
