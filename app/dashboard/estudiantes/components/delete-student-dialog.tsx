"use client";

import { useState } from "react";
import type { Student } from "@/lib/data";
import { deleteStudent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteStudentDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteStudentDialog({
  student,
  open,
  onOpenChange,
}: DeleteStudentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteStudent(student.id);

      if (result.success) {
        toast.success("Estudiante eliminado", {
          description: `${student.firstName} ${student.lastName} ha sido eliminado correctamente.`,
        });
      } else {
        toast.error("Error al eliminar", {
          description: "No se pudo eliminar el estudiante.",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error inesperado", {
        description: "Ocurrió un error al eliminar el estudiante.",
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente a {student.firstName}{" "}
            {student.lastName} de la base de datos y no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
