import UserCard from "@/components/UserCard";
import FinanceChart from "@/components/FinanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import CountChartContainer from "@/components/CountChartContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import {SearchParams} from "@/lib/types";
import EventCalendarContainer from "@/components/EventCalendarContainer";

const AdminPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {

    const params = await searchParams;
    const {date} = params;

    return (
        <div className="p-4 flex flex-col gap-4 md:flex-row">
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                <div className="flex justify-center gap-4 flex-wrap">
                    <UserCard type="admin"/>
                    <UserCard type="teacher"/>
                    <UserCard type="student"/>
                    <UserCard type="parent"/>
                </div>
                <div className="flex gap-4 flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChartContainer/>
                    </div>
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChartContainer/>
                    </div>
                </div>
                <div className="w-full h-[500px]">
                    <FinanceChart/>
                </div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendarContainer searchDate={date as string}/>
                <Announcements/>
            </div>
        </div>
    );
}

export default AdminPage;