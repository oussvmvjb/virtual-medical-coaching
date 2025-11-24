// هذا الملف لبيئة الإنتاج
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8081/api/users', // استبدل برابط السيرفر الحقيقي
  emailjs: {
    serviceId: 'service_fd71ifd', // استبدل ب service ID الحقيقي
    templateId: 'template_tzjsqtb', // استبدل ب template ID الحقيقي
    publicKey: '2w26KF5jldH41vNeR' // استبدل ب public key الحقيقي
  }
};
