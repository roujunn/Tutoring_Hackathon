export const LS = {
  users: "tl_users",
  session: "tl_session",
  messages: "tl_messages",
  notes: "tl_notes",
  resources: "tl_resources",
  homeworks: "tl_homeworks",
  recordings: "tl_recordings",
  subjectRequests: "tl_subjectRequests",
  notifications: "tl_notifications",
};

import React from "react";

export function useLocalStorage(key, initial) {
  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}
