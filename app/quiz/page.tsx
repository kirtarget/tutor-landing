export default function QuizPage() {
  return (
    <main className="page">
      <section className="section">
        <div className="container quiz">
          <h1 className="quiz-title">Подбор репетитора</h1>
          <p className="quiz-subtitle">
            Ответьте на вопросы ниже, чтобы мы могли подобрать подходящих репетиторов.
            Сейчас это прототип — отправка ответов пока не работает.
          </p>

          <form className="quiz-form">
            <div className="form-group">
              <label className="form-label">Класс ребёнка</label>
              <select className="form-control">
                <option>5 класс</option>
                <option>6 класс</option>
                <option>7 класс</option>
                <option>8 класс</option>
                <option>9 класс</option>
                <option>10 класс</option>
                <option>11 класс</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Предмет</label>
              <select className="form-control">
                <option>Математика</option>
                <option>Русский язык</option>
                <option>Английский язык</option>
                <option>Физика</option>
                <option>Химия</option>
                <option>Биология</option>
                <option>Информатика</option>
                <option>Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Цель занятий</label>
              <select className="form-control">
                <option>Подтянуть текущие оценки</option>
                <option>Подготовка к ОГЭ</option>
                <option>Подготовка к ЕГЭ</option>
                <option>Закрыть пробелы по предмету</option>
                <option>Углублённое изучение</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Текущая ситуация</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Например: &quot;Математика на 3, много стресса из-за домашки, боимся контрольных&quot;."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Какой стиль преподавателя вам ближе?</label>
              <div className="form-options">
                <label className="form-option">
                  <input type="radio" name="style" />
                  <span>Спокойный, поддерживающий</span>
                </label>
                <label className="form-option">
                  <input type="radio" name="style" />
                  <span>Строгий, требовательный</span>
                </label>
                <label className="form-option">
                  <input type="radio" name="style" />
                  <span>Больше практики и задач</span>
                </label>
                <label className="form-option">
                  <input type="radio" name="style" />
                  <span>Больше объяснений и примеров</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Когда удобно заниматься?</label>
              <div className="form-options">
                <label className="form-option">
                  <input type="checkbox" />
                  <span>Будни — днём</span>
                </label>
                <label className="form-option">
                  <input type="checkbox" />
                  <span>Будни — вечером</span>
                </label>
                <label className="form-option">
                  <input type="checkbox" />
                  <span>Выходные</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Как с вами связаться? (заглушка)</label>
              <input
                className="form-control"
                placeholder="Телефон или WhatsApp (пока не отправляется)"
              />
            </div>

            <button
              type="button"
              className="button button-primary button-large quiz-button-disabled"
              disabled
            >
              Отправка будет доступна на следующем этапе
            </button>

            <p className="quiz-note">
              Сейчас это только прототип опросника. На следующем шаге сюда добавим отправку
              ответов и реальный подбор репетитора.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
