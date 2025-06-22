"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const distritos = [
  { value: "ancon", label: "Ancón" },
  { value: "ate", label: "Ate" },
  { value: "barranco", label: "Barranco" },
  { value: "brena", label: "Breña" },
  { value: "carabayllo", label: "Carabayllo" },
  { value: "lima", label: "Cercado de Lima" },
  { value: "chaclacayo", label: "Chaclacayo" },
  { value: "chorrillos", label: "Chorrillos" },
  { value: "cieneguilla", label: "Cieneguilla" },
  { value: "comas", label: "Comas" },
  { value: "el_agustino", label: "El Agustino" },
  { value: "independencia", label: "Independencia" },
  { value: "jesus_maria", label: "Jesús María" },
  { value: "la_molina", label: "La Molina" },
  { value: "la_victoria", label: "La Victoria" },
  { value: "lince", label: "Lince" },
  { value: "los_olivos", label: "Los Olivos" },
  { value: "lurigancho", label: "Lurigancho (Chosica)" },
  { value: "lurin", label: "Lurín" },
  { value: "magdalena", label: "Magdalena del Mar" },
  { value: "miraflores", label: "Miraflores" },
  { value: "pachacamac", label: "Pachacámac" },
  { value: "pucusana", label: "Pucusana" },
  { value: "pueblo_libre", label: "Pueblo Libre" },
  { value: "puente_piedra", label: "Puente Piedra" },
  { value: "punta_hermosa", label: "Punta Hermosa" },
  { value: "punta_negra", label: "Punta Negra" },
  { value: "rimac", label: "Rímac" },
  { value: "san_bartolo", label: "San Bartolo" },
  { value: "san_borja", label: "San Borja" },
  { value: "san_isidro", label: "San Isidro" },
  { value: "san_juan_lurigancho", label: "San Juan de Lurigancho" },
  { value: "san_juan_miraflores", label: "San Juan de Miraflores" },
  { value: "san_luis", label: "San Luis" },
  { value: "san_martin_porres", label: "San Martín de Porres" },
  { value: "san_miguel", label: "San Miguel" },
  { value: "santa_anita", label: "Santa Anita" },
  { value: "santa_maria", label: "Santa María del Mar" },
  { value: "santa_rosa", label: "Santa Rosa" },
  { value: "surco", label: "Santiago de Surco" },
  { value: "surquillo", label: "Surquillo" },
  { value: "villa_el_salvador", label: "Villa El Salvador" },
  { value: "villa_maria", label: "Villa María del Triunfo" },
];

interface DistritoSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export function DistritoSelect({
  value = "",
  onChange,
  name = "district",
}: DistritoSelectProps) {
  const [selected, setSelected] = useState(value);

  // Sincronizar valor inicial externo si cambia
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Notificar al padre cuando cambie
  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <>
      <input type="hidden" name={name} value={selected} />
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona un distrito" />
        </SelectTrigger>
        <SelectContent>
          {distritos.map((distrito) => (
            <SelectItem key={distrito.value} value={distrito.value}>
              {distrito.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
