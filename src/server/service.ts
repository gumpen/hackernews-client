import { UserService } from "./services/user";
import prisma from "./db";

console.log("service.ts");
export const userService = new UserService(prisma);

// export const initServices = () => {
//   console.log("initServices");
//   const db = new InMemoryDatabase();
//   export const userService = new UserService(db);
// };
