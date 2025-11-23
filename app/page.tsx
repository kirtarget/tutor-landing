export default function Home() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="section hero" id="top">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="badge">Онлайн-репетиторы для 5–11 классов</div>
            <h1 className="hero-title">
              Подберите “своего” репетитора для ребёнка 5–11 класса за 2 минуты
              и запустите занятия уже на этой неделе
            </h1>
            <p className="hero-subtitle">
              Ответьте на 5–7 вопросов — подберём подходящего онлайн-репетитора
              под цель, характер ребёнка и ваш график.
            </p>
            <div className="hero-actions">
              <a href="/quiz" className="button button-primary">
                Подобрать репетитора
              </a>
              <p className="hero-note">Это бесплатно и ни к чему не обязывает.</p>
            </div>
            <p className="hero-mini">
              Пробный урок, понятная цена, оплата без переводов на карту.
            </p>
          </div>

          <div className="hero-visual">
            {/* SVG-иконка вместо заглушки */}
            <div className="hero-illustration" aria-hidden="true">
              <svg
                viewBox="0 0 160 110"
                className="hero-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="12"
                  y="20"
                  width="136"
                  height="70"
                  rx="10"
                  fill="#e0ecff"
                />
                <rect
                  x="22"
                  y="30"
                  width="70"
                  height="38"
                  rx="6"
                  fill="#2563eb"
                />
                <rect
                  x="100"
                  y="30"
                  width="35"
                  height="8"
                  rx="4"
                  fill="#ffffff"
                  opacity="0.9"
                />
                <rect
                  x="100"
                  y="44"
                  width="35"
                  height="8"
                  rx="4"
                  fill="#ffffff"
                  opacity="0.6"
                />
                <rect
                  x="100"
                  y="58"
                  width="28"
                  height="8"
                  rx="4"
                  fill="#ffffff"
                  opacity="0.4"
                />
                {/* Ребёнок */}
                <circle cx="40" cy="50" r="10" fill="#f97316" />
                <rect
                  x="32"
                  y="60"
                  width="16"
                  height="12"
                  rx="4"
                  fill="#fbbf24"
                />
                {/* Репетитор */}
                <circle cx="70" cy="50" r="10" fill="#34d399" />
                <rect
                  x="62"
                  y="60"
                  width="16"
                  height="12"
                  rx="4"
                  fill="#22c55e"
                />
                {/* Нижняя планка ноутбука */}
                <rect
                  x="40"
                  y="92"
                  width="80"
                  height="8"
                  rx="4"
                  fill="#cbd5f5"
                />
              </svg>
            </div>

            <div className="hero-card">
              <p className="hero-card-title">Подбор репетитора</p>
              <p className="hero-card-text">
                2 минуты на ответы — и вы получаете список из 8–12 подходящих
                преподавателей с ценами и свободными слотами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="section" id="how-it-works">
        <div className="container">
          <h2 className="section-title">Как это работает</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Квиз за 2 минуты</h3>
              <p className="step-text">
                Указываете класс, предмет, цель и удобное время — всё онлайн.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Подбор 8–12 репетиторов</h3>
              <p className="step-text">
                Смотрим опыт, стиль объяснения, отзывы и расписание преподавателей.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Выбор преподавателя</h3>
              <p className="step-text">
                Сразу видите цену, краткое описание, отзывы и свободные слоты.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Пробный урок</h3>
              <p className="step-text">
                Проверяете, как ребёнку с репетитором, и оцениваете уровень.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <h3 className="step-title">Регулярные занятия</h3>
              <p className="step-text">
                Онлайн-уроки, гибкий график, удобные отмены и оплата только за
                проведённые занятия — без пакетов и предоплат.
              </p>
            </div>
          </div>

          <div className="cta-inline">
            <p className="cta-inline-text">
              Готовы начать подбор? Это займёт пару минут.
            </p>
            <a href="/quiz" className="button button-primary">
              Подобрать репетитора
            </a>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="section section-alt" id="advantages">
        <div className="container">
          <h2 className="section-title">Почему родителям удобно пользоваться сервисом</h2>
          <div className="cards-grid">
            <div className="card card-accent">
              <h3 className="card-title">Преподаватель под характер ребёнка</h3>
              <p className="card-text">
                Спокойный, строгий, быстрый темп, больше практики или объяснений —
                подбираем формат, в котором ребёнку комфортно.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Проверенные репетиторы</h3>
              <p className="card-text">
                Проверяем образование, опыт и качество уроков у каждого преподавателя.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Точный подбор под цель</h3>
              <p className="card-text">
                Квиз → 8–12 подходящих специалистов вместо хаотичного поиска по объявлениям.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Прозрачные профили</h3>
              <p className="card-text">
                Сразу видно цену, опыт, отзывы и доступное расписание, без бесконечных переписок.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Онлайн-доска и конспекты</h3>
              <p className="card-text">
                Занятия проходят онлайн, после каждого урока остаётся конспект.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Оплата внутри сервиса</h3>
              <p className="card-text">
                Без переводов на карту и путаницы — все оплаты в одном месте.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Контроль прогресса</h3>
              <p className="card-text">
                Личный кабинет родителя и еженедельная сводка в WhatsApp.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Удобные отмены и замена репетитора</h3>
              <p className="card-text">
                Если формат не подошёл — подберём другого, будущие оплаты сохраняются.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ОТЛИЧИЯ ОТ ОНЛАЙН-ШКОЛ */}
      <section className="section" id="vs-schools">
        <div className="container">
          <h2 className="section-title">Чем наш формат отличается от онлайн-школ</h2>
          <div className="cards-grid cards-grid-2">
            <div className="card">
              <h3 className="card-title">Только индивидуальные уроки</h3>
              <p className="card-text">
                Преподаватель работает с одним ребёнком, а не с потоком.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Программа под ребёнка</h3>
              <p className="card-text">
                Можно менять темп и акценты по ходу года, а не идти по жёсткому курсу.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Гибкий график</h3>
              <p className="card-text">
                Вы выбираете удобное время и переносите занятия при необходимости.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Оплата за уроки, а не за пакеты</h3>
              <p className="card-text">
                Никаких подписок и обязательных пакетов на месяц вперёд.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Прямой контакт с преподавателем</h3>
              <p className="card-text">
                Все вопросы по учёбе обсуждаются сразу с репетитором, без “прослоек”.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Живой отчёт по прогрессу</h3>
              <p className="card-text">
                Виден реальный материал и темы, а не формальный отчёт раз в месяц.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ФОРМАТ И ПРЕДМЕТЫ */}
      <section className="section section-alt" id="formats">
        <div className="container formats-grid">
          <div>
            <h2 className="section-title">Формат занятий</h2>
            <ul className="list">
              <li>Индивидуальные онлайн-уроки 45–60 минут.</li>
              <li>Интенсивы перед контрольными и экзаменами.</li>
              <li>Диагностика и план на 4–8 недель.</li>
            </ul>
          </div>
          <div>
            <h2 className="section-title">Предметы</h2>
            <div className="chips">
              <span className="chip">Математика</span>
              <span className="chip">Русский</span>
              <span className="chip">Английский</span>
              <span className="chip">Физика</span>
              <span className="chip">Химия</span>
              <span className="chip">Биология</span>
              <span className="chip">Информатика</span>
              <span className="chip">ОГЭ / ЕГЭ</span>
            </div>
          </div>
        </div>
      </section>

      {/* КОМУ ПОДХОДИТ */}
      <section className="section" id="who-for">
        <div className="container">
          <h2 className="section-title">Кому подойдёт наш сервис</h2>
          <div className="cards-grid cards-grid-2">
            <div className="card">
              <h3 className="card-title">Ученикам 5–8 классов</h3>
              <p className="card-text">
                Нужно подтянуть предмет и снизить стресс с домашкой.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Девятиклассникам</h3>
              <p className="card-text">
                Подготовка к ОГЭ и закрытие пробелов перед старшей школой.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">10–11 класс</h3>
              <p className="card-text">
                Подготовка к ЕГЭ под целевые баллы и поступление.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Родителям, которым важен контроль</h3>
              <p className="card-text">
                Хочется понимать, что происходит на уроках и как идёт прогресс.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ УДОБНО И ВЫГОДНО */}
      <section className="section section-alt" id="benefits">
        <div className="container">
          <h2 className="section-title">Почему это удобно и выгодно</h2>
          <div className="benefits-grid">
            <ul className="list">
              <li>Экономия времени — подбор занимает несколько минут.</li>
              <li>Быстрый старт — часто можно начать уже в течение 1 дня.</li>
              <li>Оплата внутри сервиса — без переводов на карту.</li>
              <li>Только нужные уроки — оплачиваются только проведённые занятия.</li>
            </ul>
            <ul className="list">
              <li>Контроль прогресса — личный кабинет + сводка в WhatsApp.</li>
              <li>Конспекты после каждого урока — удобно повторять материал.</li>
              <li>Замена преподавателя без потерь по будущим урокам.</li>
              <li>Пробный урок — можно “проверить химию” без долгих обязательств.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ИСТОРИИ СЕМЕЙ */}
      <section className="section" id="stories">
        <div className="container">
          <h2 className="section-title">Истории семей</h2>
          <div className="cards-grid">
            <div className="card">
              <div className="case-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="case-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="8"
                    y="10"
                    width="48"
                    height="36"
                    rx="6"
                    fill="#e0ecff"
                  />
                  <polyline
                    points="14,32 26,24 36,30 50,20"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="14"
                    y1="40"
                    x2="26"
                    y2="40"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="card-title">Математика, 6 класс</h3>
              <p className="card-text">
                Было: 3 и слёзы над ДЗ. <br />
                Стало: 4–5 и самостоятельное выполнение заданий.
              </p>
            </div>
            <div className="card">
              <div className="case-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="case-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="10"
                    y="14"
                    width="44"
                    height="30"
                    rx="4"
                    fill="#e0ecff"
                  />
                  <rect
                    x="14"
                    y="18"
                    width="20"
                    height="4"
                    rx="2"
                    fill="#2563eb"
                  />
                  <rect
                    x="14"
                    y="26"
                    width="26"
                    height="3"
                    rx="1.5"
                    fill="#a5b4fc"
                  />
                  <rect
                    x="14"
                    y="32"
                    width="18"
                    height="3"
                    rx="1.5"
                    fill="#a5b4fc"
                  />
                  <circle cx="44" cy="32" r="6" fill="#22c55e" />
                </svg>
              </div>
              <h3 className="card-title">Русский язык, 9 класс (ОГЭ)</h3>
              <p className="card-text">
                Было: 17 баллов на диагностике. <br />
                Стало: 27–29 баллов на пробниках.
              </p>
            </div>
            <div className="card">
              <div className="case-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="case-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="8"
                    y="12"
                    width="48"
                    height="34"
                    rx="6"
                    fill="#e0ecff"
                  />
                  <polyline
                    points="14,38 26,30 34,34 50,24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="14"
                    y1="20"
                    x2="24"
                    y2="20"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="card-title">Профильная математика, 11 класс</h3>
              <p className="card-text">
                Было: 48 баллов. <br />
                Стало: 70+ после регулярных занятий.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* НАШИ ПРЕПОДАВАТЕЛИ */}
      <section className="section section-alt" id="tutors">
        <div className="container">
          <h2 className="section-title">Наши преподаватели</h2>
          <div className="tutors-grid">
            <div className="tutor-card">
              <div className="tutor-avatar-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="tutor-avatar-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="24" r="12" fill="#2563eb" />
                  <path
                    d="M16 46c2.5-7 8-11 16-11s13.5 4 16 11"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="tutor-name">Мария, математика</h3>
              <p className="tutor-meta">10 лет опыта, готовит к ОГЭ и ЕГЭ</p>
              <p className="tutor-text">
                Помогает выстроить понятную систему по предмету и убрать страх перед задачами.
              </p>
            </div>
            <div className="tutor-card">
              <div className="tutor-avatar-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="tutor-avatar-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="24" r="12" fill="#f97316" />
                  <path
                    d="M16 46c2.5-7 8-11 16-11s13.5 4 16 11"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="tutor-name">Алексей, русский</h3>
              <p className="tutor-meta">8 лет опыта, эксперт по сочинениям</p>
              <p className="tutor-text">
                Ученики подтягивают грамотность и уверенно сдают экзамены.
              </p>
            </div>
            <div className="tutor-card">
              <div className="tutor-avatar-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 64 64"
                  className="tutor-avatar-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="24" r="12" fill="#22c55e" />
                  <path
                    d="M16 46c2.5-7 8-11 16-11s13.5 4 16 11"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="tutor-name">Екатерина, английский</h3>
              <p className="tutor-meta">7 лет опыта, разговорная практика</p>
              <p className="tutor-text">
                Снимает языковой барьер, много разговорной практики на уроках.
              </p>
            </div>
          </div>
          <p className="section-note">
            На платформе — десятки проверенных репетиторов по школьным предметам.
          </p>
        </div>
      </section>

      {/* БЕЗОПАСНОСТЬ */}
      <section className="section safety" id="safety">
        <div className="container">
          <h2 className="section-title">Безопасность и качество</h2>
          <div className="cards-grid cards-grid-3">
            <div className="card">
              <h3 className="card-title">Проверка преподавателей</h3>
              <p className="card-text">
                Документы, опыт и тестовые уроки — перед стартом работы на платформе.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Безопасная оплата</h3>
              <p className="card-text">
                Все платежи проходят внутри сервиса, без личных переводов.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Материалы и история занятий</h3>
              <p className="card-text">
                Конспекты и пройденные темы всегда доступны в личном кабинете.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Понятные правила отмены</h3>
              <p className="card-text">
                Если предупредить заранее, урок переносится без потерь.
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Поддержка сервиса</h3>
              <p className="card-text">
                Поможем, если возник вопрос с уроком, оплатой или расписанием.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ДЛЯ РЕПЕТИТОРОВ */}
      <section className="section section-thin" id="for-tutors">
        <div className="container tutors-cta">
          <p className="tutors-cta-text">
            Вы онлайн-репетитор и хотите вести учеников 5–11 классов через платформу?
          </p>
          <a href="#tutor-form" className="button button-secondary">
            Стать репетитором
          </a>
        </div>
      </section>

      {/* ФИНАЛЬНЫЙ CTA */}
      <section className="section final-cta" id="final-cta">
        <div className="container final-cta-inner">
          <h2 className="final-cta-title">Начните подбор репетитора уже сегодня</h2>
          <p className="final-cta-text">
            Ответьте на 5–7 вопросов — мы подберём 8–12 подходящих преподавателей.
            Пробный онлайн-урок уже на этой неделе.
          </p>
          <a href="/quiz" className="button button-primary button-large">
            Подобрать репетитора
          </a>
          <p className="final-cta-note">
            В этой версии прототипа квиз открывается на отдельной странице.
          </p>
        </div>
      </section>
    </main>
  );
}
