import { getAllStudents } from "@/lib/actions";
import { getAllCourses } from "../../cursos/actions/courses";
import { getSessions } from "../actions/sessions";
import { SessionsTableContent } from "./sessions-table-content";
import { SessionsTablePagination } from "./sessions-table-pagination";

interface SessionsTableProps {
  searchParams?: {
    page?: string;
  };
}

export async function SessionsTable({ searchParams }: SessionsTableProps = {}) {
  const page = Number(searchParams?.page || 1);
  const pageSize = 10;

  const { data: sessions, metadata } = await getSessions(page, pageSize);
  const courses = await getAllCourses();
  const instructors = await getAllStudents();
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <SessionsTableContent
          sessions={sessions}
          courses={courses}
          instructors={instructors}
        />
      </div>
      <SessionsTablePagination metadata={metadata} />
    </div>
  );
}
