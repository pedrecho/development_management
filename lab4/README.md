# Лабораторная 4: методы тест-дизайна

## Цель работы
Тестирование [формы регистрации Brevo](https://onboarding.brevo.com/account/register)

## Список используемых кейсов

### Email

- Корректные (должен попадать по регулярное выражение для эмейлов)
  - `example@mail.ru`

- Некоррекнтые
  - `examplemail.ru` - отсутвует символ `@`
  - `example@mailru` - отсутвует `.`
  - `example@.ru` - отсутствуют символы между `@` и `.`
  - `example@mail.` - отсутсвуют символы после `.`
  - `@mail.ru` - отсутсвуют символы перед `@`

### Password (должен быть 8 символов или больше)

- Корректные
  - `12345678`

- Некорректные
  - `123456`

## Описание эквивалентных классов

Разделение на классы по коректным и некорректным данным

## Расчет кол-ва тестов

Для тестирования поля email требуется провести 1 тест на кореектные данные и 5 тестов для всех случаев некорректных данных

Для теста поля password достаточно провести 1 тест с корректным паролем и 1 тест с некорректным, так как условие всего одно

Так как тесты не зависят друг от друга то достаточно провести всего 8 тестов суммарно