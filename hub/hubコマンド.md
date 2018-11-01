https://raw.githubusercontent.com/fukayatsu/

# hub
https://hub.github.com/  
hub is a command-line wrapper for git that makes you better at GitHub.  
訳) hubはgitのコマンドラインラッパーで、GitHubをより良く使うことができます。

* browse: Open a GitHub page in the default browser
ブラウザでgithubページを開く
https://hub.github.com/hub-browse.1.html  

* compare: Open a compare page on GitHub
ブラウザでgithubページを開いて比較を確認する
https://hub.github.com/hub-compare.1.html  

* issue: List or create GitHub issues  
issueを作成・確認する
https://hub.github.com/hub-issue.1.html  

* pr: List or checkout GitHub pull requests
プルリクエストを確認する
https://hub.github.com/hub-pr.1.html  

* pull-request: Open a pull request on GitHub  
プルリクエストを作成する
https://hub.github.com/hub-pull-request.1.html  

* release: List or create GitHub releases  
リリースを作成する
https://hub.github.com/hub-release.1.html

* sync: Fetch git objects from upstream and update branches  
ブランチを更新する
https://hub.github.com/hub-sync.1.html

* ci-status: Show the status of GitHub checks for a commit  
コミットのGitHubチェックのステータスを表示する
https://hub.github.com/hub-ci-status.1.html

* create: Create this repository on GitHub and add GitHub as origin
リポジトリを作成する
https://hub.github.com/hub-create.1.html  

* delete: Delete a repository on GitHub
リポジトリを削除する
https://hub.github.com/hub-delete.1.html  

* fork: Make a fork of a remote repository on GitHub and add as remote  
リポジトリをフォークする
https://hub.github.com/hub-fork.1.html  

## issue: issueの確認や作成、issueラベルの確認をする
https://hub.github.com/hub-issue.1.html

### issueを作成する
`Usage: hub issue create [-oc] [-m MESSAGE|-F FILE] [--edit] [-a USERS] [-M MILESTONE] [-l LABELS`
* マイルストーンは名前ではなくIDで指定する。
* プロジェクトを指定するオプションはない。(ver2.5.1時点)
```
$ git issue create -a opdykurihara -M 3 -l enhancement -F .github/ISSUE_TEMPLATE.md --edit
```
#### Tips:コミットメッセージにissueタイトルを入れるalias
```
  cm = "!f(){ hub issue -f '%t #%I%n' -a opdykurihara | grep $1 | git commit -F - --edit;};f"
```


### issueを確認する
`Usage: hub issue [-a ASSIGNEE] [-c CREATOR] [-@ USER] [-s STATE] [-f FORMAT] [-M MILESTONE] [-l LABELS] [-d DATE] [-o SORT_KEY [-]] [-L LIMIT]`
```
$ git issue -a opdykurihara
$ git issue -a opdykurihara -s closed
```

### issueのラベルを確認する
`Usage: hub issue labels [--color]`
```
$ hub issue labels
 bug
 duplicate
 enhancement
 help wanted
 invalid
 question
 wontfix
```

## pull requestを作る
https://hub.github.com/hub-pull-request.1.html  
`Usage: hub pull-request [-focp] [-b <BASE>] [-h <HEAD>] [-r <REVIEWERS> ] [-a <ASSIGNEES>] [-M <MILESTONE>] [-l <LABELS>]`

### issue番号に紐くpull requestを作る
* 当然ですが、プルリク作る前にpushしていないとエラーになります。（忘れがち）
```
//issue231を紐づける場合
$ git pull-request -i 231 -a opdykurihara -r opdmmuto -b developers-opendoor/locale_www_tour:master -h developers-opendoor/locale_www_tour:$(git symbolic-ref --short HEAD) -F .github/ISSUE_TEMPLATE.md --edit
→issueのタイトル入るようにしたい

参考
  cm = "!f(){ hub issue -f '%t #%I%n' -a opdykurihara | grep $1 | git commit -F - --edit;};f"

hub issue -f '%t #%I%n' -a opdykurihara | grep $1 | git pull-request -F - --edit;

hub issue -f '%t #%I%n' -a opdykurihara | grep 22 | git pull-request -i 22 -a opdykurihara -b opdykurihara/labs:master -h opdykurihara/labs:$(git symbolic-ref --short HEAD) -F - --edit



// issue紐づけない場合
$ git pull-request -l "enhancement" -a opdykurihara -r ytsuchida2 -r opdasato -r opdmmuto -b developers-opendoor/www_cdg:master -h developers-opendoor/www_cdg:$(git symbolic-ref --short HEAD) -F .github/ISSUE_TEMPLATE --edit 
```

```
# user-name はリポジトリのある user-name に適宜変更する
$ hub pull-request --browse -F ~/.pullreqmessage.txt -b user-name:master -h user-name:$(git symbolic-ref --short HEAD)

# symbolic-ref の --short オプションが使用できない場合は下記
$ hub pull-request --browse -F ~/.pullreqmessage.txt -b user-name:master -h user-name:$(git rev-parse --abbrev-ref HEAD)
```



## pull requestの確認
hub pr list [-s <STATE>] [-h <HEAD>] [-b <BASE>] [-o <SORT_KEY> [-^]] [-f <FORMAT>] [-L <LIMIT>]
hub pr checkout <PR-NUMBER> [<BRANCH>]
```
$ git pr list
TODO:ここは未実施
```

## pull requestを確認する
```
git pull-request 
```

## issue/prをデフォルトブラウザで確認する
git browse -- issues
git browse -- issues/22
git browse -- pulls
git browse -- pull/xx

TODO:
configにalias入れておくと便利そう
git config --global alias.prpr '!hub pull-request -F .github/PULL_REQUEST_TEMPLATE.md --edit -a yasuhiroki'

こんなやり方もあるそう
echo -e "タイトル\n\n本文" | hub pull-request -F - -a opdykurihara
echo -e "タイトル\n\n本文" | hub pull-request -F - -a opdykurihara --edit

* editorをvscodeにしておく場合
editor = "code --wait"
* テンプレートの#がコメントアウトになるので下記を追加
git config --global  core.commentchar auto

TODO:
git commit --help

issueタイトルを自動で入れる
aliasのサンプル
```
cm = "!f(){ hub issue -f '%t #%I%n' -a opdykurihara | grep $1 | git commit -F - --edit;};f"
```
vscodeでコミットする場合に文字コードがutf8でない場合
設定ファイルでgit-commitファイルのエンコードをutf8に設定する。
```
    "[git-commit]": {
        "files.autoGuessEncoding": false,
        "files.encoding": "utf8"
    },
```


usage: git worktree add [<options>] <path> [<commit-ish>]
   or: git worktree list [<options>]
   or: git worktree lock [<options>] <path>
   or: git worktree move <worktree> <new-path>
   or: git worktree prune [<options>]
   or: git worktree remove [<options>] <worktree>
   or: git worktree unlock <path>
   
git worktree list
git worktree add /d/worktree/dev-issue23 -b dev-issue23