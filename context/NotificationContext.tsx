import React, { createContext, ReactNode, useState } from "react";

// Crear el UserContext
const NotificationContext = createContext<UnseenNotificationsValue | null>(
  null
);

export interface UnseenNotificationsValue {
  unseenNotifications: number;
  saveUnseenNotifications: (unseenNotifications: number) => void;
}

const UnseenNotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [unseenNotifications, setUnseenNotifications] = useState<number>(0);

  const saveUnseenNotifications = (unseenNotifications: number) => {
    setUnseenNotifications(unseenNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{ unseenNotifications, saveUnseenNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, UnseenNotificationsProvider };
