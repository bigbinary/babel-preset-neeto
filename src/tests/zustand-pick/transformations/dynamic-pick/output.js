import { shallow } from "zustand/shallow";
const { customer } = useGlobalStore(
  store => ({
    customer: store[sessionId]?.["customer"],
  }),
  shallow
);
