"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Course,
  CourseFormState,
  createCourse,
  updateCourse,
} from "../actions/courses";
import { toast } from "sonner";

interface CourseDialogProps {
  course?: Course;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const initialState: CourseFormState = {
  errors: {},
  message: null,
};

export function CourseDialog({
  course,
  open,
  onOpenChange,
}: CourseDialogProps) {
  const isEditing = !!course;
  const [state, formAction] = useActionState(
    isEditing ? updateCourse : createCourse,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = isControlled ? onOpenChange! : setInternalOpen;
  useEffect(() => {
    if (state.message && !state.errors) {
      toast(`${state.message}`, {
        description: isEditing
          ? "Los datos del curso han sido actualizados"
          : "El nuevo curso ha sido creado",
      });

      formRef.current?.reset();
      handleOpenChange(false);
    }
  }, [state, isEditing, handleOpenChange]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Nuevo Curso</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Curso" : "Nuevo Curso"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los datos del curso en el formulario a continuación."
              : "Completa el formulario para crear un nuevo curso."}
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(() => {
              formAction(formData);
            });
          }}
          ref={formRef}
          className="space-y-4 py-2"
        >
          {isEditing && <Input type="hidden" name="id" value={course.id} />}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                name="code"
                placeholder="SAL001"
                defaultValue={course?.code || ""}
                aria-describedby="code-error"
              />
              {state.errors?.code && (
                <p id="code-error" className="text-sm text-destructive">
                  {state.errors.code[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Salsa Básica"
                defaultValue={course?.name || ""}
                aria-describedby="name-error"
              />
              {state.errors?.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descripción del curso..."
              defaultValue={course?.description || ""}
              rows={3}
              aria-describedby="description-error"
            />
            {state.errors?.description && (
              <p id="description-error" className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMin">Duración (minutos)</Label>
              <Input
                id="durationMin"
                name="durationMin"
                type="number"
                min="1"
                placeholder="60"
                defaultValue={course?.durationMin || ""}
                aria-describedby="durationMin-error"
              />
              {state.errors?.durationMin && (
                <p id="durationMin-error" className="text-sm text-destructive">
                  {state.errors.durationMin[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                placeholder="20"
                defaultValue={course?.capacity || ""}
                aria-describedby="capacity-error"
              />
              {state.errors?.capacity && (
                <p id="capacity-error" className="text-sm text-destructive">
                  {state.errors.capacity[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="disabled:opacity-50"
            >
              {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
