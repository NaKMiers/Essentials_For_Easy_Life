import Divider from '@/components/Divider'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Không tìm thấy trang - Mona Edu',
  description: 'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam',
}

function NotFoundPage() {
  return (
    <div className="flex h-[calc(100vh-72px)] items-center justify-center px-21 pb-20">
      <div className="text-center">
        <h1
          className="text-[90px] font-extrabold tracking-wide text-transparent drop-shadow-md sm:text-[120px] md:text-[160px] lg:text-[180px] xl:text-[222px]"
          style={{
            background: 'url(/images/not-found.jpg)',
            backgroundPosition: '6.7% 97%',
            backgroundClip: 'text',
            backgroundRepeat: 'no-repeat',
          }}
        >
          Oops!
        </h1>

        <h2 className="bg-dark text-xl font-semibold text-slate-400 sm:text-2xl md:text-3xl">
          404 - Không tìm thấy trang
        </h2>

        <Divider size={6} />

        <p className="mx-auto max-w-[400px] font-body font-semibold tracking-wider text-slate-300">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn.
        </p>

        <Divider size={10} />

        <Link
          href="/"
          className="trans-300 rounded-[50px] bg-secondary px-8 py-4 text-base font-semibold uppercase text-primary shadow-sm shadow-primary hover:bg-primary hover:text-secondary hover:shadow-2xl hover:shadow-primary md:text-lg"
        >
          Quay lại trang chủ
        </Link>

        <Divider size={6} />
      </div>
    </div>
  )
}

export default NotFoundPage
