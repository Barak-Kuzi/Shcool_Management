import Image from "next/image";

import EventList from "@/components/EventList";
import EventCalendar from "@/components/EventCalendar";

const EventCalendarContainer = async ({searchDate}: {searchDate: string}) => {
    return (
        <div className="bg-white p-4 rounded-md">
            <EventCalendar/>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold my-4">Events</h1>
                <Image src="/moreDark.png" alt="more" width={20} height={20}/>
            </div>
            <div className="flex flex-col gap-4">
                <EventList dateParam={searchDate}/>
            </div>
        </div>
    );
}

export default EventCalendarContainer;