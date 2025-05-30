import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar: string|null;
    address: string|null;
    phone_number: string|null;
    cart_id: number;
  }
}
