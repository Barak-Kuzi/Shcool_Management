import Image from "next/image";

import prisma from "@/lib/prisma";
import {Parent, Prisma, Student} from "@prisma/client";
import {ITEMS_PER_PAGE} from "@/lib/settings";
import {SearchParams} from "@/lib/types";
import {getUserDetails} from "@/lib/utils";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";

type ParentList = Parent & { students: Student[] };

const ParentListPage = async ({searchParams}: { searchParams: Promise<SearchParams> }) => {

    const {role} = await getUserDetails();

    const columns = [
        {
            header: "Info",
            accessor: "info",
        },
        {
            header: "Student Names",
            accessor: "students",
            className: "hidden md:table-cell",
        },
        {
            header: "Phone",
            accessor: "phone",
            className: "hidden lg:table-cell",
        },
        {
            header: "Address",
            accessor: "address",
            className: "hidden lg:table-cell",
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

    const renderRow = (item: ParentList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.students.map(student => student.name).join(",")}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormModal table="parent" type="update" data={item}/>
                            <FormModal table="parent" type="delete" id={item.id}/>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const params = await searchParams;
    const {page, ...queryParams} = params;

    const currentPage = page ? parseInt(page) : 1;
    const query: Prisma.ParentWhereInput = {};

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

    const [amountParents, parentsData] = await prisma.$transaction([
        prisma.parent.count({where: query}),
        prisma.parent.findMany({
            where: query,
            include: {
                students: true,
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (currentPage - 1),
        }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/filter.png" alt="" width={14} height={14}/>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
                            <Image src="/sort.png" alt="" width={14} height={14}/>
                        </button>
                        {role === "admin" && (<FormModal table="parent" type="create"/>)}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={parentsData}/>
            {/* PAGINATION */}
            <Pagination page={currentPage} itemsQuantity={amountParents}/>
        </div>
    );
};

export default ParentListPage;
