"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Course } from "../../cursos/actions/courses";

interface SessionsFiltersProps {
  courses: Course[];
}

export function SessionsFilters({ courses }: SessionsFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom")!)
      : undefined,
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo")!)
      : undefined,
  );

  const handleCourseChange = (courseId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (courseId && courseId !== "all") {
      params.set("courseId", courseId);
    } else {
      params.delete("courseId");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (date) {
      params.set("dateFrom", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("dateFrom");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (date) {
      params.set("dateTo", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("dateTo");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    replace(pathname);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center">
      <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-center">
        <div className="space-y-2 flex flex-col gap-1">
          <label className="text-sm font-medium">Curso</label>
          <Select
            defaultValue={searchParams.get("courseId") || "all"}
            onValueChange={handleCourseChange}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Todos los cursos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex flex-col gap-1">
          <label className="text-sm font-medium">Fecha desde</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-48 justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom
                  ? format(dateFrom, "dd/MM/yyyy", { locale: es })
                  : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col gap-1">
          <label className="text-sm font-medium">Fecha hasta</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-48 justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo
                  ? format(dateTo, "dd/MM/yyyy", { locale: es })
                  : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters}>
        Limpiar filtros
      </Button>
    </div>
  );
}
