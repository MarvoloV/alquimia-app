"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "../actions/sessions";

interface SessionsTablePaginationProps {
  metadata: PaginationMeta;
}

export function SessionsTablePagination({
  metadata,
}: SessionsTablePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const { totalPages, currentPage } = metadata;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePagination = (page: number) => {
    replace(createPageURL(page));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Página siguiente</span>
        </Button>
      </div>
    </div>
  );
}
