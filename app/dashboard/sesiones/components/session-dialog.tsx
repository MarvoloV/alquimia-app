"use client";

import { useActionState, useEffect, useState } from "react";
import { PlusCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  createSession,
  Session,
  SessionFormState,
  updateSession,
} from "../actions/sessions";
import { Course } from "../../cursos/actions/courses";
import { Student } from "@/lib/data";

interface SessionDialogProps {
  courses: Course[];
  instructors: Student[];
  session?: Session;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const initialState: SessionFormState = {
  errors: {},
  message: null,
};

export function SessionDialog({
  courses,
  instructors,
  session,
  open,
  onOpenChange,
}: SessionDialogProps) {
  const isEditing = !!session;
  const [state, formAction] = useActionState(
    isEditing ? updateSession : createSession,
    initialState,
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    session ? new Date(session.sessionDate) : undefined,
  );

  useEffect(() => {
    if (state.message && !state.errors) {
      toast(`${state.message}`, {
        description: isEditing
          ? "Los datos de la sesión han sido actualizados"
          : "La nueva sesión ha sido creada",
      });

      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  }, [state, isEditing, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Agregar Sesión</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Sesión" : "Nueva Sesión"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los datos de la sesión en el formulario a continuación."
              : "Completa el formulario para crear una nueva sesión."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 py-2">
          {isEditing && <Input type="hidden" name="id" value={session.id} />}

          <div className="space-y-2">
            <Label htmlFor="courseId">Curso</Label>
            <Select
              name="courseId"
              defaultValue={session?.courseId?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.courseId && (
              <p className="text-sm text-destructive">
                {state.errors.courseId[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructorId">Instructor</Label>
            <Select
              name="instructorId"
              defaultValue={session?.instructorId?.toString() || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem
                    key={instructor.id}
                    value={instructor.id.toString()}
                  >
                    {instructor.firstName} {instructor.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.instructorId && (
              <p className="text-sm text-destructive">
                {state.errors.instructorId[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Fecha de la sesión</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "dd/MM/yyyy", { locale: es })
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="hidden"
              name="sessionDate"
              value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
            />
            {state.errors?.sessionDate && (
              <p className="text-sm text-destructive">
                {state.errors.sessionDate[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de inicio</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                defaultValue={session?.startTime || ""}
                aria-describedby="startTime-error"
              />
              {state.errors?.startTime && (
                <p id="startTime-error" className="text-sm text-destructive">
                  {state.errors.startTime[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de fin</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                defaultValue={session?.endTime || ""}
                aria-describedby="endTime-error"
              />
              {state.errors?.endTime && (
                <p id="endTime-error" className="text-sm text-destructive">
                  {state.errors.endTime[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Input
              id="room"
              name="room"
              placeholder="Sala A"
              defaultValue={session?.room || ""}
              aria-describedby="room-error"
            />
            {state.errors?.room && (
              <p id="room-error" className="text-sm text-destructive">
                {state.errors.room[0]}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
