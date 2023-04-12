import { shallow } from "zustand/shallow";
import React from "react";
import { sample } from "somewhere";
const { order, customer } = useGlobalStore(
  store => ({
    order: store["order"],
    customer: store["customer"],
  }),
  shallow
);
