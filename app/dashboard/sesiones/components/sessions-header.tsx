import { Student } from "@/lib/data";
import { Course } from "../../cursos/actions/courses";
import { SessionDialog } from "./session-dialog";

interface SessionsHeaderProps {
  courses: Course[];
  intructors: Student[];
}

export function SessionsHeader({ courses, intructors }: SessionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sesiones</h1>
        <p className="text-muted-foreground">
          Gestiona las sesiones de clases de la academia
        </p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <SessionDialog courses={courses} instructors={intructors} />
      </div>
    </div>
  );
}
