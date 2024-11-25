import Image from "next/image";

import {Class, Event, Prisma} from "@prisma/client";
import prisma from "@/lib/prisma";
import {ITEMS_PER_PAGE} from "@/lib/settings";
import {SearchParams} from "@/lib/types";
import {getUserDetails} from "@/lib/utils";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

type EventList = Event & { class: Class };

const EventListPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {

    const {role, userId} = await getUserDetails();

    const columns = [
        {
            header: "Title",
            accessor: "title",
        },
        {
            header: "Class",
            accessor: "class",
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell",
        },
        {
            header: "Start Time",
            accessor: "startTime",
            className: "hidden md:table-cell",
        },
        {
            header: "End Time",
            accessor: "endTime",
            className: "hidden md:table-cell",
        },
        ...(role === "admin"
            ? [
                {
                    header: "Actions",
                    accessor: "action",
                },
            ]
            : []),
    ];

    const renderRow = (item: EventList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.title}</td>
            <td>{item.class?.name || "-"}</td>
            <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
            <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })}</td>
            <td className="hidden md:table-cell">{item.endTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormModal table="event" type="update" data={item}/>
                            <FormModal table="event" type="delete" id={item.id}/>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const params = await searchParams;
    const {page, ...queryParams} = params;

    const currentPage = page ? parseInt(page) : 1;
    const query: Prisma.EventWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.title = {contains: value, mode: "insensitive"};
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const roleConditions = {
        teacher: {lessons: {some: {teacherId: userId!}}},
        student: {students: {some: {id: userId!}}},
        parent: {students: {some: {parentId: userId!}}},
    };

    query.OR = [
        {classId: null},
        {
            class: roleConditions[role as keyof typeof roleConditions] || {},
        },
    ];

    const [amountEvents, eventsData] = await prisma.$transaction([
        prisma.event.count({where: query}),
        prisma.event.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (currentPage - 1),
        }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/filter.png" alt="filter button" width={14} height={14}/>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/sort.png" alt="sort button" width={14} height={14}/>
                        </button>
                        {role === "admin" && <FormModal table="event" type="create"/>}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={eventsData}/>
            {/* PAGINATION */}
            <Pagination page={currentPage} itemsQuantity={amountEvents}/>
        </div>
    );
};

export default EventListPage;
