# 简单Web音乐播放器

## 项目介绍
> **基于 React、TypeScript 和 Vite 构建的小型音乐网页播放器。**
### 主要功能
+ 文字闪烁
+ 播放/暂停
+ 切换播放
+ 调节音量
### 功能细节
+ 播放/暂停：可使用`空格按键`进行播放/暂停
+ 切换上一首：①可切换到上一首播放的歌曲；②若没有上一首歌曲（如初始进入网页）则显示黯淡灰色，鼠标悬浮会提示无法点击
+ 切换下一首：①可随机播放下一首歌曲
+ 调节音量：①调节滑轨，进行音量大小控制；②点击📣图标直接静音/取消静音

### 主页截图
![image](https://github.com/user-attachments/assets/a67e1cd3-6a0b-46e1-b657-e9785d4a493b)
![image](https://github.com/user-attachments/assets/fabd9b53-4e85-40b6-8f58-2905dbaffedd)

## 项目启动
1、`npm install`
<br>
2、`npm run dev`
<br>
3、控制台中将显示一个本地服务器的地址，类似于`http://localhost:7777`，使用浏览器进入该地址即可

## 关于其他
### 音乐列表
1、在音乐文件夹`public\music`内增添音乐文件
<br>
2、同时修改音乐列表文件`/src/musicList.ts`
### 部署到服务器（Linux系统 & Docker方式）
1、将项目文件上传至服务器
<br>
2、在项目所在目录分别添加文件`Dockerfile`和`.dockerignore`
```Dockerfile配置
# 使用 Node.js 18 的镜像进行构建
FROM node:18-alpine AS build
# 设置工作目录
WORKDIR /app
# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./
# 使用国内镜像源并安装依赖，增加超时时间
RUN npm config set registry https://registry.npmmirror.com && npm install --timeout=60000
# 将项目代码复制到工作目录
COPY . .
# 构建项目
RUN npm run build
# 使用 nginx 提供服务
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 暴露 80 端口
EXPOSE 80
# 容器启动时运行 nginx
CMD ["nginx", "-g", "daemon off;"]
```
```.dockerignore配置
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
```
3、终端中`cd`到项目所在目录
<br>
4、输入`docker build -t 1-1-radio .`（用于构建 Docker 镜像，它会根据当前目录（或者指定的路径）下的 Dockerfile 文件来创建镜像。）
<br>
5、运行完成后输入`docker run -d -p 7777:80 --restart always 1-1-radio`（根据Docker镜像生成一个新的容器实例，并配置运行环境）
### 部署到网站
**如果部署到网站后播放卡顿，解决方式：**
<br>
1、将音乐文件迁移到服务器其他目录，比如`/var/www/music`
<br>
2、输入`docker stop <container_id>`，运行完成后输入`docker rm <container_id>`
<br>
3、输入`docker build --no-cache -t 1-1-radio .`重新构建Docker镜像
<br>
4、输入`docker run -d -p 7777:80 -v /var/www/music:/app/public/music --restart always 1-1-radio`将宿主机的`/var/www/music`挂载到 Docker 容器中
<br>
5、配置反向代理，添加代码
```
location /music/ {
    alias /var/www/music/;
    access_log off;
    expires 1d;
}
```
