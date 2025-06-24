import { SearchInput } from "../estudiantes/components/search-input";
import { CourseDialog } from "./components/course-dialog";
import { CoursesTable } from "./components/courses-table";

export default async function CursosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const search = (await searchParams).search as string;
  const page = (await searchParams).page as string;
  const params = {
    search,
    page,
  };

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex gap-2 md:flex-row md:items-center justify-end">
        <SearchInput />
        <CourseDialog />
      </div>

      <div className="container mx-auto py-4">
        <CoursesTable searchParams={params} />
      </div>
    </div>
  );
}
