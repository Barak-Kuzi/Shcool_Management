import Image from "next/image";

import {Assignment, Class, Prisma, Subject, Teacher} from "@prisma/client";
import prisma from "@/lib/prisma";
import {ITEMS_PER_PAGE} from "@/lib/settings";
import {SearchParams} from "@/lib/types";
import {getUserDetails} from "@/lib/utils";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

type AssignmentList = Assignment & { lesson: { subject: Subject, class: Class, teacher: Teacher } };

const AssignmentListPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {

    const userDetails = await getUserDetails();

    const columns = [
        {
            header: "Subject Name",
            accessor: "name",
        },
        {
            header: "Class",
            accessor: "class",
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell",
        },
        {
            header: "Due Date",
            accessor: "dueDate",
            className: "hidden md:table-cell",
        },
        ...(userDetails.role === "admin" || userDetails.role === "teacher"
            ? [
                {
                    header: "Actions",
                    accessor: "action",
                },
            ]
            : []),
    ];

    const renderRow = (item: AssignmentList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
            <td>{item.lesson.class.name}</td>
            <td className="hidden md:table-cell">{`${item.lesson.teacher.name} ${item.lesson.teacher.surname}`}</td>
            <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
            <td>
                <div className="flex items-center gap-2">
                    {(userDetails.role === "admin" || userDetails.role === "teacher") && (
                        <>
                            <FormModal table="assignment" type="update" data={item}/>
                            <FormModal table="assignment" type="delete" id={item.id}/>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const params = await searchParams;
    const {page, ...queryParams} = params;

    const currentPage = page ? parseInt(page) : 1;
    const query: Prisma.AssignmentWhereInput = {};

    query.lesson = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = parseInt(value);
                        break;
                    case "teacherId":
                        query.lesson.teacherId = value;
                        break;
                    case "search":
                        query.lesson.subject = {
                            name: {contains: value, mode: "insensitive"},
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    switch (userDetails.role) {
        case "admin":
            break;
        case "teacher":
            query.lesson.teacherId = userDetails.userId!;
            break;
        case "student":
            query.lesson.class = {
                students: {
                    some: {
                        id: userDetails.userId!,
                    },
                },
            };
            break;
        case "parent":
            query.lesson.class = {
                students: {
                    some: {
                        parentId: userDetails.userId!,
                    },
                },
            };
            break;
        default:
            break;
    }

    const [amountAssignments, assignmentsData] = await prisma.$transaction([
        prisma.assignment.count({where: query}),
        prisma.assignment.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: {select: {name: true}},
                        teacher: {select: {name: true, surname: true}},
                        class: {select: {name: true}},
                    }
                }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (currentPage - 1),
        }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Assignments
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/filter.png" alt="filter button" width={14} height={14}/>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/sort.png" alt="sort" width={14} height={14}/>
                        </button>
                        {userDetails.role === "admin" || userDetails.role === "teacher" &&
                            <FormModal table="assignment" type="create"/>}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={assignmentsData}/>
            {/* PAGINATION */}
            <Pagination page={currentPage} itemsQuantity={amountAssignments}/>
        </div>
    );
};

export default AssignmentListPage;
