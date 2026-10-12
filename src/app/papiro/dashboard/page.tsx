import { cookies } from "next/headers";
import Admin_page from "./components/admin_page";
import { getUsers } from "../services/users";
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
      const users = await getUsers();

      const fetchMap: FetchMap = {
        users: {
          success: users.success,
          message: users.message,
        },
      };

      return (
        <Admin_page
          current_user={user}
          fetchMap={fetchMap}
          users={users.data}
        />
      );

    case "digitizer":
      return <Digitizer_page current_user={user} />;

    case "coordinator":
      return <div>Coordinator</div>;

    case "chief":
      return <div>Chief</div>;

    default:
      return <div>Rol no reconocido: {user.role}</div>;
  }
}
