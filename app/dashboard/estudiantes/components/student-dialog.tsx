"use client";

import {
  useRef,
  useState,
  useEffect,
  useActionState,
  useTransition,
} from "react";
import { PlusCircle } from "lucide-react";
import type { Student } from "@/lib/data";
import {
  createStudent,
  updateStudent,
  type StudentFormState,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DistritoSelect } from "./distrito-select";

interface StudentDialogProps {
  student?: Student;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const initialState: StudentFormState = {
  errors: {},
  message: null,
};

export function StudentDialog({
  student,
  open,
  onOpenChange,
}: StudentDialogProps) {
  const isEditing = !!student;
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = isControlled ? onOpenChange! : setInternalOpen;

  const [state, formAction] = useActionState(
    isEditing ? updateStudent : createStudent,
    initialState,
  );

  useEffect(() => {
    const noErrors = !state.errors || Object.keys(state.errors).length === 0;

    if (state.message && noErrors) {
      toast(state.message, {
        description: isEditing
          ? "Los datos del estudiante han sido actualizados."
          : "Nuevo estudiante creado correctamente.",
      });

      formRef.current?.reset();
      handleOpenChange(false);
    }
  }, [state, isEditing, handleOpenChange]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Estudiante</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <form
          action={(formData) => {
            startTransition(() => {
              formAction(formData);
            });
          }}
          ref={formRef}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Estudiante" : "Nuevo Estudiante"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza los datos del estudiante en el formulario a continuación."
                : "Completa el formulario para registrar un nuevo estudiante."}
            </DialogDescription>
          </DialogHeader>

          {isEditing && <Input type="hidden" name="id" value={student.id} />}

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={student?.firstName || ""}
              aria-describedby="firstName-error"
            />
            {state.errors?.firstName && (
              <p id="firstName-error" className="text-sm text-destructive">
                {state.errors.firstName[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={student?.lastName || ""}
              aria-describedby="lastName-error"
            />
            {state.errors?.lastName && (
              <p id="lastName-error" className="text-sm text-destructive">
                {state.errors.lastName[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={student?.phone || ""}
              aria-describedby="phone-error"
            />
            {state.errors?.phone && (
              <p id="phone-error" className="text-sm text-destructive">
                {state.errors.phone[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Distrito</Label>
            <DistritoSelect value={student?.district || ""} />
            {state.errors?.district && (
              <p className="text-sm text-destructive">
                {state.errors.district[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={student?.birthDate || ""}
              aria-describedby="birthDate-error"
            />
            {state.errors?.birthDate && (
              <p id="birthDate-error" className="text-sm text-destructive">
                {state.errors.birthDate[0]}
              </p>
            )}
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
