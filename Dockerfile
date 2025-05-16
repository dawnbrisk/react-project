
# 生产环境
FROM node:16

# 设置工作目录
WORKDIR /app

# 安装 serve
RUN npm install -g serve

# 复制构建后的文件
COPY build /app

# 暴露 3000 端口
#EXPOSE 3000
EXPOSE 3001

# 启动应用
#CMD ["serve", "-s", "/app", "-l", "3000","--no-clipboard", "--no-port-switching"]
CMD ["serve", "-s", "/app", "-l", "3001","--no-clipboard", "--no-port-switching"]
