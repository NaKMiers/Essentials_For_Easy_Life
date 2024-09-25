export const formatPrice = (price: number = 0) => {
  return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export const formatFileSize = (size: number) => {
  // size < 1mb
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  }

  return (size / (1024 * 1024)).toFixed(2) + 'MB'
}

export const countPercent = (price: number, oldPrice: number) =>
  Math.ceil(((oldPrice - price) / oldPrice) * 100) + '%'

export const calcPercentage = (percentageString: string, number: number) => {
  const percentage = Number(percentageString.replace('%', ''))
  const result = (percentage / 100) * number
  return result
}
