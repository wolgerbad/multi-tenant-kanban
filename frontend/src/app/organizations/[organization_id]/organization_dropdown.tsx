'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, UserIcon } from 'lucide-react'
import { Organization } from '@/types'

export function OrganizationsDropdown({ organizations, organization_id }: { organizations: Organization[], organization_id: number | null }) {
  const selected_organization = organizations?.find(org => org.id === organization_id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='border outline-0 px-2 py-1 rounded-sm flex items-center justify-between gap-2 w-60'>
          {selected_organization ? selected_organization.title : 'Select an organization'}
          <ChevronDown />
          {/* {user.image ? <img src={user.image} className="cursor-pointer w-8 h-8 rounded-full" /> : <div className="cursor-pointer w-8 text-center rounded-full flex items-center justify-center text-xl font-semibold bg-slate-400">{user.name.slice(0, 1)}</div>} */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900 text-slate-400 w-60">
        {organizations.map( organization => <DropdownMenuItem key={organization.id}>
          <Link href={`/organizations/${organization.id}`} className="w-full h-full flex gap-2 items-center">
            {/* <UserIcon /> */}
            {organization.title}
          </Link>
        </DropdownMenuItem>
      )}
      </DropdownMenuContent>
    </DropdownMenu>
    )
}