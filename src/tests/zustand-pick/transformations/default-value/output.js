import { shallow } from "zustand/shallow";
const { orderId = "#1001", customer = {} } = useGlobalStore(
  store => ({
    orderId: store["orderId"],
    customer: store["customer"],
  }),
  shallow
);
