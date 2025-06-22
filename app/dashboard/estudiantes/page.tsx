import { getStudents } from "@/lib/actions";
import { StudentsTable } from "./components/students-table";
import { StudentDialog } from "./components/student-dialog";
import { SearchInput } from "./components/search-input";

export default async function EstudiantesPage(props: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;

  const search = searchParams.search ?? "";
  const page = Number(searchParams.page ?? "1");
  const pageSize = 10;

  const { data: students, metadata } = await getStudents(
    search,
    page,
    pageSize,
  );

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex gap-2 md:flex-row md:items-center justify-end">
        <SearchInput />
        <StudentDialog />
      </div>

      <div className="container mx-auto py-4">
        <StudentsTable students={students} metadata={metadata} />
      </div>
    </div>
  );
}
