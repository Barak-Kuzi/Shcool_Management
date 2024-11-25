"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
    const [value, onChange] = useState<value>(new Date());

    const router = useRouter();

    useEffect(() => {
        if (value instanceof Date) {
            router.push(`?date=${value}`);
        }
    }, [value, router]);

    return <Calendar onChange={onChange} value={value} calendarType="iso8601" locale="en-US"/>
}

export default EventCalendar;