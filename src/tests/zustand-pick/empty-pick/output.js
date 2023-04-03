import { shallow } from "zustand/shallow";
const { order, customer } = useGlobalStore(
  (store) => ({
    order: store["order"],
    customer: store["customer"],
  }),
  shallow
);
