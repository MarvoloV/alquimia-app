import { SearchInput } from "../../estudiantes/components/search-input";
import { CourseDialog } from "./course-dialog";

export function CoursesHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
        <p className="text-muted-foreground">
          Gestiona los cursos de la academia de baile
        </p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <SearchInput />
        <CourseDialog />
      </div>
    </div>
  );
}
