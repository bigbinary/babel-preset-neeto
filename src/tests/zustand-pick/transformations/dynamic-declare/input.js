const { [`customer ${id}`]: customer } = useGlobalStore.pick(sessionId);
const { [orderId]: order } = useGlobalStore.pick([sessionId, "orders"]);
