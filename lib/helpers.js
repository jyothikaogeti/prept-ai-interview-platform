import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  set,
} from "date-fns";

export function formatShortDate(date) {
  return format(new Date(date), "EEE, MMM d, yyyy");
}

export function formatLongDate(date) {
  return format(new Date(date), "EEEE, MMMM d, yyyy");
}

export function formatTime(date) {
  return format(new Date(date), "h:mm a");
}

export function formatDateTabLabel(date) {
  const formattedDate = format(date, "MMM d");

  if (isToday(date))
    return {
      top: "Today",
      bottom: formattedDate,
    };
  if (isTomorrow(date))
    return {
      top: "Tomorrow",
      bottom: formattedDate,
    };

  return {
    top: format(date, "EEE"),
    bottom: formattedDate,
  };
}

export function calculateDuration(startTime, endTime) {
  const totalMinutes = differenceInMinutes(
    new Date(endTime),
    new Date(startTime),
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours}h${minutes > 0 ? `${minutes}m` : ""}`
    : `${minutes}m`;
}

export function generateDates(daysAhead) {
  return Array.from({ length: daysAhead }, (_, index) =>
    addDays(new Date(), index),
  );
}

export function generateSlots(
  date,
  availStartTime,
  availEndTime,
  bookedSlots,
  slotDurationMinutes,
) {
  const availStart = new Date(availStartTime);
  const availEnd = new Date(availEndTime);

  const startTime = set(new Date(date), {
    hours: availStart.getHours(),
    minutes: availStart.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });

  const endTime = set(new Date(date), {
    hours: availEnd.getHours(),
    minutes: availEnd.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });

  const currentTime = new Date();
  const slots = [];

  let slotStartTime = startTime;

  while (isBefore(slotStartTime, endTime)) {
    const slotEndTime = addMinutes(slotStartTime, slotDurationMinutes);

    if (isAfter(slotEndTime, endTime)) break;

    const isBooked = bookedSlots.some(
      (booked) =>
        isBefore(slotStartTime, new Date(booked.endTime)) &&
        isAfter(slotEndTime, new Date(booked.startTime)),
    );

    if (isAfter(slotStartTime, currentTime)) {
      slots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        isBooked,
        available: !isBooked,
      });
    }
    slotStartTime = slotEndTime;
  }
  return slots;
}
