import React from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import AllCkEditor from "../../App/components/AllCkEditor";
import Card from "../../App/components/MainCard";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.expId,
      keyOrder: props.keyOrder,
      label: props.label,
      taskId: props.taskId,
      compTypeId: props.compTypeId,
    };
    this.updateDelete = this.updateDelete.bind(this);

    console.log(this.state);
  }

  //Call delete task from pareant component(Components Table)
  updateDelete(value) {
    this.props.updateDelete(value);
  }
  render() {
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    let html = `<p>We are conducting the research aimed to improve user experience in interactive products (websites, mobile applications, etc.).</p><p>As users, you have probably encountered problems related to incorrect / inconvenient / unclear display of information on websites and apps. Thus, your opinion is very important to us.</p><p>Let's improve these interfaces together!</p><p>Please note: This is a completely anonymous survey, no identifying details about the respondents have are stored, and the results will be used for statistical analyzes only. You can stop answering the questionnaire at any stage.</p><p>&nbsp;</p><p>By clicking on the «Start button, I express my consent to participate in the study».</p><p>&nbsp;</p>`;

    if (this.props.lang === "1") {
      html = `<p>نجري بحثًا يهدف إلى تحسين تجربة المستخدم للأنظمة التفاعلية (مواقع الويب والتطبيقات وما إلى ذلك).</p><p>كمستخدمي مواقع الويب والتطبيقات المختلفة، من المحتمل أنكم واجهتم مشكلات تتعلق بالعرض الغير صحيح /غير ملائم /غير واضح للمعلومات على المواقع والأدوات العربية، لذا فإن رأيك مهم جدًا بالنسبة لنا.</p><p>لنقم بتحسين هذه الواجهات معًا!</p><p>يرجى ملاحظة ما يلي: هذا استطلاع مجهول الهوية تمامًا، ولن يتم الاحتفاظ بأي تفاصيل تعريفية عن المستجيبين وسيتم استخدام النتائج للتحليلات الإحصائية فقط. يمكنك التوقف عن الإجابة على الاستبانة في أي مرحلة.</p><p>من خلال النقر على زر "ابدأ"، أعبر عن موافقتي على المشاركة في الدراسة.</p>`;
    } else if (this.props.lang === "3") {
      html = `<h2>ברוכים הבאים!</h2><p>אנחנו מבצעים&nbsp;מחקר שמטרתו הינה&nbsp;שיפור חווית המשתמש של מערכות אינטראקטיביות (אתרים, אפליקציות וכו').</p><p>כמשתמשים אתם וודאי נתקלתם בבעיות הקשורות לתצוגה לא נכונה/ לא נוחה/ לא ברורה של המידע באתרים וביישומונים בעברית ולכן&nbsp;דעתכם חשובה לנו מאוד.</p><p>בואו נשפר ביחד את הממשקים הללו!​</p><p>לתשומת לבכם: מדובר בסקר&nbsp;אנונימי לגמרי,שום פרט מזהה לגבי המשיבים לא נשמר והתוצאות ישמשו לניתוחים סטטיסטיים בלבד. ניתן להפסיק לענות על השאלון בכל שלב.&nbsp;</p><p>בלחיצה על כפתור "להתחלה" אני מביע/ה את הסכמתי להשתתפות במחקר.</p><p>&nbsp;</p>
      `;
    } else if (this.props.lang === "4") {
      html = `<p>Мы проводим исследование, целью которого является улучшение&nbsp;опыта пользователей интерактивных продуктов (веб сайтов, приложений и т.д.).</p><p>Как пользователи, вы скорее всего сталкивались с проблемами некорректного, непонятного, не консистентного предоставления информации на сайтах и в приложениях, а потому Вашем мнение очень важно для нас. Мы предлагаем Вам вместе с нами изменить интерактивные продукты к лучшему!</p><p>&nbsp;</p><p>Обращаем ваше внимание: это полностью анонимное исследование, никакая идентифицирующая вас информация не будет сохранена, и результаты будут использованы только для статистического анализа. Вы можете закончить Ваше участие на любом этапе исследования.&nbsp;</p><p>&nbsp;</p><p>«Нажимая на кнопку «Начать исследование» Я соглашаюсь участвовать в исследовании.</p>
      `;
    }

    if (this.state.compTypeId === 11) {
      html = "";
    }
    return (
      <Aux>
        <Card title="Edit Page" isOption>
          {this.state.label === undefined ? (
            <AllCkEditor
              html={html}
              editor="classic"
              expId={this.state.id}
              keyOrder={this.state.keyOrder}
              compTypeId={this.state.compTypeId}
              is_add_picture_setting={this.props.is_add_picture_setting}
              is_direction_setting={this.props.is_direction_setting}
              is_new_page_setting={this.props.is_new_page_setting}
              is_required_setting={this.props.is_required_setting}
              delete={this.updateDelete}
            />
          ) : (
            <AllCkEditor
              html={this.state.label}
              editor="classic"
              expId={this.state.id}
              keyOrder={this.state.keyOrder}
              compTypeId={this.state.compTypeId}
              taskId={this.state.taskId}
              is_add_picture_setting={this.props.is_add_picture_setting}
              is_direction_setting={this.props.is_direction_setting}
              is_new_page_setting={this.props.is_new_page_setting}
              is_required_setting={this.props.is_required_setting}
              dir={this.props.dir}
              delete={this.updateDelete}
            />
          )}
        </Card>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultPath: state.defaultPath,
    collapseMenu: state.collapseMenu,
    layout: state.layout,
    fullWidthLayout: state.fullWidthLayout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);
