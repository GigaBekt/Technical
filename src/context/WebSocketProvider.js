import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import useWebSocket from "react-use-websocket";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const url = "wss://stream.binance.com:9443/ws/btcusdt@trade";
  const tradesRef = useRef([]);
  const [, setRenderTrigger] = useState(0);
  const { lastMessage } = useWebSocket(url);

  const updateTrades = (data) => {
    const price = parseFloat(data.p);
    const date = new Date(data.T);

    tradesRef.current = [
      { price: price, quantity: data.q, time: date.toLocaleString() },
      ...tradesRef.current,
    ];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderTrigger((prev) => prev + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastMessage !== null) {
        const data = JSON.parse(lastMessage.data);
        updateTrades(data);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lastMessage]);

  return (
    <WebSocketContext.Provider value={{ trades: tradesRef.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};
