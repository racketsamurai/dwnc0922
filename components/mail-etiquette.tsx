const guidance = [
  {
    number: "01",
    title: "첫 문장은 ‘요청’보다 ‘나’를 밝힙니다.",
    body: "교수님은 많은 학생의 메일을 받습니다. 메일을 시작할 때는 ‘안녕하세요’ 다음에 수강 과목, 소속, 이름을 적어 상대가 발신자를 바로 알아볼 수 있게 하는 편이 좋습니다. ‘[과목명]을 수강 중인 [학과] [이름]입니다’ 정도면 충분합니다. 학생의 사정을 길게 설명하기 전에, 누가 어떤 수업과 관련해 연락했는지를 먼저 밝혀 두면 이후의 요청도 훨씬 또렷하게 읽힙니다.",
  },
  {
    number: "02",
    title: "정중함은 낮추는 말보다 정확한 말에서 나옵니다.",
    body: "‘죄송하지만 꼭 해주시면 안 될까요’처럼 여러 번 몸을 낮추는 표현은 오히려 요청을 흐릴 수 있습니다. 필요한 일은 한 문장으로 분명히 적고, 가능 여부를 교수님께 남겨 두세요. ‘가능하시다면 검토해 주실 수 있을지 여쭙습니다’, ‘정해진 절차가 있다면 따르겠습니다’처럼 요청과 선택권을 함께 두는 표현이 담담하고 공손합니다.",
  },
  {
    number: "03",
    title: "사유는 필요한 만큼만, 사실대로 적습니다.",
    body: "결석이나 일정 변경의 이유를 설명할 때는 감정이나 사생활을 길게 늘어놓을 필요가 없습니다. 날짜, 수업, 필요한 조치만 선명하면 됩니다. 확인이 필요한 서류가 있다면 제출 의사를 덧붙이고, 사후에 보완할 학습 계획을 한 줄로 적어 주세요. 이 메일의 목표는 상황을 설득력 있게 ‘증명’하는 것이 아니라, 상대가 판단하는 데 필요한 정보를 빠짐없이 전달하는 데 있습니다.",
  },
  {
    number: "04",
    title: "성적은 ‘변경’보다 ‘확인’을 먼저 요청합니다.",
    body: "성적 관련 메일은 특히 조심스럽습니다. 결과를 바꿔 달라는 말로 시작하기보다, 평가 기준이나 본인의 부족했던 지점을 확인하고 싶다고 문의하는 편이 안전합니다. ‘제가 확인해 볼 부분이 있는지 여쭙고 싶습니다’라는 태도는 교수님의 평가권을 존중하면서도, 학생이 필요한 설명을 받을 여지를 만듭니다. 이의제기 절차가 있다면 그 절차를 따르겠다고 밝히는 것도 좋습니다.",
  },
  {
    number: "05",
    title: "마지막에는 상대의 시간을 돌려드립니다.",
    body: "교수님께 보내는 메일은 짧고 읽기 쉬워야 합니다. 한 문단에 한 가지 정보만 두고, 제출 기한이나 첨부 문서처럼 놓치면 안 되는 내용은 앞쪽에 배치하세요. 끝에는 ‘바쁘신 와중에 검토해 주셔서 감사합니다’처럼 시간을 내 준 데 대한 감사를 적습니다. ‘감사합니다. [이름] 드림’으로 마무리하면 충분합니다. 과한 수식어보다 정확한 정보와 편한 문단 구성이 가장 좋은 예의입니다.",
  },
];

const asides: Record<number, { title: string; body: string }> = {
  1: {
    title: "늦은 밤의 ‘보내기’ 버튼",
    body: "술기운에 보낸 메일을 발견했다면, 당황한 마음으로 긴 변명 메일을 연달아 보내지는 마세요. 다음날 필요한 사실만 차분히 정리해 한 통으로 정정하면 됩니다. ‘어젯밤 메일 중 표현이 적절하지 못한 부분이 있어 다시 연락드립니다’ 정도면 충분합니다. 메일도 숙취처럼, 물을 많이 마신다고 바로 해결되지는 않습니다.",
  },
  3: {
    title: "교수님도 사람입니다",
    body: "교수님도 회의가 있고, 마감이 있고, 답장을 놓치는 날이 있습니다. 답이 늦다고 같은 내용을 여러 통 보내기보다 며칠의 여유를 두고 한 번만 정중히 확인해 보세요. 빠른 답장을 요구하지 않는 태도는 오히려 메일의 신뢰를 높입니다.",
  },
};

export function MailEtiquette() {
  return (
    <section className="etiquette-section" aria-labelledby="etiquette-title">
      <div className="paper-divider" aria-hidden="true"><Image src="/drill-paper-divider.png" alt="" width={2172} height={724} sizes="(max-width: 780px) 100vw, 780px" /></div>
      <header className="etiquette-header">
        <p className="eyebrow">MAIL MANNERS / NOTE</p>
        <h2 id="etiquette-title">교수님께 드리는 메일의<br />기본은 담담함입니다.</h2>
        <p>한 번 더 공손하게, 그러나 과장하지 않게. 요청을 분명히 전하기 위한 다섯 가지 기준입니다.</p>
      </header>
      <div className="etiquette-list">
        {guidance.map((item, index) => <div key={item.number}>
          <article className="etiquette-item">
            <div className="etiquette-index"><span>{item.number}</span>{index < guidance.length - 1 && <b aria-hidden="true" />}</div>
            <div><h3>{item.title}</h3><p>{item.body}</p></div>
          </article>
          {asides[index] && <aside className="etiquette-aside"><span aria-hidden="true" /><div><p className="eyebrow">SIDE NOTE</p><h3>{asides[index].title}</h3><p>{asides[index].body}</p></div></aside>}
        </div>)}
      </div>
      <div className="etiquette-closing"><span className="small-hole" aria-hidden="true" /><p>좋은 메일은 나를 작게 만드는 글이 아니라, 상대가 편하게 답할 수 있도록 정보를 정리한 글입니다.</p></div>
    </section>
  );
}
import Image from "next/image";
