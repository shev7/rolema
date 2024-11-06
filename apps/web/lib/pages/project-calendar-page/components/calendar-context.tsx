"use client";

import React from "react";

import { createContext } from "@repo/ui";

type NewEvent = {
  startDate: Date;
  endDate: Date;
};

export type CalendarContextValue = {
  newEvent?: NewEvent;
  updateNewEvent: React.Dispatch<React.SetStateAction<NewEvent | undefined>>;
};

export const [Provider, useCalendar] = createContext<CalendarContextValue>(
  null as unknown as CalendarContextValue,
);

export const CalendarContextProviver = ({
  children,
}: React.PropsWithChildren) => {
  const [newEvent, setNewEvent] = React.useState<NewEvent | undefined>(
    undefined,
  );

  return (
    <Provider newEvent={newEvent} updateNewEvent={setNewEvent}>
      {children}
    </Provider>
  );
};
