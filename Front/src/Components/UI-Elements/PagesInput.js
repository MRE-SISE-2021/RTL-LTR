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
    console.log(this.state);
  }

  render() {
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    let html = `<h3>New Page! </h3>
        <figure class="image image-style-side">
           
            <figcaption>Medieval Old Town square, destroyed in 1944 & rebuilt after WWII.</figcaption>
        </figure>
        <p>If you enjoyed my previous articles in which we discussed wandering around <a href={DEMO.BLANK_LINK} target="_blank" rel="noopener">Copenhagen</a> and <a href={DEMO.BLANK_LINK} target="_blank" rel="noopener">Vilnius</a>, you’ll definitely love exploring <a href="https://en.wikipedia.org/wiki/Warsaw" target="_blank" rel="noopener">Warsaw</a>.</p>
        <h3>Time to put comfy sandals on!</h3>
        <p>Best time to visit the city is July and August, when it’s cool enough to not break a sweat and hot enough to enjoy summer. The city which has quite a combination of both old and modern textures is located by the river of Vistula.</p>`;

    if (this.props.lang === "1") {
      html = `<p>نجري بحثًا يهدف إلى تحسين تجربة المستخدم للأنظمة التفاعلية (مواقع الويب والتطبيقات وما إلى ذلك).</p><p>كمستخدمي مواقع الويب والتطبيقات المختلفة، من المحتمل أنكم واجهتم مشكلات تتعلق بالعرض الغير صحيح /غير ملائم /غير واضح للمعلومات على المواقع والأدوات العربية، لذا فإن رأيك مهم جدًا بالنسبة لنا.</p><p>لنقم بتحسين هذه الواجهات معًا!</p><p>يرجى ملاحظة ما يلي: هذا استطلاع مجهول الهوية تمامًا، ولن يتم الاحتفاظ بأي تفاصيل تعريفية عن المستجيبين وسيتم استخدام النتائج للتحليلات الإحصائية فقط. يمكنك التوقف عن الإجابة على الاستبانة في أي مرحلة.</p><p>من خلال النقر على زر "ابدأ"، أعبر عن موافقتي على المشاركة في الدراسة.</p>`;
    } else if (this.props.lang === "3") {
      html = `<h2>ברוכים הבאים!</h2><p>אנחנו מבצעים&nbsp;מחקר שמטרתו הינה&nbsp;שיפור חווית המשתמש של מערכות אינטראקטיביות (אתרים, אפליקציות וכו').</p><p>כמשתמשים אתם וודאי נתקלתם בבעיות הקשורות לתצוגה לא נכונה/ לא נוחה/ לא ברורה של המידע באתרים וביישומונים בעברית ולכן&nbsp;דעתכם חשובה לנו מאוד.</p><p>בואו נשפר ביחד את הממשקים הללו!​</p><p>לתשומת לבכם: מדובר בסקר&nbsp;אנונימי לגמרי,שום פרט מזהה לגבי המשיבים לא נשמר והתוצאות ישמשו לניתוחים סטטיסטיים בלבד. ניתן להפסיק לענות על השאלון בכל שלב.&nbsp;</p><p>בלחיצה על כפתור "להתחלה" אני מביע/ה את הסכמתי להשתתפות במחקר.</p><p>&nbsp;</p>
      `;
    } else if (this.props.lang === "4") {
      html = `<p>Мы проводим исследование, целью которого является улучшение&nbsp;опыта пользователей интерактивных продуктов (веб сайтов, приложений и т.д.).</p><p>Как пользователи, вы скорее всего сталкивались с проблемами некорректного, непонятного, не консистентного предоставления информации на сайтах и в приложениях, а потому Вашем мнение очень важно для нас. Мы предлагаем Вам вместе с нами изменить интерактивные продукты к лучшему!</p><p>&nbsp;</p><p>Обращаем ваше внимание: это полностью анонимное исследование, никакая идентифицирующая вас информация не будет сохранена, и результаты будут использованы только для статистического анализа. Вы можете закончить Ваше участие на любом этапе исследования.&nbsp;</p><p>&nbsp;</p><p>«Нажимая на кнопку «Начать исследование» Я соглашаюсь участвовать в исследовании.</p>
      `;
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
