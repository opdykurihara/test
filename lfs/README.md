# git lfsについて
`$ git lfs install`

## lfs管理ファイルを確認
```
$ git lfs ls-files
c838b5ada3 - src/images/test.jpg
```

## lfs管理ファイルを飛ばしてcloneする場合
```
$ GIT_LFS_SKIP_SMUDGE=1 git clone git@github.com:opdykurihara/sandbox.git
```

## 常にgit-lfsの処理を飛ばす場合
`$ git config filter.lfs.smudge "git-lfs smudge --skip %f"`

## 特定のファイルだけ持ってくる場合
```
$ git lfs fetch
$ git lfs pull
```

## ファイルを個別にダウンロードしたい場合
`$ git lfs pull -I greeting.txt`

