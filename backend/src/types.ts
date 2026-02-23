import { Socket } from "socket.io";

export type LoginDTO = {
  email: string;
  password: string;
};

export type SignupDTO = {
  name: string;
  email: string;
  password: string;
};

