import z, { email } from "zod";
import { user_repository } from "../repository/user.repository.js";
import { LoginDTO, SignupDTO } from "../types.js";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { env } from "../utils/envSchema.js";

const signup_schema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6)
})

const login_schema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

const SALT_ROUNDS = 12;
const SECRET = new TextEncoder().encode(env.JWT_SECRET)

export async function signup(userDTO: SignupDTO) {
    try {  
    const {error} = signup_schema.safeParse(userDTO)
      if(error) return {ok: false, error: error.message}
        
      const userExists = await user_repository.get_user_by_email(userDTO.email)
         if(userExists?.length) return {ok: false, error: 'User already exists.'}      
              const hashedPassword = await bcrypt.hash(userDTO.password, SALT_ROUNDS);
              await user_repository.add_user({name: userDTO.name, email: userDTO.email, password: hashedPassword})
              const jwt = await new SignJWT().setProtectedHeader({alg: 'HS256'}).setIssuedAt().setExpirationTime('3 days').sign(SECRET)
              return {ok: true, data: jwt};
          } catch (error: any) {
            return {ok: false, error: error.message}
          }
}

export async function login(userDTO: LoginDTO) {
    const {error} = login_schema.safeParse(userDTO);
    if(error) return {ok: false, error: error.message};
    
    const [user] = await user_repository.get_user_by_email(userDTO.email);
    if(!user) return {ok: false, error: 'Invalid credentials.'}

    const isValid = await bcrypt.compare(userDTO.password, user.password);
    if(!isValid) return {ok: false, error: 'Invalid credentials.'}
   
    const jwt = await new SignJWT().setProtectedHeader({alg: 'HS256'}).setIssuedAt().setExpirationTime('3 days').sign(SECRET)
    return {ok: true, data: jwt}
}


export const auth_service = { signup, login }