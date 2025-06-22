"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import type { Student } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentDialog } from "./student-dialog";
import { DeleteStudentDialog } from "./delete-student-dialog";

interface StudentsTableContentProps {
  students: Student[];
}

export function StudentsTableContent({ students }: StudentsTableContentProps) {
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead className="hidden md:table-cell">Teléfono</TableHead>
            <TableHead className="hidden md:table-cell">Distrito</TableHead>
            <TableHead className="hidden lg:table-cell">
              Fecha de nacimiento
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron estudiantes
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {student.phone}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {student.district}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(student.birthDate), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStudentToEdit(student)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStudentToDelete(student)}
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

      {studentToEdit && (
        <StudentDialog
          student={studentToEdit}
          open={!!studentToEdit}
          onOpenChange={(open) => {
            if (!open) setStudentToEdit(null);
          }}
        />
      )}

      {studentToDelete && (
        <DeleteStudentDialog
          student={studentToDelete}
          open={!!studentToDelete}
          onOpenChange={(open) => {
            if (!open) setStudentToDelete(null); // ✅ correcto
          }}
        />
      )}
    </>
  );
}
