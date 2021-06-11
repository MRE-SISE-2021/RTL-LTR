function getLangAge(lang) {
  switch (lang) {
    case 1:
      return "هل أخطأت في ادخال عمرك؟ إذا لم يكن كذلك، يرجى الاتصال بنا";
    case 2:
      return " Could it be that you made a mistake in entering your age? If not - please contact us";
    case 3:
      return "יכול להיות שטעית בהזנת גילך? אם לא - מבקשים ליצור קשר איתנו";
    case 4:
      return "У тебя есть аккаунт? Если у вас его нет, свяжитесь с нами.";
    default:
      return "2";
  }
}

function getLangPage(lang) {
  switch (lang) {
    case 1:
      return ["صفحه", "من"];
    case 2:
      return ["Page", "from"];
    case 3:
      return ["עמוד", "מתוך"];
    case 4:
      return ["Страница", "из"];
    default:
      return "2";
  }
}

function getLangError(lang) {
  switch (lang) {
    case 1:
      return "!تأكد من إجابتك على جميع الأسئلة أعلاه";
    case 2:
      return "Make sure you answered all the questions above!";
    case 3:
      return "! וודא כי ענית על כל השאלות לעיל";
    case 4:
      return "Убедитесь, что ответили на все вопросы!";
    default:
      return "2";
  }
}
function getLangStart(lang) {
  switch (lang) {
    case 1:
      return "ابدأ";
    case 2:
      return "Start";
    case 3:
      return "להתחלה";
    case 4:
      return "Начать исследование";
    default:
      return "2";
  }
}
function getLangNext(lang) {
  switch (lang) {
    case 1:
      return "اكمل";
    case 2:
      return "Next";
    case 3:
      return "המשך";
    case 4:
      return "Далее";
    default:
      return "2";
  }
}
function getLangFinish(lang) {
  switch (lang) {
    case 1:
      return "انهاء";
    case 2:
      return "Finish";
    case 3:
      return "לסיום";
    case 4:
      return "Закончить";
    default:
      return "2";
  }
}

////////////////////////////////////////////////////////////////////////////
class GetByLang {
  getLangAge(lang) {
    return getLangAge(lang);
  }
  getLangPage(lang) {
    return getLangPage(lang);
  }
  getLangError(lang) {
    return getLangError(lang);
  }
  getLangFinish(lang) {
    return getLangFinish(lang);
  }

  getLangNext(lang) {
    return getLangNext(lang);
  }

  getLangStart(lang) {
    return getLangStart(lang);
  }
}
export default new GetByLang();
