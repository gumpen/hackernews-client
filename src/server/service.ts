import { InMemoryDatabase } from "./database";
import { UserService } from "./services/user";

console.log("service.ts");
const db = new InMemoryDatabase();
export const userService = new UserService(db);

// export const initServices = () => {
//   console.log("initServices");
//   const db = new InMemoryDatabase();
//   export const userService = new UserService(db);
// };
