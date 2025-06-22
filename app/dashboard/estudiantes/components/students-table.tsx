"use client";

import { StudentsTableContent } from "./students-table-content";
import { StudentsTablePagination } from "./students-table-pagination";
import type { Student } from "@/lib/data";

interface StudentsTableProps {
  students: Student[];
  metadata: {
    totalStudents: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export function StudentsTable({ students, metadata }: StudentsTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <StudentsTableContent students={students} />
      </div>
      <StudentsTablePagination metadata={metadata} />
    </div>
  );
}
