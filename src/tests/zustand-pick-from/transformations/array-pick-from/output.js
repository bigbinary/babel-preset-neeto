const order = useGlobalStore(
  store => store["state"]?.[sessionId]?.["current"]?.[data]?.["order"]
);
