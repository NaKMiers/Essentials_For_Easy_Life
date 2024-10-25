'use client'

import Input from '@/components/Input'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import UserItem from '@/components/admin/UserItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { deleteUsersApi, getAllUsersApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { Slider } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSearch, FaSort } from 'react-icons/fa'

function AllUsersPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [users, setUsers] = useState<IUser[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // loading and confirming
  const [loadingUsers, setLoadingUsers] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minExpended, setMinExpended] = useState<number>(0)
  const [maxExpended, setMaxExpended] = useState<number>(0)
  const [expended, setExpended] = useState<number[]>([0, 0])

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
      role: '',
      authType: '',
      connectedToSpotify: '',
    }),
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // MARK: Get Data
  // get all users
  useEffect(() => {
    // get all users
    const getAllUsers = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { users, amount, chops } = await getAllUsersApi(query) // cache: no-store

        // set to states
        setUsers(users)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('role', searchParams?.role || getValues('role'))
        setValue('authType', searchParams?.authType || getValues('authType'))
        setValue(
          'connectedToSpotify',
          searchParams?.connectedToSpotify || getValues('connectedToSpotify')
        )

        // set expended
        setMinExpended(chops.minExpended)
        setMaxExpended(chops.maxExpended)
        if (searchParams?.expended) {
          const [from, to] = Array.isArray(searchParams.expended)
            ? searchParams.expended[0].split('-')
            : (searchParams.expended as string).split('-')

          setExpended([+from, +to])
        } else {
          setExpended([chops?.minExpended || 0, chops?.maxExpended || 0])
        }
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllUsers()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // delete user
  const handleDeleteUsers = useCallback(async (ids: string[]) => {
    setLoadingUsers(ids)

    try {
      // send request to server
      const { deletedUsers, message } = await deleteUsersApi(ids)

      // remove deleted users from state
      setUsers(prev =>
        prev.filter(user => !deletedUsers.map((user: IUser) => user._id).includes(user._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingUsers([])
      setSelectedUsers([])
    }
  }, [])

  // handle select all users
  const handleSelectAllUsers = useCallback(() => {
    setSelectedUsers(
      selectedUsers.length > 0 ? [] : users.filter(user => user.role === 'user').map(user => user._id)
    )
  }, [users, selectedUsers.length])

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // reset page
      if (searchParams?.page) {
        delete searchParams.page
      }

      // loop through data to prevent filter default
      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key]
          } else {
            data[key] = ''
          }
        }
      }

      return {
        ...data,
        expended: expended[0] === minExpended && expended[1] === maxExpended ? '' : expended.join('-'),
      }
    },
    [expended, minExpended, maxExpended, searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname, { scroll: false })
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    // page title
    document.title = 'All Users - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        handleSelectAllUsers()
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, handleSelectAllUsers, handleSubmit])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <AdminHeader title="All Users" />
      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      {/* MARK: Filter */}
      <AdminMeta
        handleFilter={handleSubmit(handleFilter)}
        handleResetFilter={handleResetFilter}
      >
        {/* Search */}
        <div className="col-span-12 flex flex-col md:col-span-4">
          <Input
            id="search"
            className="md:max-w-[450px]"
            label="Search"
            disabled={false}
            register={register}
            errors={errors}
            type="text"
            icon={FaSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-3 md:col-span-8">
          {/* Sort */}
          <Input
            id="sort"
            label="Sort"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('sort')}
            options={[
              {
                value: 'createdAt|-1',
                label: 'Newest',
              },
              {
                value: 'createdAt|1',
                label: 'Oldest',
              },
              {
                value: 'updatedAt|-1',
                label: 'Latest',
                selected: true,
              },
              {
                value: 'updatedAt|1',
                label: 'Earliest',
              },
            ]}
          />

          {/* Role */}
          <Input
            id="role"
            label="Role"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('role')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'admin',
                label: 'Admin',
              },
              {
                value: 'user',
                label: 'User',
              },
            ]}
          />

          {/* Auth Type */}
          <Input
            id="authType"
            label="Auth Type"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('authType')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'google',
                label: 'Google',
              },
              {
                value: 'github',
                label: 'GitHub',
              },
            ]}
          />

          {/* Connected To Spotify */}
          <Input
            id="connectedToSpotify"
            label="Connected To Spotify"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('connectedToSpotify')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'Connected',
              },
              {
                value: 'false',
                label: 'Unconnected',
              },
            ]}
          />
        </div>

        <div className="hidden md:col-span-8 md:flex" />

        {/* MARK: Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-light"
            onClick={handleSelectAllUsers}
          >
            {selectedUsers.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedUsers.length && (
            <button
              className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-light"
              onClick={() => setIsOpenConfirmModal(true)}
            >
              Delete
            </button>
          )}
        </div>
      </AdminMeta>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete Users"
        content="Are you sure that you want to delete these users?"
        onAccept={() => handleDeleteUsers(selectedUsers)}
        isLoading={loadingUsers.length > 0}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} user{amount > 1 && 's'}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <UserItem
            data={user}
            loadingUsers={loadingUsers}
            // selected
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            // functions
            handleDeleteUsers={handleDeleteUsers}
            key={user._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllUsersPage
