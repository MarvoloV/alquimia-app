"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { deleteSession, Session } from "../actions/sessions";
import { Student } from "@/lib/data";
import { Course } from "../../cursos/actions/courses";
import { toast } from "sonner";

interface DeleteSessionDialogProps {
  courses: Course[];
  instructors: Student[];
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSessionDialog({
  courses,
  instructors,
  session,
  open,
  onOpenChange,
}: DeleteSessionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const course = courses.find(
    (c) => c.id.toString() === session.courseId.toString(),
  );
  const instructor = instructors.find(
    (i) => i.id.toString() === session.instructorId.toString(),
  );

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteSession(session.id);

      if (result.success) {
        toast("Sesión eliminada", {
          description: `La sesión del ${format(new Date(session.sessionDate), "dd/MM/yyyy", { locale: es })} ha sido eliminada correctamente.`,
        });
      } else {
        toast.error("Error", {
          description: "No se pudo eliminar la sesión.",
        });
      }
    } catch (_error) {
      toast.error("Error", {
        description: "Ocurrió un error al eliminar la sesión.",
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
            Esta acción eliminará permanentemente la sesión de &quot;
            {course?.name}&quot; con{" "}
            {instructor
              ? `${instructor.firstName} ${instructor.lastName}`
              : "instructor desconocido"}{" "}
            el{" "}
            {format(new Date(session.sessionDate), "dd/MM/yyyy", {
              locale: es,
            })}{" "}
            de {session.startTime} a {session.endTime}.
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
