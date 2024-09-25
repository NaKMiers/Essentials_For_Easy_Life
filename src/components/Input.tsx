import React, { memo, useCallback, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { FaEye } from 'react-icons/fa'
import BottomGradient from './gradients/BottomGradient'

interface InputProps {
  label: string
  icon?: React.ElementType
  className?: string

  id: string
  type?: string
  disabled?: boolean
  required?: boolean
  onChange?: unknown
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  options?: unknown[]
  rows?: number
  labelBg?: string
  onClick?: (e?: unknown) => void
  onFocus?: (e?: unknown) => void

  // rest
  [key: string]: unknown
}

function Input({
  id,
  type = 'text',
  disabled,
  required,
  register,
  errors,
  label,
  onChange,
  icon: Icon,
  options,
  rows,
  onClick,
  onFocus,
  labelBg = 'bg-white',
  className = '',
  ...rest
}: InputProps) {
  // states
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)

  // show password
  const showPassword = useCallback(() => {
    setIsShowPassword(prev => !prev)
  }, [])

  return (
    <div className={`${className}`} onClick={onClick} onFocus={onFocus}>
      <div className={`flex border ${errors[id] ? 'border-rose-500' : 'border-dark'} rounded-[16px]`}>
        {/* MARK: Icon */}
        {Icon && (
          <span
            onClick={type === 'password' ? showPassword : undefined}
            className={`inline-flex items-center px-3 rounded-l-[16px] text-sm text-gray-900 ${
              errors[id] ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
            } ${type === 'password' ? 'cursor-pointer' : ''}`}
          >
            {type === 'password' ? (
              isShowPassword ? (
                <FaEye size={19} className='text-secondary' />
              ) : (
                <Icon size={19} className='text-secondary' />
              )
            ) : (
              <Icon size={19} className='text-secondary' />
            )}
          </span>
        )}

        {/* MARK: Text Field */}
        <div
          className={`relative group/btn w-full border-l-0 bg-white ${
            Icon ? 'rounded-r-[16px]' : 'rounded-[16px]'
          } ${errors[id] ? 'border-rose-400' : 'border-slate-200'}`}
        >
          {type === 'textarea' ? (
            <textarea
              id={id}
              className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
              placeholder=' '
              disabled={disabled}
              rows={rows || 4}
              {...register(id, { required })}
              {...rest}
            />
          ) : type === 'select' ? (
            <select
              id={id}
              className='rounded-l-[16px] block min-h-[42px] px-2.5 pb-2.5 pt-4 w-full text-sm text-dark focus:outline-none focus:ring-0 peer rounded-r-lg'
              style={{ WebkitAppearance: 'none', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
              disabled={disabled}
              {...register(id, { required })}
              onChange={onChange}
              defaultValue={options?.find(option => option.selected)?.value}
              {...rest}
            >
              {options?.map((option, index) => (
                <option
                  className='bg-dark-100 appearance-none text-light font-body font-semibold hover:bg-primary hover:text-dark checked:bg-indigo-500 trans-200 py-0.5 px-1.5'
                  key={index}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={id}
              className='block h-[42px] px-2.5 pb-2.5 pt-4 w-full rounded-r-[16px] text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer number-input'
              disabled={disabled}
              type={type === 'password' ? (isShowPassword ? 'text' : 'password') : type}
              {...register(id, { required })}
              onWheel={e => e.currentTarget.blur()}
              placeholder=''
              onChange={onChange}
              {...rest}
            />
          )}
          <BottomGradient />

          {!Icon &&
            type === 'password' &&
            (isShowPassword ? (
              <FaEye
                className='absolute top-1/2 -translate-y-1/2 right-3 text-dark cursor-pointer'
                size={19}
                onClick={showPassword}
              />
            ) : (
              <FaEye
                className='absolute top-1/2 -translate-y-1/2 right-3 text-dark cursor-pointer'
                size={19}
                onClick={showPassword}
              />
            ))}

          {/* MARK: Label */}
          <label
            htmlFor={id}
            className={`absolute text-nowrap rounded-md text-sm text-dark trans-300 transform -translate-y-4 scale-75 top-2 left-5 z-10 origin-[0] font-semibold ${labelBg} px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[48%] peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
              errors[id] ? 'text-rose-400' : 'text-dark'
            }`}
          >
            {label}
          </label>
        </div>
      </div>

      {/* MARK: Error */}
      {errors[id]?.message && (
        <span className='text-sm drop-shadow-md text-rose-400'>{errors[id]?.message?.toString()}</span>
      )}
    </div>
  )
}

export default memo(Input)
