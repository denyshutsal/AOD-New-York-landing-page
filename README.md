#«AOD New York»

[Демо проекта](https://denyshutsal.github.io/AOD-New-York-landing-page/)

Lighthouse Audit in Chrome DevTools:

Desktop\
![Lighthouse Audit (Desktop)](https://github.com/denyshutsal/AOD-New-York-landing-page/blob/main/lighthouse%20metrics/Desktop.PNG "Desktop")

Mobile\
![Lighthouse Audit (Mobile)](https://github.com/denyshutsal/AOD-New-York-landing-page/blob/main/lighthouse%20metrics/Mobile.PNG "Mobile")


## Стек

- Bootstrap 4
- Adaptive layout
- JQuery
- Flexbox
- BEM naming
- SCSS
- Pug
- Gulp
- Adaptive images (picture + srcset)
- Retina + Webp
- Git

- Поддержка Internet Explorer 11

---

## Установка

Требуются установленные [Git](https://git-scm.com/), [Node.js (LTS, протестировано на версии v14.15.0)](https://nodejs.org/en/) и [gulp-cli](https://www.npmjs.com/package/gulp-cli)

1. Клонировать репозиторий.
2. Установить зависимости проекта: `npm i` (может быть долго, особенно на Windows).
3. Установить утилиту командной строки для Gulp: `npm i gulp-cli`

---

## Команды

`npm i` - установка зависимостей.

`npm start` - запустить сборку, сервер и слежение за файлами.

`npm run build` - финальная сборка проекта.

`npm run deploy` - опубликовать собранный проект на `GitHub Pages` в ветку `gh-pages` удаленного репозитория.

`npm run test` - общее тестирование проекта.

`npm run test:style` - тестирование стилей.

`npm run test:js` - тестирование скриптов.

Остальные команды описаны в файле `gulpfile.js`, запуск команд `gulp task_name`

Предполагается, что все команды выполняются в bash (для OSX и Linux это самый обычный встроенный терминал, для Windows это, к примеру, Git Bash). В Windows установку пакетов (npm i) нужно выполять в терминале, запущенном от имени администратора.

## Структура проекта

```bash
├── build/            # скомпилированные файлы (каталог генерируется автоматически в процессе работы или при финальной сборке проекта - `npm run build`)
├── source/           # каталог файлов проекта
│   ├── assets/
│   │    ├── favicon/ # каталог фавиконок
│   │    ├── fonts/   # каталог шрифтов
│   │    ├── img/     # каталог растровой графики
│   │    ├── svg/     # каталог векторной графики
│   │    └── webp/    # каталог пвстровой графики в формате .webp
│   ├── js/           # каталог скриптов
│   ├── pages/        # каталог шаблонов и блоков страниц разметки
│   └── sass/         # каталог стилей
├── .editorconfig     # файл конфигурации настроек редактора
├── .eslintrc.json    # файл конфигурации eslint
├── .eslintignore     # файл исключений eslint
├── .gitattributes    # файл атрибутов git
├── .gitignore        # файл исключений git
├── .prettierrc       # файл конфигурации prettier
├── .prettierignore   # файл исключений prettier
├── .pug-lint.json    # файл конфигурации pug
├── .stylelintrc.json # файл конфигурации stylelint
├── .stylelintignore  # файл исключений stylelint
├── gulpfile.js       # конфигурация gulp-сборщика проекта
├── package.json      # файл конфигурация npm зависимостей и настроек проекта
├── package-lock.json # автоматически генерируется при изменениях в node_modules, либо package.json
└── README.md         # документация проекта
```
