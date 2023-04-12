const { order, customer } = useGlobalStore.pick([
  "state",
  sessionId,
  "current",
  data,
]);
