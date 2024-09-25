# kcl-hack
このプロジェクトは、Next.js、Prisma、NextAuth、PostgreSQLを使用したWebアプリケーションです。開発環境はDockerを使用しています。

## 目次
- セットアップ手順
  - 前提条件
  - 環境変数の設定
  - Docker コンテナの起動
  - DBのマイグレーション
  - アプリケーションの起動
- その他

## セットアップ手順
### 前提条件
- Node.jsとnpmがインストールされていること
- DockerとDocker Composeがインストールされていること
- GitHubアカウント

### 環境変数の設定
プロジェクトのルートディレクトリに.envファイルを作成します。

以下の内容を.envファイルに記述します。
```
# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

```NEXTAUTH_SECRET```は以下のコマンドで生成できます。
```
openssl rand -base64 32
```

### Docker コンテナの起動
以下のコマンドでDockerコンテナをビルドして起動します。

```
docker-compose up --build
```
### データベースのマイグレーション
Dockerコンテナ内に入ります。
```
docker exec -it your-project-name-app-1 sh
```

コンテナ内でマイグレーションを実行します。
```
npx prisma migrate dev --name init
```

Prisma Clientを生成します。
```
npx prisma generate
```

コンテナから退出します。
```
exit
```

### アプリケーションの起動
ブラウザでhttp://localhost:3000にアクセスし、アプリケーションが動作していることを確認します。


## その他
- **Prismaスキーマの変更**：```prisma/schema.prisma```を編集した後、マイグレーションとクライアントの生成が必要です。
```
docker exec -it your-project-name-app-1 sh
npx prisma migrate dev --name your_migration_name
npx prisma generate
exit
```

- **コンテナの停止**：開発作業が終了したら、以下のコマンドでコンテナを停止できます。
```
docker-compose down
```

- **依存関係の追加**：新しいパッケージを追加した場合、コンテナを再ビルドする必要があります。
```
docker-compose up --build
```
