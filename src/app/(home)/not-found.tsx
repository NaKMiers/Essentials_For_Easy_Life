import Divider from '@/components/Divider'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Không tìm thấy trang - Mona Edu',
  description: 'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam',
}

function NotFoundPage() {
  return (
    <div className='h-[calc(100vh-72px)] pb-20 flex items-center justify-center px-21'>
      <div className='text-center'>
        <h1
          className='text-[90px] sm:text-[120px] md:text-[160px] lg:text-[180px] xl:text-[222px] text-transparent font-extrabold tracking-wide drop-shadow-md'
          style={{
            background: 'url(/images/not-found.jpg)',
            backgroundPosition: '6.7% 97%',
            backgroundClip: 'text',
            backgroundRepeat: 'no-repeat',
          }}
        >
          Oops!
        </h1>

        <h2 className='bg-dark font-semibold text-xl sm:text-2xl md:text-3xl text-light'>
          404 - Không tìm thấy trang
        </h2>

        <Divider size={6} />

        <p className='font-body tracking-wider font-semibold max-w-[400px] mx-auto text-slate-300'>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn.
        </p>

        <Divider size={10} />

        <Link
          href='/'
          className='font-semibold uppercase text-base md:text-lg text-primary bg-secondary rounded-[50px] hover:bg-primary hover:text-secondary hover:shadow-2xl hover:shadow-primary trans-300 px-8 py-4 shadow-sm shadow-primary'
        >
          Quay lại trang chủ
        </Link>

        <Divider size={6} />
      </div>
    </div>
  )
}

export default NotFoundPage
