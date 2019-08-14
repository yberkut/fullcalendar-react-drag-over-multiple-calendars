import React, { FC } from "react";
import uuid4 from "uuid/v4";

import FullCalendar from "@fullcalendar/react";
import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import EventApi from "@fullcalendar/core/api/EventApi";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import { WorkCalendarProps, defaultProps } from "./work-calendar.props";
// import { useStyles } from "./weekly-calendar.styles";

const getPlaceholder = (
  calendar: Calendar,
  title: string
): EventApi | undefined => {
  return calendar.getEvents().find(e => e.id === "" && e.title === title);
};

const dayTimeRange = {
  start: "09:00",
  end: "19:00"
};

const localeEn = {
  code: "en",
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7
  },
  weekLabel: "W",
  noEventsMessage: "No events to show"
};

const eventSource = {
  editable: true,
  overlap: false,
  constraint: {
    startTime: dayTimeRange.start,
    endTime: dayTimeRange.end
  }
};

export const WorkCalendar: FC<WorkCalendarProps> = props => {
  const { extEvents, onAddExternal } = props;

  // const classes = useStyles();
  const calendarRef = React.createRef<FullCalendar>();

  const getCalendarApi = (): Calendar => {
    return calendarRef && calendarRef.current
      ? calendarRef.current.getApi()
      : ({} as any);
  };

  const extEventSource = {
    ...eventSource,
    events: extEvents,
    id: "ext-event-source"
    // className: classes.extEvent
  };

  const handleEventReceive = ({ event }: { event: EventApi }) => {
    const newEvent = {
      id: uuid4(),
      title: event.title,
      start: event.start,
      end: event.end
    };
    const calendar = getCalendarApi();
    const e = getPlaceholder(calendar, event.title);
    e && e.remove();
    onAddExternal && onAddExternal(newEvent);
  };

  return (
    <div /*className={classes.root}*/>
      <FullCalendar
        ref={calendarRef}
        locale={localeEn}
        defaultView="timeGridWeek"
        weekNumbers={false}
        allDaySlot={false}
        header={false}
        selectMirror={false}
        selectable={true}
        editable={true}
        droppable={true}
        eventOverlap={false}
        plugins={[timeGridPlugin, interactionPlugin, momentPlugin]}
        weekends={false}
        slotLabelFormat={"H:mm"}
        slotDuration={"00:30:00"}
        slotLabelInterval={"01:00"}
        slotEventOverlap={false}
        minTime={dayTimeRange.start}
        maxTime={dayTimeRange.end}
        snapDuration={"00:45:00"}
        columnHeaderFormat={{ weekday: "short" }}
        eventTimeFormat={"H:mm"}
        height="parent"
        eventSources={[extEventSource]}
        eventReceive={handleEventReceive}
      />
    </div>
  );
};

WorkCalendar.defaultProps = defaultProps;
