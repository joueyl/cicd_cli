# 怎么使用

## 安装

```cmd
pnpm install jouei-cicd -g 
```



## 获得帮助信息

``` cmd
scd -h
scd
```

## 添加项目
添加项目必须要在项目的根目录执行

```cmd
scd add
```



![https://pic.imgdb.cn/item/65c2f9f39f345e8d03196cc9.png](https://pic.imgdb.cn/item/65c2f9f39f345e8d03196cc9.png)

## 注意事项

#### 打包项目产出

项目的打包文件输出必须为dist文件夹(vite默认)

## 项目配置

### 自动配置

在想要使用自动化的目录执行

```cmd
scd install
```

选择对应项目将自动配置并开启自动化

![](https://pic.imgdb.cn/item/65c2fb419f345e8d031c6c0d.png)



### 手动配置

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
