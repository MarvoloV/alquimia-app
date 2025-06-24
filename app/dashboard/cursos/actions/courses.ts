"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { convertKeysToCamelCase } from "@/lib/snakeToCamel";

export interface Course {
  id: number;
  code: string;
  name: string;
  description: string | null;
  durationMin: number;
  capacity: number;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const CourseSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  durationMin: z.coerce.number().min(1, "La duración debe ser mayor a 0"),
  capacity: z.coerce.number().min(1, "La capacidad debe ser mayor a 0"),
});

export type CourseFormState = {
  errors?: {
    code?: string[];
    name?: string[];
    description?: string[];
    durationMin?: string[];
    capacity?: string[];
  };
  message?: string | null;
};

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const validatedFields = CourseSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    description: formData.get("description"),
    durationMin: formData.get("durationMin"),
    capacity: formData.get("capacity"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. No se pudo crear el curso.",
    };
  }

  const { code, name, description, durationMin, capacity } =
    validatedFields.data;
  const supabase = await createClient();

  // Verifica si ya existe un curso con ese código
  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (existing) {
    return {
      errors: { code: ["El código ya existe"] },
      message: "El código del curso ya está en uso.",
    };
  }

  const { error } = await supabase.from("courses").insert({
    code,
    name,
    description,
    duration_min: durationMin,
    capacity,
  });

  if (error) {
    return { message: "Error al crear el curso." };
  }

  revalidatePath("/courses");
  return { message: "Curso creado correctamente" };
}

export async function updateCourse(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const validatedFields = CourseSchema.safeParse({
    id: formData.get("id"),
    code: formData.get("code"),
    name: formData.get("name"),
    description: formData.get("description"),
    durationMin: formData.get("durationMin"),
    capacity: formData.get("capacity"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. No se pudo actualizar el curso.",
    };
  }

  const { id, code, name, description, durationMin, capacity } =
    validatedFields.data;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("code", code)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return {
      errors: { code: ["El código ya existe"] },
      message: "El código del curso ya está en uso.",
    };
  }

  const { error } = await supabase
    .from("courses")
    .update({
      code,
      name,
      description,
      duration_min: durationMin,
      capacity,
    })
    .eq("id", id);

  if (error) {
    return { message: "Error al actualizar el curso." };
  }

  revalidatePath("/courses");
  return { message: "Curso actualizado correctamente" };
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    return { success: false };
  }

  revalidatePath("/courses");
  return { success: true };
}

export async function getCourses(
  search: string,
  page: number,
  pageSize: number,
): Promise<{ data: Course[]; metadata: PaginationMeta }> {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Construye la query base
  const query = supabase
    .from("courses")
    .select("*", { count: "exact" })
    .order("id", { ascending: false });

  // Filtro de búsqueda: code o name
  if (search) {
    query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
  }

  query.range(from, to);

  // Ejecuta
  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching courses:", error.message);
    return {
      data: [],
      metadata: {
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        pageSize,
      },
    };
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const courses = convertKeysToCamelCase(data);

  return {
    data: courses,
    metadata: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    },
  };
}

export async function getAllCourses(): Promise<Course[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return [];
  }

  return convertKeysToCamelCase(data);
}
