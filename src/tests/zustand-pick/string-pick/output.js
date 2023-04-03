import { shallow } from "zustand/shallow";
const { order, customer, address } = useGlobalStore(
  (store) => ({
    order: store["state"]?.["order"],
    customer: store["state"]?.["customer"],
    address: store["state"]?.["address"],
  }),
  shallow
);
