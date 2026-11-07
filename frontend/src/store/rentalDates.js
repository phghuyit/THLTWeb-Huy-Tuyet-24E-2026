"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistentState } from "@/hooks";
import { rentalDays } from "@/lib/date";

const RentalDatesContext = createContext(null);

export function useRentalDates() {
  const ctx = useContext(RentalDatesContext);
  if (!ctx) throw new Error("useRentalDates phải nằm trong <RentalDatesProvider>");
  return ctx;
}

export function RentalDatesProvider({ children }) {
  const [range, setRangeState, hydrated] = usePersistentState(
    "stylerent.dates.v1",
    { from: null, to: null },
  );

  const setRange = useCallback(
    (pickup, ret) => setRangeState({ from: pickup, to: ret }),
    [setRangeState],
  );

  const clear = useCallback(() => setRangeState({ from: null, to: null }), [setRangeState]);

  const value = useMemo(() => {
    const hasRange = Boolean(range.from && range.to);
    return {
      pickupDate: range.from,
      returnDate: range.to,
      days: hasRange ? rentalDays(range.from, range.to) : 0,
      hasRange,
      hydrated,
      setRange,
      clear,
    };
  }, [range, hydrated, setRange, clear]);

  return <RentalDatesContext.Provider value={value}>{children}</RentalDatesContext.Provider>;
}
