import { getAllStudents } from "@/lib/actions";
import { getAllCourses } from "../cursos/actions/courses";
import { SessionsFilters } from "./components/sessions-filters";
import { SessionsHeader } from "./components/sessions-header";
import { SessionsTable } from "./components/sessions-table";

export default async function SesionesPage(props: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;

  const page = searchParams.page;
  const params = {
    page,
  };

  const courses = await getAllCourses();
  const instructors = await getAllStudents();
  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <SessionsHeader courses={courses} intructors={instructors} />

      <SessionsFilters courses={courses} />

      <div className="container mx-auto py-4">
        <SessionsTable searchParams={params} />
      </div>
    </div>
  );
}
