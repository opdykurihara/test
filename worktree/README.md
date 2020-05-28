# git worktreeについて

* [worktreeとは](https://git-scm.com/docs/git-worktree)
gitリポジトリは複数の作業ツリーをサポートできるため、一度に複数のブランチをチェックアウトできます。 git worktreeを追加すると、新しい作業ツリーがリポジトリに関連付けられます。この新しい作業ツリーは、「git init」または「git clone」によって作成された「メイン作業ツリー」とは対照的に、「リンクされた作業ツリー」と呼ばれます。

「一度に複数のブランチをチェックアウトできる」= 複数ブランチで同時に作業できる

## worktreeの利用方法
* worktreeをはじめる
`git worktree add [チェックアウトするディレクトリ] [ブランチ名]`

* worktreeをやめる
ブランチ名ではなくチェックアウトしたディレクトリを指定するところは注意
`git worktree remove [チェックアウトしたディレクトリ]`

* worktreeしているブランチを確認したい
`git worktree list`

* worktreeの場所を間違えたので移動したい
`git worktree move [worktreeのディレクトリ名（ブランチ名ではないので注意）] [移動したいディレクトリ]`
例）git worktree move dev-w_review-post /d/worktree/dev-w_review-seo

### デモ
```
$ cd /d/development/workspace/git/www/www_cdg/ 
→常時developブランチにしている

$ git worktree add -b dev-sample_1 /d/worktree/dev-sample_1 master　 
→masterから案件ブランチdev-sample1を作成し/d/worktree/dev-sample_1ディレクトリでチェックアウトする

$ git worktree add -b dev-sample_2 /d/worktree/dev-sample_2 master　 
→masterから案件ブランチdev-sample2を作成し/d/worktree/dev-sample_2ディレクトリでチェックアウトする

$ cd /d/worktree/dev-sample_1
→いつリリースするか分からない作業する

$ cd /d/worktree/dev-sample_2
→いつリリースするか分からない作業をする
```
あるとき、dev-sample_1とdev-sample_2を同時リリースが決まる
```
$ git worktree add -b st-sample-xx /d/worktree/st-sample-xx master
$ cd /d/worktree/st-sample-xx
$ git merge dev-sample_1
$ git merge dev-sample_2
```
masterとst-sample-xxの差分をリリースする


### 複数リポジトリをcloneじゃだめなの？
* ブランチをpush、fetchすることなくマージしたり差分を見たりすることができる
* worktreeされているブランチは別のディレクトリでチェックアウトできないので同じブランチで別の作業をしてしまうことはない
[有識者の意見はこちら](https://stackoverflow.com/questions/31935776/what-would-i-use-git-worktree-for
)
