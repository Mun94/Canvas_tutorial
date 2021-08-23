const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');

let dataCount = 0;
let resCount  = 0;
let reqCount  = 0;
let beforeSec = 0 ;
class Color {
    constructor() {

        this.background = '#303437'; // 배경 색

        this.nor        = '#4D8BD5'; // 정상 색
        this.war        = '#B8A605'; // 경고 색
        this.cri        = '#B40E0A'; // 심각 색
        this.gradation  = 'rgba(38, 36, 28, 0.5)';//'#26241C' // 그라데이션 색
 
        this.basicFont  = '#C6C9CD'; // 기본 폰트 색
 
        this.basicLine  = '#C6C9CD'; // 라인 색
    };
};
const colorData = new Color();
class TimeCondition {
    constructor(data) {
        this.norCondition = data.colorByRuntime >= 1 && data.colorByRuntime <= 3;
        this.warCondition = data.colorByRuntime > 3 && data.colorByRuntime <= 5;
        this.criCondition = data.colorByRuntime > 5  && data.colorByRuntime <= 10;
    };
};
const timeCondition = data => new TimeCondition(data);
class Position {
    constructor(aniPosition) {
        this.canvasW     = canvas.width;
        this.canvasH     = canvas.height;

        this.bulletPathY = 240;

        this.reqX        = this.canvasW / 3;
        this.excuX       = this.canvasW * ( 2 / 3 );

        this.startY      = 120;
        this.startX      = 0;

        if(aniPosition) {
            // 에니메이션 수행에 필요한 조건
            this.arcDiameter = 15;

            this.area        = this.canvasW / 3; // left; mid; right 구역 당 width
            this.tailSize    = 150;

            this.reqEndX     = this.reqX - this.arcDiameter;
            this.excuStartX  = this.reqX + this.arcDiameter;
            this.excuEndY    = this.canvasH - this.arcDiameter;
            this.resStartX   = this.excuX + this.arcDiameter
        };
    };
};

class FontPosition extends Position {
    constructor() {
        const needAniPosition = false;
        super(needAniPosition);

        this.startRectX    = 0;
        this.startRectY    = 0;

        this.lineTick      = 1;

        // 글자 영역에 공통으로 필요한 조건
        this.countTitleGap = 60;

        // req 글자 위치
        this.totalCountX   = 70; 
        this.totalFontY    = 80;
        this.reqCountX     = 130;
        this.reqFontY      = 170;

        // excu 글자 위치
        this.excuFontY     = 80;
        this.norWarCriGap  = 150;

        this.norCountX     = (this.canvasW / 3) + 20;
        this.warCountX     = this.norCountX + this.norWarCriGap;
        this.criCountX     = this.warCountX + this.norWarCriGap;

        // res 글자 위치
        this.resCountX     = this.canvasW * ( 3 / 4);
        this.redFontY      = 170;
    };
};
class SetDatas extends Position{
    constructor(){
        const needAniPosition = true;
        super(needAniPosition);

        const dataPerSec = 20; // 1 초 당 20 개
        const sec        = 0.2; // 0.2 초

        this.datas       = [];
        this.dataPerReq  = dataPerSec * sec; // 0.2초 마다 발생 할 요청에 생성 될 데이터 수

        reqCount         = dataPerSec;
    };

    addDatas(){
        const speed = (this.area / (60 * ((Number(Math.random().toFixed(1)) || 0.1)))) / 5; // 한 번에 생성되는 4개의 데이터가 모두 같은 속도 임 각각 속도 랜덤하게 할거면 반복문 안으로!
 
        for(let i = 0; i < this.dataPerReq; i++) {
            const runtime = Math.ceil(Math.random() * 10); // 0.1 ~ 1초
            this.datas.push({
                colorByRuntime: runtime,
                runtime,

                speed,
                x             : this.startX,
                y             : this.bulletPathY,
            });
        };
    };
};
const setDatas = new SetDatas();

class Background extends FontPosition{
    constructor(){
        super();
    };

    render() {
        ctx.fillStyle = colorData.background; // 배경 색
        ctx.fillRect(this.startRectX, this.startRectY, this.canvasW, this.canvasH);
    
        ctx.beginPath();

        this.line();

        this.reqCount();
        this.excuCount();
        this.resCount();

        ctx.stroke();
    };

    line() {
        ctx.lineWidth   = this.lineTick;
        ctx.strokeStyle = colorData.basicLine;

        ctx.moveTo(this.reqX     , this.startY);
        ctx.lineTo(this.reqX     , this.canvasH);
        ctx.moveTo(this.excuX    , this.startY);
        ctx.lineTo(this.excuX    , this.canvasH);
        ctx.moveTo(this.startX   , this.bulletPathY);
        ctx.lineTo(this.reqX     , this.bulletPathY);
        ctx.moveTo(this.excuX    , this.bulletPathY);
        ctx.lineTo(this.canvasW  , this.bulletPathY);
    };

    reqCount() {
        const totalCount = this.count().nor + this.count().war + this.count().cri;

        ctx.font = '30px Arial';

        ctx.fillStyle = colorData.basicFont;
        ctx.fillText('현재 전체 건수', this.totalCountX + this.countTitleGap + 13, this.totalFontY);

        ctx.font = '45px Arial';

        ctx.fillText(totalCount, this.totalCountX, this.totalFontY);
        
        ctx.font = '25px Arial';

        ctx.fillText('요청/초', this.reqCountX, this.reqFontY);
        ctx.fillText(reqCount, this.reqCountX - this.countTitleGap, this.reqFontY);

    };

    excuCount() {
        ctx.font = '25px Arial';

        ctx.fillStyle = colorData.basicFont;
        ctx.fillText('정상', this.norCountX + this.countTitleGap, this.excuFontY);
        ctx.fillText('경고', this.warCountX + this.countTitleGap, this.excuFontY);
        ctx.fillText('심각', this.criCountX + this.countTitleGap, this.excuFontY);

        ctx.font = 'bold 35px Arial';

        ctx.fillStyle = colorData.nor;
        ctx.fillText(this.count().nor, this.norCountX, this.excuFontY);
        ctx.fillStyle = colorData.war;
        ctx.fillText(this.count().war, this.warCountX, this.excuFontY);
        ctx.fillStyle = colorData.cri;
        ctx.fillText(this.count().cri, this.criCountX, this.excuFontY);
    };

    resCount() {
        ctx.font = '25px Arial';

        ctx.fillStyle = colorData.basicFont;
        ctx.fillText('응답/초', this.resCountX, this.redFontY);
        ctx.fillText(resCount, this.resCountX + (this.countTitleGap * 3), this.redFontY);
    };

    count() {
        const nor = (dataCount || []).filter(data => 
                timeCondition(data).norCondition
            ).length;

        const war = (dataCount || []).filter(data => 
                timeCondition(data).warCondition
            ).length;
        
        const cri = (dataCount || []).filter(data => 
                timeCondition(data).criCondition
            ).length;
        
        return { nor, war, cri };
    };
};
const background = new Background();

const init = () => {
    const second = (new Date()).getSeconds(); 
    const milliseconds = (new Date()).getMilliseconds();

    if(beforeSec !== second) {
        animation.excuteRuntime();
    };
    beforeSec = second;
    
    if(milliseconds % 200 <= 17 && milliseconds % 200 > 0) {
        animation.addDatas();
    };

    background.render();
    animation.render();

    requestAnimationFrame(init);
};

init();