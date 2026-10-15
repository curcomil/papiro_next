import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Admin_page from "./components/admin_page";
import { Digitizer_page } from "./components/digitizer_page";
import { createUserUseCases } from "@/modules/users/application/user-use-cases";
import { createUserRepository } from "@/modules/users/infrastructure/server-action-user-repository";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  const user = JSON.parse(userCookie?.value || "null");

  if (!user || !user.role) {
    redirect("/papiro/login?error=invalid_session");
  }

  switch (user.role) {
    case "admin": {
      const userUseCases = createUserUseCases(createUserRepository());
      const result = await userUseCases.listUsers();

      return (
        <Admin_page
          current_user={user}
          users={result.users}
          usersStatus={{ success: result.success, message: result.message }}
        />
      );
    }

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
