# 怎么使用

## 安装

```cmd
pnpm install jouei-cicd -g 
```



## 获得帮助信息

```
scd -h
```

## 添加项目

```cmd
scd add
```



![https://s11.ax1x.com/2024/01/19/pFA7sjU.png](https://s11.ax1x.com/2024/01/19/pFA7sjU.png)

## 注意事项

#### 请严格按照示例的路径格式填写

#### 服务器最后上传路径

```cmd
? 远程部署目录(例:/home/www/)(The deployment directory on the server) /www/wwwroot/
? 远程部署文件夹(The folder where the deployment package is located) CICD_project
```

上传到服务的目录是这两个拼接起来的即`/www/wwwroot/CICD_project`,这么做的方式主要是为了区分每个项目，避免项目直接文件夹重复，部署文件夹是一个可选值，即默认值是`项目名称`

#### 打包项目产出

项目的打包文件输出必须为dist文件夹(vite默认)

## 项目配置

实现自动化的方式是使用`git hook`,使用钩子去自动运行自动化脚本

#### 安装husky

```cmd
pnpm install husky -D
```

#### 开启git hook

```cmd
npx husky install
```

#### 开启自动安装

```cmd
npm pkg set scripts.prepare="husky install"
```

#### 配置启动命令

![https://s11.ax1x.com/2024/01/19/pFA7sjU.png](https://s11.ax1x.com/2024/01/19/pFA7sjU.png)

```cmd
npx husky add .husky/pre-commit "scd run <name>"
```

`name`代表项目名称，填写对应的项目，在git hook里会自动运行scd脚本

更多配置请查看[husky文档](https://typicode.github.io/husky/getting-started.html)

注意:项目目录和配置里的项目一定要对应

## 手动运行

![](https://s11.ax1x.com/2024/01/19/pFAbVdH.png)

```cmd
scd run
```

在添加配置文件后可以手动触发脚本
