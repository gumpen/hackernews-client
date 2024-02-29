import { User, UserSession } from "../../models/user";
import { InMemoryDatabase } from "../database";
import { hashPassword, verifyPassword } from "../../lib/auth";

export class UserService {
  db: InMemoryDatabase;

  constructor(db: InMemoryDatabase) {
    this.db = db;
  }

  getUser(id: string): User | undefined {
    return this.db.getUser(id);
  }

  resisterUser(id: string, password: string): User {
    // validation
    if (id.length < 3 || id.length > 64) {
      throw new Error("user id length is invalid");
    }

    if (password.length < 8 || password.length > 128) {
      throw new Error("user password length is invalid");
    }

    if (this.db.getUser(id)) {
      throw new Error("user id is already taken");
    }

    const { salt, hashedPassword } = hashPassword(password);

    const user = new User({
      id: id,
      passwordSalt: salt,
      hashedPassword: hashedPassword,
    });

    this.db.createUser(user);

    console.log("insert user:", user);

    return user;
  }

  createSession(userId: string): UserSession {
    if (!this.db.getUser(userId)) {
      throw new Error("user does not exist");
    }

    const session = new UserSession({ userId: userId });
    this.db.createUserSession(session);

    return session;
  }

  login(id: string, password: string): UserSession {
    const user = this.getUser(id);

    if (!user) {
      throw new Error("user does not exist");
    }

    if (!verifyPassword(password, user.passwordSalt, user.hashedPassword)) {
      throw new Error("invalid credential");
    }

    return this.createSession(user.id);
  }
}
