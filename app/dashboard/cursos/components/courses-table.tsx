import { getCourses } from "../actions/courses";
import { CoursesTableContent } from "./courses-table-content";
import { CoursesTablePagination } from "./courses-table-pagination";

interface CoursesTableProps {
  searchParams?: {
    search?: string;
    page?: string;
  };
}

export async function CoursesTable({ searchParams }: CoursesTableProps = {}) {
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = 10;

  const { data: courses, metadata } = await getCourses(search, page, pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <CoursesTableContent courses={courses} />
      </div>
      <CoursesTablePagination metadata={metadata} />
    </div>
  );
}
