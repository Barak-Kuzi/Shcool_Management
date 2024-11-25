import Image from "next/image";

import {Class, Teacher, Prisma} from "@prisma/client";
import {getUserDetails} from "@/lib/utils";


import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import {ITEMS_PER_PAGE} from "@/lib/settings";

type ClassList = Class & { supervisor: Teacher };

type SearchParams = { [key: string]: string | undefined; };

const ClassListPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {

    const {role} = await getUserDetails();

    const columns = [
        {
            header: "Class Name",
            accessor: "name",
        },
        {
            header: "Capacity",
            accessor: "capacity",
            className: "hidden md:table-cell",
        },
        {
            header: "Grade",
            accessor: "grade",
            className: "hidden md:table-cell",
        },
        {
            header: "Supervisor",
            accessor: "supervisor",
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

    const renderRow = (item: ClassList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.name}</td>
            <td className="hidden md:table-cell">{item.capacity}</td>
            <td className="hidden md:table-cell">{item.name[0]}</td>
            <td className="hidden md:table-cell">{`${item.supervisor.name} ${item.supervisor.surname}`}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormContainer table="class" type="update" data={item}/>
                            <FormContainer table="class" type="delete" id={item.id}/>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const params = await searchParams;
    const {page, ...queryParams} = params;

    const currentPage = page ? parseInt(page) : 1;
    const query: Prisma.ClassWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "supervisorId":
                        query.supervisorId = value;
                        break;
                    case "search":
                        query.name = {contains: value, mode: "insensitive"};
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [amountClasses, classesData] = await prisma.$transaction([
        prisma.class.count({where: query}),
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (currentPage - 1),
        }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/filter.png" alt="" width={14} height={14}/>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/sort.png" alt="" width={14} height={14}/>
                        </button>
                        {role === "admin" && <FormContainer table="class" type="create"/>}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={classesData}/>
            {/* PAGINATION */}
            <Pagination page={currentPage} itemsQuantity={amountClasses}/>
        </div>
    );
};

export default ClassListPage;
