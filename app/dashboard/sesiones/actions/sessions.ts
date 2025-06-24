"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { convertKeysToCamelCase } from "@/lib/snakeToCamel";

export interface Session {
  id: string;
  courseId: string;
  instructorId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Zod schema para validar create/update
const SessionSchema = z
  .object({
    id: z.string().optional(),
    courseId: z.string().min(1, "El curso es obligatorio"),
    instructorId: z.string().min(1, "El instructor es obligatorio"),
    sessionDate: z.string().min(1, "La fecha es obligatoria"),
    startTime: z.string().min(1, "La hora de inicio es obligatoria"),
    endTime: z.string().min(1, "La hora de fin es obligatoria"),
    room: z.string().optional(),
  })
  .refine((d) => (d.startTime && d.endTime ? d.endTime > d.startTime : true), {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["endTime"],
  });

export type SessionFormState = {
  errors?: {
    courseId?: string[];
    instructorId?: string[];
    sessionDate?: string[];
    startTime?: string[];
    endTime?: string[];
    room?: string[];
  };
  message?: string | null;
};

/** CREA una nueva sesión */
export async function createSession(
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const parsed = SessionSchema.safeParse({
    courseId: formData.get("courseId"),
    instructorId: formData.get("instructorId"),
    sessionDate: formData.get("sessionDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    room: formData.get("room"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Campos inválidos. No se pudo crear la sesión.",
    };
  }

  const { courseId, instructorId, sessionDate, startTime, endTime, room } =
    parsed.data;
  const supabase = await createClient();

  // Chequeo de conflictos
  const { data: conflicts, error: confErr } = await supabase
    .from("sessions")
    .select("id")
    .eq("instructor_id", instructorId)
    .eq("session_date", sessionDate)
    .or(
      `and(start_time.gte.${startTime},start_time.lt.${endTime}),` +
        `and(end_time.gt.${startTime},end_time.lte.${endTime}),` +
        `and(start_time.lte.${startTime},end_time.gte.${endTime})`,
    );

  if (confErr) {
    console.error(confErr);
    return { message: "Error al verificar conflictos de horario." };
  }
  if (conflicts && conflicts.length > 0) {
    return {
      errors: { startTime: ["El instructor ya tiene sesión en ese horario"] },
      message: "Conflicto de horario detectado.",
    };
  }

  // Inserción
  const { error: insertErr } = await supabase.from("sessions").insert({
    course_id: courseId,
    instructor_id: instructorId,
    session_date: sessionDate,
    start_time: startTime,
    end_time: endTime,
    room,
  });

  if (insertErr) {
    console.error(insertErr);
    return { message: "Error al crear la sesión." };
  }

  revalidatePath("/sessions");
  return { message: "Sesión creada correctamente." };
}

/** ACTUALIZA una sesión existente */
export async function updateSession(
  _prevState: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const parsed = SessionSchema.safeParse({
    id: formData.get("id"),
    courseId: formData.get("courseId"),
    instructorId: formData.get("instructorId"),
    sessionDate: formData.get("sessionDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    room: formData.get("room"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Campos inválidos. No se pudo actualizar la sesión.",
    };
  }

  const { id, courseId, instructorId, sessionDate, startTime, endTime, room } =
    parsed.data;
  const supabase = await createClient();

  // Chequeo conflicto excluyendo la misma
  const { data: conflicts, error: confErr } = await supabase
    .from("sessions")
    .select("id")
    .neq("id", id)
    .eq("instructor_id", instructorId)
    .eq("session_date", sessionDate)
    .or(
      `and(start_time.gte.${startTime},start_time.lt.${endTime}),` +
        `and(end_time.gt.${startTime},end_time.lte.${endTime}),` +
        `and(start_time.lte.${startTime},end_time.gte.${endTime})`,
    );

  if (confErr) {
    console.error(confErr);
    return { message: "Error al verificar conflictos de horario." };
  }
  if (conflicts && conflicts.length > 0) {
    return {
      errors: { startTime: ["El instructor ya tiene sesión en ese horario"] },
      message: "Conflicto de horario detectado.",
    };
  }

  // Update
  const { error: updateErr } = await supabase
    .from("sessions")
    .update({
      course_id: courseId,
      instructor_id: instructorId,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      room,
    })
    .eq("id", id);

  if (updateErr) {
    console.error(updateErr);
    return { message: "Error al actualizar la sesión." };
  }

  revalidatePath("/sessions");
  return { message: "Sesión actualizada correctamente." };
}

/** ELIMINA una sesión */
export async function deleteSession(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sessions").delete().eq("id", id);

  if (error) {
    console.error(error);
    return { success: false };
  }

  revalidatePath("/sessions");
  return { success: true };
}

/** LISTA sesiones con filtros y paginación */
export async function getSessions(
  page: number,
  pageSize: number,
  courseId?: string | null,
  dateFrom?: string | null,
  dateTo?: string | null,
): Promise<{ data: Session[]; metadata: PaginationMeta }> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("sessions")
    .select("*", { count: "exact" })
    .order("session_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (courseId) {
    query = query.eq("course_id", courseId);
  }
  if (dateFrom) {
    query = query.gte("session_date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("session_date", dateTo);
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching sessions:", error.message);
    return {
      data: [],
      metadata: { totalItems: 0, totalPages: 0, currentPage: page, pageSize },
    };
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const sessions = convertKeysToCamelCase(data);

  return {
    data: sessions,
    metadata: { totalItems, totalPages, currentPage: page, pageSize },
  };
}
