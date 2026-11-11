# DOCKERFILE CHO TARGET WEB SERVER - LAB SESSION HIJACKING (NHÓM 22 - UTH)
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép mã nguồn ứng dụng web
COPY ../SOURCE/server.js ./server.js

# Cổng dịch vụ HTTP (không bảo mật)
EXPOSE 3000

# Khởi chạy máy chủ
CMD ["node", "server.js"]
