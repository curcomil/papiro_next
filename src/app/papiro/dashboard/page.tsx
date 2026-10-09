import { cookies } from "next/headers";
import Admin_page from "./components/admin_page";
import { getUsers, getcoordinators } from "../services/users";
import { get_all_collections } from "../services/xmlibris";
import { redirect } from "next/navigation";
import { Digitizer_page } from "./components/digitizer_page";

export interface FetchStatus {
  success: boolean;
  message: string;
}

export interface FetchMap {
  [key: string]: FetchStatus;
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  const user = JSON.parse(userCookie?.value || "null");

  if (!user || !user.role) {
    redirect("/papiro/login?error=invalid_session");
  }

  switch (user.role) {
    case "admin":
      const [users, colecciones] = await Promise.all([
        getUsers(),
        get_all_collections(),
      ]);

      const fetchMap: FetchMap = {
        users: {
          success: users.success,
          message: users.message,
        },
        colecciones: {
          success: colecciones.success,
          message: colecciones.message,
        },
      };

      return (
        <Admin_page
          current_user={user}
          fetchMap={fetchMap}
          users={users.data}
          colecciones={colecciones.data}
        />
      );

    case "digitizer":
      const [coordinators, colecciones_digi] = await Promise.all([
        getcoordinators(),
        get_all_collections(),
      ]);

      const fetchMap_digi: FetchMap = {
        coordinators: {
          success: coordinators.success,
          message: coordinators.message,
        },
        colecciones: {
          success: colecciones_digi.success,
          message: colecciones_digi.message,
        },
      };

      return (
        <Digitizer_page
          current_user={user}
          coordinators={coordinators.data}
          fetchMap={fetchMap_digi}
          colecciones={colecciones_digi.data}
        />
      );

    case "coordinator":
      return <div>Coordinator</div>;

    case "chief":
      return <div>Chief</div>;

    default:
      return <div>Rol no reconocido: {user.role}</div>;
  }
}
