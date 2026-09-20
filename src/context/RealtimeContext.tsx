'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface RealtimeContextType {
  isConnected: boolean;
  isReconnecting: boolean;
  lastMessage: any;
  sendMessage: (msg: any) => void;
  registerListener: (type: string, callback: (data: any) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  isReconnecting: false,
  lastMessage: null,
  sendMessage: () => {},
  registerListener: () => () => {},
});

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  // Debounced message queue to prevent rapid-fire jank
  const eventQueueRef = useRef<any[]>([]);
  const queueTimerRef = useRef<NodeJS.Timeout | null>(null);

  const flushQueue = useCallback(() => {
    if (eventQueueRef.current.length === 0) return;
    const batch = [...eventQueueRef.current];
    eventQueueRef.current = [];

    batch.forEach((msg) => {
      const type = msg.type || 'generic';
      const callbacks = listenersRef.current.get(type);
      if (callbacks) {
        callbacks.forEach((cb) => cb(msg.data || msg));
      }
      const wildcardCallbacks = listenersRef.current.get('*');
      if (wildcardCallbacks) {
        wildcardCallbacks.forEach((cb) => cb(msg));
      }
    });
  }, []);

  const connect = useCallback(() => {
    try {
      const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws/stream';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        retryCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastMessage(parsed);

          // Queue and debounce (flush after 120ms max)
          eventQueueRef.current.push(parsed);
          if (!queueTimerRef.current) {
            queueTimerRef.current = setTimeout(() => {
              flushQueue();
              queueTimerRef.current = null;
            }, 120);
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsReconnecting(true);

        // Exponential backoff reconnect: 1s, 2s, 4s, up to 10s
        const backoff = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
        retryCountRef.current += 1;

        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, backoff);
      };

      ws.onerror = () => {
        ws.close();
      };

      socketRef.current = ws;
    } catch (err) {
      setIsConnected(false);
      setIsReconnecting(true);
    }
  }, [flushQueue]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (queueTimerRef.current) clearTimeout(queueTimerRef.current);
    };
  }, [connect]);

  const sendMessage = (msg: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  const registerListener = (type: string, callback: (data: any) => void) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }
    listenersRef.current.get(type)!.add(callback);

    return () => {
      const set = listenersRef.current.get(type);
      if (set) {
        set.delete(callback);
        if (set.size === 0) listenersRef.current.delete(type);
      }
    };
  };

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        isReconnecting,
        lastMessage,
        sendMessage,
        registerListener,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
