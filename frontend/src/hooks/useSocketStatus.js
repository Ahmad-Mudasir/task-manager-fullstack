import { useEffect, useState } from "react";

export function useSocketStatus(socket) {
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const onConnect = () => setOnline(true);
    const onDisconnect = () => setOnline(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);
  return online;
}
