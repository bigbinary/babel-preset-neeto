import { shallow } from "zustand/shallow";
const { order, customer } = useStore(
  store => ({
    order: store["order"],
    customer: store["customer"],
  }),
  shallow
);
