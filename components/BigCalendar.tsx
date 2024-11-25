"use client";

import {useState} from "react";
import {Calendar, momentLocalizer, View, Views} from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';

const localizer = momentLocalizer(moment)

type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
};

type BigCalendarProps = {
    events: CalendarEvent[];
};

const BigCalendar = ({events}: BigCalendarProps) => {
    const [view, setView] = useState<View>(Views.WORK_WEEK);

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView);
    }

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["work_week", "day"]}
            view={view}
            onView={handleOnChangeView}
            style={{height: "98%"}}
            min={new Date(2025, 1, 0, 8, 0, 0)}
            max={new Date(2025, 1, 0, 17, 0, 0)}
        />
    );
};

export default BigCalendar;