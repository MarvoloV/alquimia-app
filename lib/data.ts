export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  district: string;
  birthDate: string;
  createdAt: string;
}

// Datos de ejemplo para la aplicación
export const students: Student[] = [
  {
    id: "1",
    firstName: "María",
    lastName: "González",
    phone: "912345678",
    district: "Miraflores",
    birthDate: "1995-05-15",
    createdAt: "2023-01-10T12:00:00Z",
  },
  {
    id: "2",
    firstName: "Carlos",
    lastName: "Rodríguez",
    phone: "923456789",
    district: "San Isidro",
    birthDate: "1998-08-22",
    createdAt: "2023-01-15T14:30:00Z",
  },
  {
    id: "3",
    firstName: "Ana",
    lastName: "Martínez",
    phone: "934567890",
    district: "Barranco",
    birthDate: "2000-03-10",
    createdAt: "2023-02-01T09:15:00Z",
  },
  {
    id: "4",
    firstName: "Luis",
    lastName: "Sánchez",
    phone: "945678901",
    district: "Surco",
    birthDate: "1997-11-05",
    createdAt: "2023-02-10T16:45:00Z",
  },
  {
    id: "5",
    firstName: "Laura",
    lastName: "Díaz",
    phone: "956789012",
    district: "San Borja",
    birthDate: "1999-07-20",
    createdAt: "2023-02-15T11:20:00Z",
  },
  {
    id: "6",
    firstName: "Javier",
    lastName: "López",
    phone: "967890123",
    district: "Jesús María",
    birthDate: "1996-04-12",
    createdAt: "2023-03-01T13:10:00Z",
  },
  {
    id: "7",
    firstName: "Sofía",
    lastName: "Torres",
    phone: "978901234",
    district: "Magdalena",
    birthDate: "2001-09-30",
    createdAt: "2023-03-10T10:05:00Z",
  },
  {
    id: "8",
    firstName: "Miguel",
    lastName: "Ramírez",
    phone: "989012345",
    district: "Pueblo Libre",
    birthDate: "1994-12-18",
    createdAt: "2023-03-15T15:30:00Z",
  },
  {
    id: "9",
    firstName: "Valentina",
    lastName: "Herrera",
    phone: "990123456",
    district: "San Miguel",
    birthDate: "2002-02-14",
    createdAt: "2023-04-01T09:45:00Z",
  },
  {
    id: "10",
    firstName: "Daniel",
    lastName: "Castro",
    phone: "901234567",
    district: "La Molina",
    birthDate: "1993-06-25",
    createdAt: "2023-04-10T14:15:00Z",
  },
  {
    id: "11",
    firstName: "Camila",
    lastName: "Flores",
    phone: "912345670",
    district: "Lince",
    birthDate: "2000-10-08",
    createdAt: "2023-04-15T11:50:00Z",
  },
  {
    id: "12",
    firstName: "Alejandro",
    lastName: "Ortiz",
    phone: "923456781",
    district: "Chorrillos",
    birthDate: "1997-01-17",
    createdAt: "2023-05-01T16:20:00Z",
  },
  {
    id: "13",
    firstName: "Isabella",
    lastName: "Vargas",
    phone: "934567892",
    district: "Miraflores",
    birthDate: "1999-03-22",
    createdAt: "2023-05-10T10:30:00Z",
  },
  {
    id: "14",
    firstName: "Mateo",
    lastName: "Rojas",
    phone: "945678903",
    district: "San Isidro",
    birthDate: "1995-08-11",
    createdAt: "2023-05-15T13:40:00Z",
  },
  {
    id: "15",
    firstName: "Lucía",
    lastName: "Morales",
    phone: "956789014",
    district: "Barranco",
    birthDate: "2001-05-29",
    createdAt: "2023-06-01T09:10:00Z",
  },
];

export async function getStudents(search = "", page = 1, pageSize = 10) {
  // Simular una llamada a la API con un retraso
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filtrar estudiantes por nombre o apellido
  const filteredStudents = students.filter((student) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower)
    );
  });

  // Calcular paginación
  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / pageSize);
  const offset = (page - 1) * pageSize;
  const paginatedStudents = filteredStudents.slice(offset, offset + pageSize);

  return {
    data: paginatedStudents,
    metadata: {
      totalStudents,
      totalPages,
      currentPage: page,
      pageSize,
    },
  };
}
