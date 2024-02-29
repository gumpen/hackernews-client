import { User, UserSession } from "@/models/user";

export class InMemoryDatabase {
  private data: {
    users: User[];
    sessions: UserSession[];
  };

  constructor() {
    console.log("constructor");
    this.data = {
      users: [],
      sessions: [],
    };
  }

  getUser(id: string): User | undefined {
    console.log("getUser", id);
    console.log(this.data.users);
    return this.data.users.find((user) => user.id === id);
  }

  createUser(user: User): User {
    console.log("createUser", user);
    this.data.users.push(user);

    return user;
  }

  createUserSession(session: UserSession): UserSession {
    this.data.sessions.push(session);

    return session;
  }
}
