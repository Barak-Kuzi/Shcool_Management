import prisma from "@/lib/prisma";
import BigCalendar from "@/components/BigCalendar";
import {adjustScheduleToCurrentWeek} from "@/lib/utils";

type BigCalendarContainerProps = {
    type: "teacherId" | "classId";
    id: string | number;
}

const BigCalendarContainer = async ({type, id}: BigCalendarContainerProps) => {

    const dataRes = await prisma.lesson.findMany({
        where: {
            ...(type === "teacherId"
                ? {teacherId: id as string}
                : {classId: id as number}),
        },
    });

    const data = dataRes.map((lesson) => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime,
    }));

    const schedule = adjustScheduleToCurrentWeek(data);

    return (
        <div>
            <BigCalendar events={schedule}/>
        </div>
    );
};

export default BigCalendarContainer;