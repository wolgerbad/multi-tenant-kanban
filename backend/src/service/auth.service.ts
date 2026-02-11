import z, { email } from "zod";
import { user_repository } from "../repository/user.repository.js";
import { LoginDTO, SignupDTO } from "../types.js";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { env } from "../utils/envSchema.js";
import { organization_repository } from "../repository/organization.repository.js";
import { organization_member_repository } from "../repository/organization_member.repository.js";
import { board_repository } from "../repository/board.repository.js";

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
              const [user] = await user_repository.add_user({name: userDTO.name, email: userDTO.email, password: hashedPassword})
              const [organization] = await organization_repository.create_organization(`${userDTO.name}'s organization`)
              await organization_member_repository.create_organization_member(organization.id, user.id, 'owner')
              await board_repository.create_board(organization.id, 'Welcome to Flowboard')
              const jwt = await new SignJWT({ id: user.id }).setProtectedHeader({alg: 'HS256'}).setIssuedAt().setExpirationTime('3 days').sign(SECRET)
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
   
    const jwt = await new SignJWT({id: user.id}).setProtectedHeader({alg: 'HS256'}).setIssuedAt().setExpirationTime('3 days').sign(SECRET)
    return {ok: true, data: jwt}
}


export const auth_service = { signup, login }