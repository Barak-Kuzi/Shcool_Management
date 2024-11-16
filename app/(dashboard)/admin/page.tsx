import UserCard from "@/components/UserCard";
import CountChart from "@/components/CountChart";
import AttendanceChart from "@/components/AttendanceChart";
import FinanceChart from "@/components/FinanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";

const AdminPage = () => {
    return (
        <div className="p-4 flex flex-col gap-4 md:flex-row">
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                <div className="flex justify-center gap-4 flex-wrap">
                    <UserCard type="student"/>
                    <UserCard type="teacher"/>
                    <UserCard type="parent"/>
                    <UserCard type="staff"/>
                </div>
                <div className="flex gap-4 flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart/>
                    </div>
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart/>
                    </div>
                </div>
                <div className="w-full h-[500px]">
                    <FinanceChart/>
                </div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendar/>
                <Announcements/>
            </div>
        </div>
    );
}

export default AdminPage;