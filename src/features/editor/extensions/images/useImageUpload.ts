export const useImageUpload = () => {
  const uploadImage = async (file: File): Promise<string> => {
    // In a real SaaS, this would upload to S3/Cloudinary and return the CDN URL.
    // For now, we mock it using an object URL.
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file)
      // Simulate network delay
      setTimeout(() => {
        resolve(url)
      }, 500)
    })
  }

  return { uploadImage }
}
