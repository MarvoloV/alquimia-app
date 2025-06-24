"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Session } from "../actions/sessions";
import { SessionDialog } from "./session-dialog";
import { DeleteSessionDialog } from "./delete-session-dialog";
import { Course } from "../../cursos/actions/courses";
import { Student } from "@/lib/data";

interface SessionsTableContentProps {
  sessions: Session[];
  courses: Course[];
  instructors: Student[];
}

export function SessionsTableContent({
  sessions,
  courses,
  instructors,
}: SessionsTableContentProps) {
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const getCourse = (courseId: string) =>
    courses.find((course) => course.id.toString() === courseId.toString());
  const getInstructor = (instructorId: string) =>
    instructors.find(
      (instructor) => instructor.id.toString() === instructorId.toString(),
    );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead className="hidden md:table-cell">Curso</TableHead>
            <TableHead className="hidden lg:table-cell">Instructor</TableHead>
            <TableHead className="hidden md:table-cell">Sala</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron sesiones
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((session) => {
              const course = getCourse(session.courseId);
              const instructor = getInstructor(session.instructorId);

              return (
                <TableRow key={session.id}>
                  <TableCell>
                    {format(new Date(session.sessionDate), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {session.startTime} - {session.endTime}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <div className="font-medium">{course?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {course?.code}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {instructor
                      ? `${instructor.firstName} ${instructor.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {session.room}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSessionToEdit(session)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSessionToDelete(session)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {sessionToEdit && (
        <SessionDialog
          courses={courses}
          instructors={instructors}
          session={sessionToEdit}
          open={!!sessionToEdit}
          onOpenChange={() => setSessionToEdit(null)}
        />
      )}

      {sessionToDelete && (
        <DeleteSessionDialog
          courses={courses}
          instructors={instructors}
          session={sessionToDelete}
          open={!!sessionToDelete}
          onOpenChange={() => setSessionToDelete(null)}
        />
      )}
    </>
  );
}
