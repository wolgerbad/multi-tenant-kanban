import { User } from "@/types"

export default function ProfilePicture({user, className, children}: {user: User; className: string; children?: React.ReactNode }) {
    return <div className={`${className} flex items-center justify-center rounded-full bg-emerald-500/10  font-semibold text-emerald-300 ring-2 ring-slate-700`}>
        {user.image ? <img src={user.image} className='h-full w-full rounded-full object-cover' /> : <span>{user.name.slice(0, 1).toUpperCase()}</span> }
        {children}
    </div>  
}