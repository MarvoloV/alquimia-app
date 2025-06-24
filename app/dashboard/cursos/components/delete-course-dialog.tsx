"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Course, deleteCourse } from "../actions/courses";
import { toast } from "sonner";

interface DeleteCourseDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCourseDialog({
  course,
  open,
  onOpenChange,
}: DeleteCourseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteCourse(course.id.toString());

      if (result.success) {
        toast("Curso eliminado", {
          description: `El curso ${course.name} ha sido eliminado correctamente.`,
        });
      } else {
        toast.error("Error", {
          description: "No se pudo eliminar el curso.",
        });
      }
    } catch (_error) {
      toast.error("Error", {
        description: "Ocurrió un error al eliminar el curso.",
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
            Esta acción eliminará permanentemente el curso &quot;{course.name}
            &quot; ({course.code}) de la base de datos y no se puede deshacer.
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
