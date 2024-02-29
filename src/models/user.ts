import { generateSessionToken } from "../lib/auth";

export class User {
  public readonly id: string;
  public readonly about: string;
  public readonly created: number;
  public readonly karma: number;
  public readonly submitted: number[];

  public readonly email: string;
  public readonly passwordSalt: string;
  public readonly hashedPassword: string;

  // MEMO: 特定のpropertyを引数から除外したい場合どうするか
  constructor(props: Partial<User>) {
    if (!props.id) {
      throw new Error("user id is must be set");
    }

    if (!props.passwordSalt || !props.hashedPassword) {
      throw new Error("password is must be set");
    }

    this.id = props.id;
    this.about = props.about || "";
    this.created = props.created || new Date().getTime();
    this.karma = props.karma || 1;
    this.submitted = props.submitted || [];
    this.email = props.email || "";
    this.passwordSalt = props.passwordSalt;
    this.hashedPassword = props.hashedPassword;
  }
}

export class UserSession {
  public readonly userId: string;
  public readonly expired: number;
  public readonly token: string;

  constructor(props: Partial<UserSession>) {
    if (!props.userId) {
      throw new Error("user id is must be set");
    }

    this.userId = props.userId;
    this.expired = props.expired || new Date().getTime() + 31536000 * 1000;
    this.token = props.token || generateSessionToken();
  }
}
