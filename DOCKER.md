# Инструкция по развертыванию в Docker

Это руководство поможет вам развернуть проект "Понятно" в Docker.

## Предварительные требования

### 1. Установка Docker

Если вы видите ошибку `zsh: command not found: docker`, значит Docker не установлен.

#### Для macOS:

**Вариант 1: Docker Desktop (рекомендуется)**

1. Скачайте Docker Desktop для Mac:
   - Перейдите на [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Или скачайте напрямую: [Docker Desktop для Mac с Apple Silicon](https://desktop.docker.com/mac/main/arm64/Docker.dmg) (M1/M2/M3)
   - Или [Docker Desktop для Mac с Intel](https://desktop.docker.com/mac/main/amd64/Docker.dmg) (Intel)

2. Установите Docker Desktop:
   - Откройте скачанный `.dmg` файл
   - Перетащите Docker в папку Applications
   - Запустите Docker из Applications
   - Следуйте инструкциям установщика
   - Введите пароль администратора при запросе

3. Проверьте установку:

   ```bash
   docker --version
   docker compose version
   ```

4. **Убедитесь, что Docker запущен:**
   - В меню macOS (верхняя панель) должна быть иконка Docker (кит)
   - Если её нет, запустите Docker Desktop из Applications
   - Если видите ошибку `Cannot connect to the Docker daemon`, значит Docker Desktop не запущен
   - Запустите Docker Desktop и дождитесь, пока иконка в меню станет зелёной/активной

**Вариант 2: Установка через Homebrew**

```bash
# Установите Homebrew, если его нет
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установите Docker Desktop
brew install --cask docker

# Запустите Docker Desktop
open /Applications/Docker.app
```

#### Для Linux:

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker (чтобы не использовать sudo)
sudo usermod -aG docker $USER

# Выйдите и войдите снова, затем проверьте
docker --version
```

#### Для Windows:

1. Скачайте Docker Desktop для Windows:
   - [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. Установите и следуйте инструкциям установщика

3. После установки перезагрузите компьютер

### 2. Проверка установки

После установки проверьте, что Docker работает:

```bash
# Проверьте версию Docker
docker --version

# Проверьте версию Docker Compose
docker compose version

# Запустите тестовый контейнер
docker run hello-world
```

Если команды работают, Docker установлен правильно!

### 3. Переменные окружения

Вам понадобятся:

- Токен Telegram бота
- ID чата для получения заявок

## Шаг 1: Получение токена Telegram бота

1. Откройте Telegram и найдите бота [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Скопируйте полученный токен (выглядит как `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Получение ID чата

1. Откройте Telegram и найдите бота [@userinfobot](https://t.me/userinfobot)
2. Отправьте команду `/start`
3. Скопируйте ваш `Id` (число, например `123456789`)

Или для группового чата:

1. Добавьте бота [@userinfobot](https://t.me/userinfobot) в группу
2. Отправьте команду `/start` в группе
3. Скопируйте `Id` группы

## Шаг 3: Настройка переменных окружения

1. Скопируйте файл `.env.example` в `.env`:

   ```bash
   cp .env.example .env
   ```

2. Откройте файл `.env` и заполните переменные:
   ```env
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   TELEGRAM_CHAT_ID=ваш_id_чата
   ```

## Шаг 4: Сборка и запуск контейнера

### Вариант 1: Использование Docker Compose (рекомендуется)

1. Соберите и запустите контейнер:

   ```bash
   docker compose up -d --build
   ```

2. Проверьте, что контейнер запущен:

   ```bash
   docker compose ps
   ```

3. Проверьте логи:

   ```bash
   docker compose logs -f
   ```

4. Откройте приложение в браузере:
   ```
   http://localhost:3000
   ```

### Вариант 2: Использование Docker напрямую

1. Соберите образ:

   ```bash
   docker build -t tutor-landing .
   ```

2. Запустите контейнер:

   ```bash
   docker run -d \
     --name tutor-landing \
     -p 3000:3000 \
     --env-file .env \
     --restart unless-stopped \
     tutor-landing
   ```

3. Проверьте логи:
   ```bash
   docker logs -f tutor-landing
   ```

## Управление контейнером

### Остановка контейнера

```bash
docker compose down
```

### Перезапуск контейнера

```bash
docker compose restart
```

### Просмотр логов

```bash
docker compose logs -f
```

### Остановка и удаление контейнера с данными

```bash
docker compose down -v
```

### Пересборка после изменений в коде

```bash
docker compose up -d --build
```

## Проверка работоспособности

1. Откройте в браузере: `http://localhost:3000`
2. Проверьте healthcheck endpoint: `http://localhost:3000/api/trpc/ping`
   - Должен вернуть `{"result":{"data":"pong"}}`
3. Заполните квиз на сайте и проверьте, что заявка приходит в Telegram

## Изменение порта

Если порт 3000 занят, измените его в `docker-compose.yml`:

```yaml
ports:
  - "8080:3000" # Внешний порт:Внутренний порт
```

Затем приложение будет доступно по адресу `http://localhost:8080`

## Решение проблем

### Ошибка "Cannot connect to the Docker daemon"

Если вы видите ошибку:

```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

**Это означает, что Docker Desktop не запущен.**

**Решение:**

1. Откройте Docker Desktop из Applications (Finder → Applications → Docker)
2. Дождитесь полной загрузки (иконка кита в верхней панели macOS должна стать активной)
3. Проверьте статус:
   ```bash
   docker ps
   ```
4. Если команда работает без ошибок, Docker запущен и готов к работе
5. Теперь можно запускать `docker compose up -d --build`

### Ошибка "email must be verified before using account"

Если вы видите ошибку:

```
failed to fetch oauth token: unexpected status from GET request to https://auth.docker.io/token?scope=repository%3Alibrary%2Fnode%3Apull&service=registry.docker.io: 401 Unauthorized: email must be verified before using account
```

**Это означает, что Docker пытается использовать ваш Docker Hub аккаунт, но email не верифицирован.**

**Решение 1: Выйти из Docker Hub (рекомендуется для локальной разработки)**

Если вам не нужен Docker Hub аккаунт для этого проекта:

```bash
docker logout
```

Затем попробуйте снова:

```bash
docker compose up -d --build
```

**Решение 2: Верифицировать email (если нужен аккаунт)**

1. Откройте [Docker Hub](https://hub.docker.com/)
2. Войдите в свой аккаунт
3. Проверьте почту и подтвердите email
4. Попробуйте снова: `docker compose up -d --build`

**Решение 3: Проверить доступность образа**

Попробуйте вручную загрузить базовый образ:

```bash
docker pull node:20-alpine
```

Если это работает, попробуйте снова собрать проект.

### Предупреждение о версии в docker-compose.yml

Если видите предупреждение:

```
WARN[0000] the attribute 'version' is obsolete
```

**Решение:** Файл уже обновлён, предупреждение можно игнорировать. Это не критично.

### Контейнер не запускается

1. Проверьте логи:

   ```bash
   docker compose logs
   ```

2. Убедитесь, что переменные окружения установлены:

   ```bash
   docker compose config
   ```

3. Проверьте, что порт 3000 свободен:
   ```bash
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

### Заявки не приходят в Telegram

1. Проверьте правильность токена и ID чата в `.env`
2. Убедитесь, что бот добавлен в чат (если это групповой чат)
3. Проверьте логи контейнера на наличие ошибок

### Проблемы с памятью при сборке

Если сборка падает из-за нехватки памяти, увеличьте лимит памяти Docker:

- Docker Desktop → Settings → Resources → Memory
- Установите минимум 4GB

## Production развертывание

Для production рекомендуется:

1. Использовать reverse proxy (nginx, traefik)
2. Настроить SSL/TLS сертификаты
3. Использовать Docker secrets для переменных окружения
4. Настроить мониторинг и логирование
5. Использовать orchestration (Docker Swarm, Kubernetes)

## Дополнительная информация

- [Документация Docker](https://docs.docker.com/)
- [Документация Next.js](https://nextjs.org/docs)
- [Документация Docker Compose](https://docs.docker.com/compose/)
