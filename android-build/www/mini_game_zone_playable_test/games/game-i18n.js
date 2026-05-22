(function(){
  const LANGS = ['vi','en','ko','ja','zh','my','th','id','ph','ne','hi'];
  const COMMON = {
    vi:{score:'Điểm',time:'Thời gian',level:'Cấp',lives:'Mạng',lines:'Dòng',ready:'Sẵn sàng?',start:'Bắt đầu chơi',retry:'Chơi lại',gameOver:'Game Over!',backTitle:'Quay lại danh sách game',soundTitle:'Bật/tắt âm thanh',controlsSnake:'Điều khiển rắn',levelPrefix:'CẤP',next:'TIẾP'},
    en:{score:'Score',time:'Time',level:'Level',lives:'Lives',lines:'Lines',ready:'Ready?',start:'Start game',retry:'Play again',gameOver:'Game Over!',backTitle:'Back to game list',soundTitle:'Sound on/off',controlsSnake:'Snake controls',levelPrefix:'LEVEL',next:'NEXT'},
    ko:{score:'점수',time:'시간',level:'레벨',lives:'목숨',lines:'줄',ready:'준비됐나요?',start:'게임 시작',retry:'다시 하기',gameOver:'게임 오버!',backTitle:'게임 목록으로 돌아가기',soundTitle:'소리 켜기/끄기',controlsSnake:'뱀 조작',levelPrefix:'레벨',next:'다음'},
    ja:{score:'スコア',time:'時間',level:'レベル',lives:'ライフ',lines:'ライン',ready:'準備OK？',start:'ゲーム開始',retry:'もう一度',gameOver:'ゲームオーバー！',backTitle:'ゲーム一覧に戻る',soundTitle:'音のオン/オフ',controlsSnake:'スネーク操作',levelPrefix:'レベル',next:'次'},
    zh:{score:'分数',time:'时间',level:'等级',lives:'生命',lines:'行数',ready:'准备好了吗？',start:'开始游戏',retry:'再玩一次',gameOver:'游戏结束！',backTitle:'返回游戏列表',soundTitle:'开启/关闭声音',controlsSnake:'贪吃蛇控制',levelPrefix:'等级',next:'下一个'},
    my:{score:'ရမှတ်',time:'အချိန်',level:'အဆင့်',lives:'အသက်',lines:'လိုင်း',ready:'အသင့်ဖြစ်ပြီလား?',start:'စတင်ကစား',retry:'ထပ်ကစား',gameOver:'ဂိမ်းပြီးပါပြီ!',backTitle:'ဂိမ်းစာရင်းသို့ ပြန်သွားရန်',soundTitle:'အသံ ဖွင့်/ပိတ်',controlsSnake:'မြွေ ထိန်းချုပ်မှု',levelPrefix:'အဆင့်',next:'နောက်'},
    th:{score:'คะแนน',time:'เวลา',level:'ระดับ',lives:'ชีวิต',lines:'แถว',ready:'พร้อมไหม?',start:'เริ่มเล่น',retry:'เล่นอีกครั้ง',gameOver:'จบเกม!',backTitle:'กลับไปหน้ารายการเกม',soundTitle:'เปิด/ปิดเสียง',controlsSnake:'ควบคุมงู',levelPrefix:'ระดับ',next:'ถัดไป'},
    id:{score:'Skor',time:'Waktu',level:'Level',lives:'Nyawa',lines:'Baris',ready:'Siap?',start:'Mulai main',retry:'Main lagi',gameOver:'Game Over!',backTitle:'Kembali ke daftar game',soundTitle:'Suara on/off',controlsSnake:'Kontrol ular',levelPrefix:'LEVEL',next:'BERIKUTNYA'},
    ph:{score:'Score',time:'Oras',level:'Level',lives:'Buhay',lines:'Lines',ready:'Handa na?',start:'Simulan',retry:'Maglaro ulit',gameOver:'Game Over!',backTitle:'Bumalik sa listahan ng game',soundTitle:'Buksan/isara ang tunog',controlsSnake:'Kontrol ng ahas',levelPrefix:'LEVEL',next:'SUSUNOD'},
    ne:{score:'अंक',time:'समय',level:'स्तर',lives:'जीवन',lines:'लाइन',ready:'तयार?',start:'खेल सुरु',retry:'फेरि खेल्नुहोस्',gameOver:'खेल सकियो!',backTitle:'खेल सूचीमा फर्कनुहोस्',soundTitle:'आवाज खोल्ने/बन्द गर्ने',controlsSnake:'सर्प नियन्त्रण',levelPrefix:'स्तर',next:'अर्को'},
    hi:{score:'स्कोर',time:'समय',level:'स्तर',lives:'जान',lines:'लाइनें',ready:'तैयार?',start:'खेल शुरू करें',retry:'फिर खेलें',gameOver:'गेम ओवर!',backTitle:'गेम सूची पर वापस जाएं',soundTitle:'आवाज चालू/बंद',controlsSnake:'सांप नियंत्रण',levelPrefix:'स्तर',next:'अगला'}
  };
  const GAME = {
    snake:{
      vi:{title:'Anime Snake',intro:'Ăn ngọc năng lượng để đạt điểm cao nhất.',over:'Bạn đạt {score} điểm trong {time}.',level1:'CẤP 1 - TỐC ĐỘ',level2:'CẤP 2 - LỬA',level3:'CẤP 3 - BÀN TAY',level4:'CẤP 4 - VẬT CẢN',level5:'CẤP 5 - TỔNG HỢP'},
      en:{title:'Anime Snake',intro:'Eat energy gems and chase the highest score.',over:'You scored {score} points in {time}.',level1:'LEVEL 1 - SPEED',level2:'LEVEL 2 - FIRE',level3:'LEVEL 3 - HANDS',level4:'LEVEL 4 - MOVING BLOCKS',level5:'LEVEL 5 - ALL HAZARDS'},
      ko:{title:'애니 스네이크',intro:'에너지 보석을 먹고 최고 점수에 도전하세요.',over:'{time} 동안 {score}점을 기록했습니다.',level1:'레벨 1 - 속도',level2:'레벨 2 - 불',level3:'레벨 3 - 손',level4:'레벨 4 - 장애물',level5:'레벨 5 - 종합'},
      ja:{title:'アニメスネーク',intro:'エネルギー宝石を食べて最高スコアを目指しましょう。',over:'{time}で{score}点を獲得しました。',level1:'レベル1 - スピード',level2:'レベル2 - 炎',level3:'レベル3 - 手',level4:'レベル4 - 障害物',level5:'レベル5 - 総合'},
      zh:{title:'动漫贪吃蛇',intro:'吃掉能量宝石，冲击最高分。',over:'你在 {time} 内获得 {score} 分。',level1:'等级1 - 速度',level2:'等级2 - 火焰',level3:'等级3 - 手掌',level4:'等级4 - 障碍物',level5:'等级5 - 综合'},
      my:{title:'Anime Snake',intro:'အမြင့်ဆုံးရမှတ်ရရန် energy gem များကို စားပါ။',over:'{time} အတွင်း {score} မှတ် ရရှိခဲ့သည်။',level1:'အဆင့် 1 - အမြန်နှုန်း',level2:'အဆင့် 2 - မီး',level3:'အဆင့် 3 - လက်',level4:'အဆင့် 4 - အတားအဆီး',level5:'အဆင့် 5 - အားလုံး'},
      th:{title:'งูอนิเมะ',intro:'กินอัญมณีพลังงานเพื่อทำคะแนนสูงสุด',over:'คุณได้ {score} คะแนนใน {time}',level1:'ระดับ 1 - ความเร็ว',level2:'ระดับ 2 - ไฟ',level3:'ระดับ 3 - มือ',level4:'ระดับ 4 - สิ่งกีดขวาง',level5:'ระดับ 5 - รวมทั้งหมด'},
      id:{title:'Anime Snake',intro:'Makan permata energi untuk meraih skor tertinggi.',over:'Kamu meraih {score} poin dalam {time}.',level1:'LEVEL 1 - KECEPATAN',level2:'LEVEL 2 - API',level3:'LEVEL 3 - TANGAN',level4:'LEVEL 4 - RINTANGAN',level5:'LEVEL 5 - GABUNGAN'},
      ph:{title:'Anime Snake',intro:'Kainin ang energy gems para makuha ang pinakamataas na score.',over:'Nakakuha ka ng {score} puntos sa loob ng {time}.',level1:'LEVEL 1 - BILIS',level2:'LEVEL 2 - APOY',level3:'LEVEL 3 - KAMAY',level4:'LEVEL 4 - HARANG',level5:'LEVEL 5 - LAHAT'},
      ne:{title:'Anime Snake',intro:'सबैभन्दा उच्च अंकका लागि ऊर्जा रत्न खानुहोस्।',over:'तपाईंले {time} मा {score} अंक बनाउनुभयो।',level1:'स्तर 1 - गति',level2:'स्तर 2 - आगो',level3:'स्तर 3 - हात',level4:'स्तर 4 - अवरोध',level5:'स्तर 5 - सबै'},
      hi:{title:'Anime Snake',intro:'सबसे ज्यादा स्कोर के लिए ऊर्जा रत्न खाएँ।',over:'आपने {time} में {score} अंक बनाए।',level1:'स्तर 1 - गति',level2:'स्तर 2 - आग',level3:'स्तर 3 - हाथ',level4:'स्तर 4 - बाधा',level5:'स्तर 5 - सब'}
    },
    bird:{
      vi:{title:'Anime Bird',intro:'Chạm màn hình để bay lên. Bay qua khe cột để ghi điểm.',over:'Bạn đạt {score} điểm trong {time}.'},
      en:{title:'Anime Bird',intro:'Tap to fly up. Pass through pipe gaps to score.',over:'You scored {score} points in {time}.'},
      ko:{title:'애니 버드',intro:'탭해서 날아오르고 파이프 사이를 지나 점수를 얻으세요.',over:'{time} 동안 {score}점을 기록했습니다.'},
      ja:{title:'アニメバード',intro:'タップして上昇し、柱の隙間を通ってスコアを稼ぎましょう。',over:'{time}で{score}点を獲得しました。'},
      zh:{title:'动漫小鸟',intro:'点击向上飞，穿过霓虹柱间隙得分。',over:'你在 {time} 内获得 {score} 分。'},
      my:{title:'Anime Bird',intro:'အပေါ်သို့ ပျံရန် ထိပါ။ တိုင်ကြားကွက်များကို ဖြတ်ပြီး ရမှတ်ယူပါ။',over:'{time} အတွင်း {score} မှတ် ရရှိခဲ့သည်။'},
      th:{title:'นกอนิเมะ',intro:'แตะเพื่อบินขึ้น ผ่านช่องเสาเพื่อทำคะแนน',over:'คุณได้ {score} คะแนนใน {time}'},
      id:{title:'Anime Bird',intro:'Ketuk untuk terbang naik. Lewati celah pipa untuk mendapat skor.',over:'Kamu meraih {score} poin dalam {time}.'},
      ph:{title:'Anime Bird',intro:'I-tap para lumipad. Dumaan sa pagitan ng pipes para makakuha ng puntos.',over:'Nakakuha ka ng {score} puntos sa loob ng {time}.'},
      ne:{title:'Anime Bird',intro:'माथि उडाउन ट्याप गर्नुहोस्। पाइपको खाली ठाउँ पार गरेर अंक लिनुहोस्।',over:'तपाईंले {time} मा {score} अंक बनाउनुभयो।'},
      hi:{title:'Anime Bird',intro:'ऊपर उड़ने के लिए टैप करें। पाइप के बीच से निकलकर स्कोर करें।',over:'आपने {time} में {score} अंक बनाए।'}
    },
    brick:{
      vi:{title:'Anime Brick Breaker',intro:'Kéo thanh đỡ để hứng bóng và phá hết các viên gạch neon.',over:'Bạn đạt {score} điểm ở cấp {level}.'},
      en:{title:'Anime Brick Breaker',intro:'Drag the paddle to catch the ball and break every neon brick.',over:'You scored {score} points at level {level}.'},
      ko:{title:'애니 벽돌깨기',intro:'패들을 움직여 공을 받고 네온 벽돌을 모두 깨세요.',over:'레벨 {level}에서 {score}점을 기록했습니다.'},
      ja:{title:'アニメブロック崩し',intro:'パドルを動かしてボールを受け、ネオンブロックを全部壊しましょう。',over:'レベル{level}で{score}点を獲得しました。'},
      zh:{title:'动漫打砖块',intro:'拖动挡板接住球，击碎所有霓虹砖块。',over:'你在等级 {level} 获得 {score} 分。'},
      my:{title:'Anime Brick Breaker',intro:'ဘောလုံးကို ဖမ်းရန် paddle ကို ဆွဲပြီး neon brick များအားလုံး ဖျက်ပါ။',over:'အဆင့် {level} တွင် {score} မှတ် ရရှိခဲ့သည်။'},
      th:{title:'เกมทำลายอิฐอนิเมะ',intro:'ลากแป้นรับลูกบอลและทำลายอิฐนีออนทั้งหมด',over:'คุณได้ {score} คะแนนที่ระดับ {level}'},
      id:{title:'Anime Brick Breaker',intro:'Geser paddle untuk menangkap bola dan hancurkan semua brick neon.',over:'Kamu meraih {score} poin di level {level}.'},
      ph:{title:'Anime Brick Breaker',intro:'Igalaw ang paddle para saluhin ang bola at basagin ang lahat ng neon bricks.',over:'Nakakuha ka ng {score} puntos sa level {level}.'},
      ne:{title:'Anime Brick Breaker',intro:'बल समात्न प्याडल सार्नुहोस् र सबै नियन इँटा फोड्नुहोस्।',over:'तपाईंले स्तर {level} मा {score} अंक बनाउनुभयो।'},
      hi:{title:'Anime Brick Breaker',intro:'बॉल पकड़ने के लिए पैडल चलाएँ और सभी नीयॉन ईंटें तोड़ें।',over:'आपने स्तर {level} पर {score} अंक बनाए।'}
    },
    tetris:{
      vi:{title:'Anime Tetris',intro:'Xếp khối để lấp đầy dòng. Đủ dòng sẽ lên cấp và rơi nhanh hơn.',over:'Bạn đạt {score} điểm, xóa {lines} dòng.'},
      en:{title:'Anime Tetris',intro:'Stack blocks to fill lines. Clear enough lines to level up and speed up.',over:'You scored {score} points and cleared {lines} lines.'},
      ko:{title:'애니 테트리스',intro:'블록을 쌓아 줄을 채우세요. 줄을 지우면 레벨이 오르고 더 빨라집니다.',over:'{score}점, {lines}줄을 지웠습니다.'},
      ja:{title:'アニメテトリス',intro:'ブロックを積んでラインを埋めましょう。ラインを消すとレベルが上がり速くなります。',over:'{score}点、{lines}ラインを消しました。'},
      zh:{title:'动漫俄罗斯方块',intro:'堆叠方块填满行，消除足够行数后升级并加速。',over:'你获得 {score} 分，消除了 {lines} 行。'},
      my:{title:'Anime Tetris',intro:'လိုင်းများပြည့်ရန် block များ စီပါ။ လိုင်းများဖျက်ပြီး အဆင့်တက်နိုင်သည်။',over:'{score} မှတ် ရပြီး {lines} လိုင်း ဖျက်နိုင်ခဲ့သည်။'},
      th:{title:'เตตริสอนิเมะ',intro:'วางบล็อกให้เต็มแถว ลบแถวเพื่อเพิ่มระดับและความเร็ว',over:'คุณได้ {score} คะแนน ลบได้ {lines} แถว'},
      id:{title:'Anime Tetris',intro:'Susun blok untuk memenuhi baris. Hapus cukup baris untuk naik level dan makin cepat.',over:'Kamu meraih {score} poin dan menghapus {lines} baris.'},
      ph:{title:'Anime Tetris',intro:'I-stack ang blocks para mapuno ang lines. Mag-clear ng sapat na lines para mag-level up.',over:'Nakakuha ka ng {score} puntos at nag-clear ng {lines} lines.'},
      ne:{title:'Anime Tetris',intro:'लाइन भर्न ब्लक मिलाउनुहोस्। पर्याप्त लाइन हटाएपछि स्तर बढ्छ र गति बढ्छ।',over:'तपाईंले {score} अंक बनाउनुभयो र {lines} लाइन हटाउनुभयो।'},
      hi:{title:'Anime Tetris',intro:'लाइन भरने के लिए ब्लॉक जमाएँ। पर्याप्त लाइन हटाने पर स्तर और गति बढ़ेगी।',over:'आपने {score} अंक बनाए और {lines} लाइनें हटाईं।'}
    },
    shooter:{
      vi:{title:'Anime Shooter',intro:'Phi thuyền tự bắn. Bạn chỉ cần điều khiển sang trái/phải để né đạn và tiêu diệt quái neon.',over:'Bạn đạt {score} điểm ở cấp {level}.'},
      en:{title:'Anime Shooter',intro:'The ship fires automatically. Move left/right to dodge bullets and defeat neon enemies.',over:'You scored {score} points at level {level}.'},
      ko:{title:'애니 슈터',intro:'우주선은 자동으로 발사합니다. 좌우로 움직여 탄막을 피하고 적을 처치하세요.',over:'레벨 {level}에서 {score}점을 기록했습니다.'},
      ja:{title:'アニメシューター',intro:'宇宙船は自動で攻撃します。左右に動いて弾を避け、ネオンの敵を倒しましょう。',over:'レベル{level}で{score}点を獲得しました。'},
      zh:{title:'动漫射击',intro:'飞船会自动射击，你只需左右移动躲避子弹并击败霓虹怪。',over:'你在等级 {level} 获得 {score} 分。'},
      my:{title:'Anime Shooter',intro:'ယာဉ်သည် အလိုအလျောက် ပစ်ခတ်သည်။ ဘယ်/ညာ ရွှေ့ပြီး ကျည်ရှောင်ကာ neon ရန်သူများကို ဖျက်ပါ။',over:'အဆင့် {level} တွင် {score} မှတ် ရရှိခဲ့သည်။'},
      th:{title:'เกมยิงอนิเมะ',intro:'ยานยิงอัตโนมัติ คุณเพียงขยับซ้าย/ขวาเพื่อหลบกระสุนและกำจัดศัตรูนีออน',over:'คุณได้ {score} คะแนนที่ระดับ {level}'},
      id:{title:'Anime Shooter',intro:'Pesawat menembak otomatis. Gerakkan kiri/kanan untuk menghindari peluru dan kalahkan musuh neon.',over:'Kamu meraih {score} poin di level {level}.'},
      ph:{title:'Anime Shooter',intro:'Awtomatikong pumuputok ang ship. Gumanalaw pakaliwa/pakanan para umiwas sa bala at talunin ang neon enemies.',over:'Nakakuha ka ng {score} puntos sa level {level}.'},
      ne:{title:'Anime Shooter',intro:'जहाजले आफैं गोली चलाउँछ। गोली छल्न र नियन दुश्मन हराउन बाँया/दायाँ सार्नुहोस्।',over:'तपाईंले स्तर {level} मा {score} अंक बनाउनुभयो।'},
      hi:{title:'Anime Shooter',intro:'जहाज अपने-आप गोली चलाता है। गोलियों से बचने और नीयॉन दुश्मन हराने के लिए बाएँ/दाएँ चलें।',over:'आपने स्तर {level} पर {score} अंक बनाए।'}
    }
  };
  const params = new URLSearchParams(location.search);
  const selected = params.get('lang') || 'vi';
  const lang = LANGS.includes(selected) ? selected : 'vi';
  const game = document.documentElement.dataset.game || params.get('game') || '';
  function fmt(text, subs){
    let out = String(text || '');
    if(subs) Object.keys(subs).forEach(k => { out = out.replaceAll('{'+k+'}', subs[k]); });
    return out;
  }
  function t(key, subs){
    const common = COMMON[lang] || COMMON.vi;
    const base = GAME[game] && (GAME[game][lang] || GAME[game].vi);
    const text = (base && base[key]) || common[key] || key;
    return fmt(text, subs);
  }
  function apply(){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-game-i18n]').forEach(el => { el.textContent = t(el.dataset.gameI18n); });
    document.querySelectorAll('[data-game-i18n-title]').forEach(el => { el.setAttribute('title', t(el.dataset.gameI18nTitle)); });
    document.querySelectorAll('[data-game-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.gameI18nAria)); });
    document.title = t('title');
  }
  window.gameLang = lang;
  window.gt = t;
  window.applyGameI18n = apply;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
