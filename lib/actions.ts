"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { convertKeysToCamelCase } from "./snakeToCamel";

const StudentSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^\d+$/, "El teléfono debe contener solo números"),
  district: z.string().min(1, "El distrito es obligatorio"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
});

export type StudentFormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    phone?: string[];
    district?: string[];
    birthDate?: string[];
  };
  message?: string | null;
};

export async function createStudent(
  prevState: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  const supabase = await createClient();

  const validatedFields = StudentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    district: formData.get("district"),
    birthDate: formData.get("birthDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. No se pudo crear el estudiante.",
    };
  }

  const { firstName, lastName, phone, district, birthDate } =
    validatedFields.data;

  try {
    const { error } = await supabase.from("users").insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      district,
      birth_date: birthDate,
    });

    if (error) throw error;

    revalidatePath("/");
    return { message: "Estudiante creado correctamente" };
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    return { message: "Error al crear el estudiante" };
  }
}

export async function updateStudent(
  prevState: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  const supabase = await createClient();

  const validatedFields = StudentSchema.safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    district: formData.get("district"),
    birthDate: formData.get("birthDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. No se pudo actualizar el estudiante.",
    };
  }

  const { id, firstName, lastName, phone, district, birthDate } =
    validatedFields.data;

  try {
    const { error } = await supabase
      .from("users")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        district,
        birth_date: birthDate,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    return { message: "Estudiante actualizado correctamente" };
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error);
    return { message: "Error al actualizar el estudiante" };
  }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function getStudents(
  search: string,
  page: number,
  pageSize: number,
) {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .from("users")
    .select("*", { count: "exact" })
    .order("id", { ascending: false });

  if (search) {
    query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }
  query.range(from, to);
  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching students:", error.message);
    return {
      data: [],
      metadata: {
        totalStudents: 0,
        totalPages: 0,
        currentPage: page,
        pageSize,
      },
    };
  }

  const totalStudents = count || 0;
  const totalPages = Math.ceil(totalStudents / pageSize);

  const students = convertKeysToCamelCase(data);
  return {
    data: students,
    metadata: {
      totalStudents,
      totalPages,
      currentPage: page,
      pageSize,
    },
  };
}
