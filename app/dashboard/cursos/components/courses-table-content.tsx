"use client";

import { useState } from "react";
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
import { Course } from "../actions/courses";
import { CourseDialog } from "./course-dialog";
import { DeleteCourseDialog } from "./delete-course-dialog";

interface CoursesTableContentProps {
  courses: Course[];
}

export function CoursesTableContent({ courses }: CoursesTableContentProps) {
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden md:table-cell">
              Duración (min)
            </TableHead>
            <TableHead className="hidden md:table-cell">Capacidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No se encontraron cursos
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-mono text-sm">
                  {course.code}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{course.name}</div>
                    {course.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {course.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.durationMin} min
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.capacity} personas
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCourseToEdit(course)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCourseToDelete(course)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {courseToEdit && (
        <CourseDialog
          course={courseToEdit}
          open={!!courseToEdit}
          onOpenChange={() => setCourseToEdit(null)}
        />
      )}

      {courseToDelete && (
        <DeleteCourseDialog
          course={courseToDelete}
          open={!!courseToDelete}
          onOpenChange={() => setCourseToDelete(null)}
        />
      )}
    </>
  );
}
