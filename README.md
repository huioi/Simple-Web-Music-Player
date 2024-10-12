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
3、控制台中将显示一个本地服务器的地址，类似于`http://localhost:3000`，使用浏览器进入该地址

## 项目开发
### 音乐列表
1、在音乐文件夹`public\music`内增添音乐文件
<br>
2、修改音乐列表文件`musicList.ts`
