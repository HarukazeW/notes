#### 基本操作

```bash
git init   
git reset 		# 回退版本
git rm fileName # 删除文件
### 远程操作
git remote
git fetch

## 分支管理
git branch testb   		# 创建分支
git checkout testb 		# 切换分支
git checkout -b new 	# 新建分支并切换到改分支
git branch -d odd   	# 删除分支

git branch     			# 查看本地分支
git branch -a           # 查看本地及远程仓库的分支

git merge testb        	#将testb分支合并到当前分支

git clone -b branchA xx.git  #拉取指定分支g
git checkout -b test remotes/origin/test
# 拉取并切换到该远程分支，并将其保存为本地test分支
git push --set-upstream origin new
# 在远程仓库新建分支并提交到改分支

#冲突文件处，<<< 本地修改 === 远端修改 >>>> 
#修改该冲突文件
git status -s #查看冲突文件
### 修改后重新提交
git add .
git commit 
git push 

```

4. push后撤销push
``` bash
# 注意此步骤后，本地仓库和远程仓库数据均会被删除，注意要保存备份数据
git reset --hard HEAD^
# 回退到上次提交的版本，上上次为HEAD^^或HEAD~2
git push origin master -f
# 提交到远端仓库
```

5. 撤销本地的更改
```bash
git stash #删除本地更改接下来可直接git pull
git checkout -- fileName
#删除某文件的更改
```

6. 打标签

```bash
$ git tag -a v1.0 
```

7. 远端相关操作

```bash
git remote -v 	# 查看仓库地址

```



##### 日常开发

1. 先git branch建一个本地分支，进行开发，完毕后切换到master分支git merge分支，再删除该临时分支即可。



#### 遇到问题

1. git clone时一直报sll错误，后排查发现是因为配置了全局的git config，而该网站与其不一致导致的。