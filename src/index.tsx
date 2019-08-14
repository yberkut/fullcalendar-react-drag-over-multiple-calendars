import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Draggable } from "@fullcalendar/interaction";

import "./styles.scss";

import { WorkCalendar } from "./work-calendar";

const eventData = [
  { title: "My Birthday" },
  { title: "Meeting with customer" },
  { title: "Vacation" },
  { title: "Lunch" }
];

function App() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl!, {
      itemSelector: ".fc-event",
      eventData: function(eventEl) {
        const title = eventEl.getAttribute("title");
        const duration = eventEl.getAttribute("data-duration");
        return {
          title,
          duration,
          create: false
        };
      }
    });
  }, []);

  const addEvent = (event: any) => {
    setEvents([...(events || []), event]);
  };

  return (
    <div>
      <p>
        <strong>Events</strong>
      </p>
      <div id="external-events" style={{ display: "flex", marginBottom: 20 }}>
        {eventData.map((event, index) => (
          <div
            key={index}
            className="fc-event"
            style={{ margin: 6, fontSize: 14, padding: 2, height: 20 }}
            title={event.title}
            data-duration="00:45:00"
          >
            {event.title}
          </div>
        ))}
      </div>
      <div className="calendars" style={{ display: "flex" }}>
        <div style={{ marginRight: 15 }}>
          <p>
            <strong>My Calendar</strong>
          </p>
          <WorkCalendar extEvents={events} onAddExternal={addEvent} />
        </div>
        <div style={{ marginLeft: 15 }}>
          <p>
            <strong>Team Calendar</strong>
          </p>
          <WorkCalendar extEvents={events} onAddExternal={addEvent} />
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
