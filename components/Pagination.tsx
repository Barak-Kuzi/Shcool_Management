"use client";

import {useRouter} from "next/navigation";

import {ITEMS_PER_PAGE} from "@/lib/settings";

type PaginationProps = {
    page: number;
    itemsQuantity: number;
}

const Pagination = ({page, itemsQuantity}: PaginationProps) => {

    const router = useRouter();
    const hasPrev = ITEMS_PER_PAGE * (page - 1) > 0;
    const hasNext = ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE < itemsQuantity;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page.toString());
        router.push(`${window.location.pathname}?${params}`);
    }

    return (
        <div className="p-4 flex items-center justify-between text-gray-500">
            <button
                disabled={!hasPrev}
                className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(page - 1)}
            >
                Prev
            </button>
            <div className="flex items-center gap-2 text-sm">
                {Array.from({length: Math.ceil(itemsQuantity / ITEMS_PER_PAGE)}, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <button
                            key={pageNumber}
                            className={`px-2 rounded-sm ${page === pageNumber ? "bg-blueSky" : ""}`}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>);
                })}
            </div>
            <button
                disabled={!hasNext}
                className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
