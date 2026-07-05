"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const SOUND_KEY = "pomodoro-sound-enabled";
const NOTIFICATION_KEY = "pomodoro-notifications-enabled";
const ALARMS_KEY = "pomodoro-alarms";

export interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  label?: string;
}

function loadBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return stored === "true";
  } catch (e) {
    console.error("Failed to load setting:", e);
  }
  return fallback;
}

function saveBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(value));
  } catch (e) {
    console.error("Failed to save setting:", e);
  }
}

function loadAlarms(): Alarm[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ALARMS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load alarms:", e);
  }
  return [];
}

function saveAlarms(alarms: Alarm[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
  } catch (e) {
    console.error("Failed to save alarms:", e);
  }
}

function getInitialPermission(): NotificationPermission {
  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission;
  }
  return "default";
}

export function useNotifications() {
  const [soundEnabled, setSoundEnabled] = useState(() =>
    loadBool(SOUND_KEY, true),
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
    loadBool(NOTIFICATION_KEY, false),
  );
  const [permission, setPermission] =
    useState<NotificationPermission>(getInitialPermission);
  const [alarms, setAlarms] = useState<Alarm[]>(() => loadAlarms());
  const lastCheckedMinuteRef = useRef<string>("");

  useEffect(() => {
    saveBool(SOUND_KEY, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveBool(NOTIFICATION_KEY, notificationsEnabled);
  }, [notificationsEnabled]);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") {
      setPermission("granted");
      return true;
    }
    if (Notification.permission === "denied") {
      setPermission("denied");
      return false;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    setNotificationsEnabled((prev) => !prev);
  }, [notificationsEnabled, requestPermission]);

  const sendNotification = useCallback(
    (title: string, body: string) => {
      if (!notificationsEnabled || permission !== "granted") return;
      if (typeof window === "undefined" || !("Notification" in window)) return;
      new Notification(title, { body });
    },
    [notificationsEnabled, permission],
  );

  const addAlarm = useCallback((time: string, label?: string) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      enabled: true,
      label,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm,
      ),
    );
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      if (currentTime === lastCheckedMinuteRef.current) return;
      lastCheckedMinuteRef.current = currentTime;

      const matchingAlarms = alarms.filter(
        (alarm) => alarm.enabled && alarm.time === currentTime,
      );

      if (matchingAlarms.length > 0) {
        if (soundEnabled) {
          import("@/lib/alarm").then(({ playAlarm }) => playAlarm());
        }
        const labels = matchingAlarms.map((a) => a.label || "Alarm");
        const title =
          labels.length === 1 ? labels[0] : `${labels.length} alarms`;
        sendNotification(title, title);
      }
    };

    const interval = setInterval(checkAlarms, 15000);
    return () => clearInterval(interval);
  }, [alarms, sendNotification, soundEnabled]);

  return {
    soundEnabled,
    notificationsEnabled,
    permission,
    toggleSound,
    toggleNotifications,
    sendNotification,
    alarms,
    addAlarm,
    removeAlarm,
    toggleAlarm,
  };
}
