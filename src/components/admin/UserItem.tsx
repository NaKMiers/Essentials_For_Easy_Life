import { IUser } from '@/models/UserModel'
import { formatTime } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface UserItemProps {
  data: IUser
  loadingUsers: string[]
  className?: string

  selectedUsers: string[]
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteUsers: (ids: string[]) => void
}

function UserItem({
  data,
  loadingUsers,
  className = '',
  // selected
  selectedUsers,
  setSelectedUsers,
  // functions
  handleDeleteUsers,
}: UserItemProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // open states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const isCurUser = data._id === curUser?._id

  return (
    <>
      <div
        className={`trans-200 relative flex select-none items-start justify-between gap-2 rounded-lg p-4 text-dark shadow-lg ${
          selectedUsers.includes(data._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${!isCurUser ? 'cursor-pointer' : ''} ${className}`}
        onClick={() =>
          !isCurUser &&
          setSelectedUsers(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        {/* MARK: Body */}
        <div className="w-full">
          {/* Avatar */}
          <Link
            href={`/user/${data.username || data.email}`}
            className="float-start mr-3 block overflow-hidden rounded-md"
            onClick={e => e.stopPropagation()}
          >
            <Image
              className="aspect-square"
              src={data.avatar}
              height={65}
              width={65}
              alt="avatar"
              title={data._id}
            />
          </Link>

          {/* Role */}
          <div className="absolute -left-2 -top-2 z-30 select-none rounded-lg bg-secondary px-2 py-[2px] font-body text-xs text-yellow-300 shadow-md">
            {data.role}
          </div>

          {/* Email */}
          <p
            className="line-clamp-1 block text-ellipsis font-body text-[18px] font-semibold tracking-wide text-secondary"
            title={data.email}
          >
            {data.email}
          </p>

          {/* Username */}
          {data.username && (
            <p className="text-sm">
              <span className="font-semibold">Username: </span>
              <span>{data.username}</span>
            </p>
          )}

          {/* First Name + Last Name: Full Name */}
          {(data.firstName || data.lastName) && (
            <p className="text-sm">
              <span className="font-semibold">Fullname: </span>
              <span>{data.firstName + ' ' + data.lastName}</span>
            </p>
          )}

          {/* Created At */}
          <p className="text-sm">
            <span className="font-semibold">Created At: </span>
            <span
              className={`${
                +new Date() - +new Date(data.createdAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}
            >
              {formatTime(data.createdAt)}
            </span>
          </p>

          {/* Updated At */}
          <p className="text-sm">
            <span className="font-semibold">Updated At: </span>
            <span
              className={`${
                +new Date() - +new Date(data.updatedAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}
            >
              {formatTime(data.updatedAt)}
            </span>
          </p>
        </div>

        {/* MARK: Action Buttons*/}
        {!isCurUser && (
          <div className="flex flex-col gap-4 rounded-lg border border-dark px-2 py-3 text-dark">
            {/* Delete Button */}
            <button
              className="group block"
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
              disabled={loadingUsers.includes(data._id)}
              title="Delete"
            >
              {loadingUsers.includes(data._id) ? (
                <RiDonutChartFill
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : (
                <FaTrash
                  size={18}
                  className="wiggle"
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete User"
        content="Are you sure that you want to delete this user?"
        onAccept={() => handleDeleteUsers([data._id])}
        isLoading={loadingUsers.includes(data._id)}
      />
    </>
  )
}

export default memo(UserItem)
