import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "@/lib/getPageNumbers";

export function HousesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  return (
    <Pagination className="w-full flex justify-center mt-4 rounded-md">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((number, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              className=" cursor-pointer"
              isActive={number !== "..." && currentPage === Number(number)}
              onClick={
                number !== "..."
                  ? () => onPageChange(Number(number))
                  : undefined
              }
            >
              {number !== "..." ? Number(number) : "..."}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() =>
              currentPage === totalPages || onPageChange(currentPage + 1)
            }
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
