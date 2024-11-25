import Image from "next/image";

import prisma from "@/lib/prisma";
import {Prisma, Subject, Teacher} from "@prisma/client";
import {ITEMS_PER_PAGE} from "@/lib/settings";
import {SearchParams} from "@/lib/types";
import {getUserDetails} from "@/lib/utils";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormContainer from "@/components/FormContainer";

type SubjectList = Subject & { teachers: Teacher[] };

const SubjectListPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {

    const {role} = await getUserDetails();

    const columns = [
        {
            header: "Subject Name",
            accessor: "name",
        },
        {
            header: "Teachers",
            accessor: "teachers",
            className: "hidden md:table-cell",
        },
        {
            header: "Actions",
            accessor: "action",
        },
    ];

    const renderRow = (item: SubjectList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.name}</td>
            <td className="hidden md:table-cell">{item.teachers.map(teacher => teacher.name).join(",")}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormContainer table="subject" type="update" data={item}/>
                            <FormContainer table="subject" type="delete" id={item.id}/>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const params = await searchParams;
    const {page, ...queryParams} = params;

    const currentPage = page ? parseInt(page) : 1;
    const query: Prisma.SubjectWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.name = {contains: value, mode: "insensitive"};
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [amountSubjects, subjectsData] = await prisma.$transaction([
        prisma.subject.count({where: query}),
        prisma.subject.findMany({
            where: query,
            include: {
                teachers: true,
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (currentPage - 1),
        }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/filter.png" alt="" width={14} height={14}/>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/sort.png" alt="" width={14} height={14}/>
                        </button>
                        {role === "admin" && <FormContainer table="subject" type="create"/>}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={subjectsData}/>
            {/* PAGINATION */}
            <Pagination page={currentPage} itemsQuantity={amountSubjects}/>
        </div>
    );
};

export default SubjectListPage;
