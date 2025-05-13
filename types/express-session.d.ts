import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
    address: string;
    phone_number: string;
  }
}
