import React from 'react';
import {
  Computer,
  TrendingUp,
  Science,
  LocalHospital,
  Whatshot,
  EmojiEvents,
  Share
} from '@mui/icons-material';
import LogoImage from '../assets/Logo_Newscoon.png';

// --- ICONS ---
export const LogoIcon = ({ sx, ...props }) => (
    <img
        src={LogoImage}
        alt="Newscoon Logo"
        style={{
            width: '100%',
            height: '100%',
            maxWidth: '48px',
            maxHeight: '48px',
            objectFit: 'contain',
            objectPosition: 'center',
            borderRadius: '4px',
            display: 'block',
            ...sx
        }}
        {...props}
    />
);


export const TeknolojiBadgeIcon = () => React.createElement(Computer);
export const EkonomiBadgeIcon = () => React.createElement(TrendingUp);
export const BilimBadgeIcon = () => React.createElement(Science);
export const SaglikBadgeIcon = () => React.createElement(LocalHospital);
export const FlameIcon = () => React.createElement(Whatshot);
export const AchievementIcon = () => React.createElement(EmojiEvents);
export const ShareIcon = () => React.createElement(Share);

// --- DATA ---
export const allBadges = [
    {
      id: 'teknoloji',
      name: 'Teknoloji Uzmanı',
      description: 'Teknoloji kategorisindeki ilk haberini okudun.',
      icon: React.createElement(TeknolojiBadgeIcon),
      color: '#3B82F6'
    },
    {
      id: 'ekonomi',
      name: 'Finans Gurusu',
      description: 'Ekonomi kategorisindeki ilk haberini okudun.',
      icon: React.createElement(EkonomiBadgeIcon),
      color: '#10B981'
    },
    {
      id: 'bilim',
      name: 'Bilim Kaşifi',
      description: 'Bilim kategorisindeki ilk haberini okudun.',
      icon: React.createElement(BilimBadgeIcon),
      color: '#8B5CF6'
    },
    {
      id: 'saglik',
      name: 'Sağlık Elçisi',
      description: 'Sağlık kategorisindeki ilk haberini okudun.',
      icon: React.createElement(SaglikBadgeIcon),
      color: '#EF4444'
    },
];

export const heroSlides = [
    {
        id: 1,
        imageUrl: 'https://picsum.photos/seed/news1/800/600',
        superTitle: 'SON DAKİKA',
        title: 'YAPAY ZEKA DEVRİMİ',
        subtitle: 'Global Teknoloji Zirvesi, çığır açan yapay zeka gelişmelerini duyurdu',
        category: 'teknoloji',
        summary: "Global Teknoloji Zirvesi, 'Prometheus' adlı yeni bir sinir ağı mimarisiyle yapay zeka alanında devrim yarattı. Bu teknoloji, daha az veri ve enerjiyle öğrenerek otonom araçlardan tıbba kadar birçok alanda çığır açma potansiyeli taşıyor.",
        content: [
            { title: "Zirvenin Gündemi Belirleyen Duyuruları", paragraph: "Silikon Vadisi'nin kalbinde düzenlenen ve teknoloji dünyasının nefesini tutarak takip ettiği Yıllık Global Teknoloji Zirvesi, bu yıl yapay zeka alanında adeta bir paradigma kayması yaratan bir dizi çarpıcı duyuruyla sona erdi. Dünyanın dört bir yanından gelen binlerce mühendis, araştırmacı ve yatırımcı, insanlığın geleceğini şekillendirecek bu yeni teknolojilere ilk elden tanıklık etti. Zirvenin kapanış konuşmasında, yapay zekanın sadece bir otomasyon aracı olmaktan çıkıp yaratıcı bir ortak haline geldiği vurgulandı." },
            { title: "Prometheus: Yeni Nesil Sinir Ağı Mimarisi", paragraph: "Zirvenin en çok konuşulan olayı, 'Prometheus' adı verilen devrim niteliğindeki yeni sinir ağı mimarisinin tanıtımı oldu. Mevcut modellere kıyasla on kat daha az veriyle ve çok daha düşük enerji tüketimiyle karmaşık görevlerde ustalaşabilen Prometheus, benzeri görülmemiş bir öğrenme verimliliği sergiliyor." },
            { title: "Sektör Liderlerinden Gelecek Öngörüleri", paragraph: "Teknoloji devlerinin CEO'ları ve önde gelen risk sermayedarları, Prometheus mimarisinin getireceği potansiyel konusunda oldukça heyecanlı. Otonom araçların kaza oranlarını sıfıra yaklaştırmaktan, kişiselleştirilmiş tıp sayesinde kanser gibi hastalıkların erken teşhisine kadar geniş bir yelpaskede devrim yaratması bekleniyor." },
            { title: "Etik ve Sorumluluk Ön Planda", paragraph: "Yapay zekanın gücü arttıkça, beraberinde getirdiği etik sorumluluklar da zirvenin ana gündem maddelerinden biriydi. Teknolojinin kötüye kullanılmasını önlemek ve toplumsal faydayı en üst düzeye çıkarmak amacıyla, sektörün önde gelen şirketleri bir araya gelerek 'Yapay Zeka Etik Konsorsiyumu'nu kurduklarını duyurdu." }
        ],
        quiz: {
            question: "'Prometheus' yapay zeka mimarisinin en çığır açıcı özelliği nedir?",
            options: ["Daha fazla veriyle öğrenmesi", "Daha az enerji tüketmesi"],
            correctAnswerIndex: 1,
            bonusXp: 50
        }
    },
    {
        id: 2,
        imageUrl: 'https://picsum.photos/seed/news2/800/600',
        superTitle: 'DÜNYA',
        title: 'EKONOMİDE ŞOK DALGA',
        subtitle: 'Piyasalar beklenmedik faiz artırımına tepki gösterdi',
        category: 'ekonomi',
        summary: "Piyasaları sarsan sürpriz bir faiz artırımı kararı, küresel borsalarda sert düşüşlere yol açtı. Analistler, bu adımın enflasyonu kontrol altına alabileceğini ancak resesyon riskini de artırdığını belirtiyor.",
        content: [
            { title: "Piyasaları Sarsan Sürpriz Faiz Kararı", paragraph: "Küresel finans piyasaları, haftaya büyük bir çalkantıyla başladı. Aylardır süregelen yüksek enflasyonist baskılar ve artan tüketici fiyat endeksi verileri karşısında, Merkez Bankası'nın piyasa beklentilerinin aksine 50 baz puanlık sürpriz bir faiz artırımı duyurması, yatırımcılar arasında adeta bir şok etkisi yarattı." },
            { title: "Piyalarda Domino Etkisi", paragraph: "Kararın hemen ardından Asya piyasaları sert düşüşlerle açıldı ve bu negatif hava Avrupa ve Amerika seanslarına da yayıldı. Özellikle teknoloji ve büyüme odaklı hisseler, borçlanma maliyetlerindeki artışın gelecekteki kârlılıklarını olumsuz etkileyeceği endişesiyle çift haneli kayıplar yaşadı." },
            { title: "Ekonomik Beklentiler ve Analist Yorumları", paragraph: "Analistler, bankanın bu 'şahin' duruşunun kısa vadede enflasyonu dizginlemeye yardımcı olabileceğini, ancak aynı zamanda ekonomiyi bir resesyona sürükleme riskini de önemli ölçüde artırdığını belirtiyor. Ünlü ekonomist Dr. Helen Shaw, 'Bu, ip üzerinde yürümeye benziyor. Enflasyonu kontrol altına almaya çalışırken, ekonominin büyüme motorunu durdurma riskiyle karşı karşıyasınız,' yorumunda bulundu." }
        ],
        quiz: {
            question: "Habere göre, Merkez Bankası'nın sürpriz kararı piyasaları nasıl etkiledi?",
            options: ["Hisselerde rekor artış yaşandı", "Teknoloji hisselerinde sert düşüşler oldu"],
            correctAnswerIndex: 1,
            bonusXp: 45
        }
    },
    {
        id: 3,
        imageUrl: 'https://picsum.photos/seed/news3/800/600',
        superTitle: 'BİLİM',
        title: 'YAŞANABİLİR GEZEGEN',
        subtitle: 'Sıvı suya sahip olma potansiyeli olan yeni bir ötegezegen keşfedildi',
        category: 'bilim',
        summary: "James Webb Uzay Teleskobu, Dünya'ya benzer büyüklükte ve yaşanabilir bölgede yer alan Kepler-186f ötegezegeninin atmosferinde su buharı izleri tespit etti. Bu, yaşam potansiyeli için önemli bir adım olarak görülüyor.",
        content: [
            { title: "James Webb Teleskobu'ndan Tarihi Onay", paragraph: "Gökbilimciler, insanlığın evrendeki yerini sorgulatan tarihi bir keşfe imza attı. NASA'nın James Webb Uzay Teleskobu'nu (JWST) kullanan uluslararası bir araştırma ekibi, daha önce aday olarak gösterilen Kepler-186f adlı ötegezegenin varlığını doğruladı ve atmosferik verilerini ilk kez analiz etti." },
            { title: "Kepler-186f'nin Büyüleyici Özellikleri", paragraph: "Bizden yaklaşık 500 ışık yılı uzaklıkta, Kuğu takımyıldızında yer alan Kepler-186f, Dünya'nın yaklaşık 1.5 katı büyüklüğünde bir 'Süper Dünya' olarak sınıflandırılıyor. Güneş'ten daha küçük ve soğuk olan bir kırmızı cüce yıldızın yörüngesinde dönüyor." },
            { title: "Sıvı Su ve Yaşam Potansiyeli", paragraph: "JWST'den elde edilen ön spektral veriler, gezegenin atmosferinde su buharı izlerine işaret ediyor. Bu, Kepler-186f'nin yüzeyinde okyanusların, göllerin veya nehirlerin bulunabileceği ihtimalini güçlendiriyor." },
            { title: "Gelecek Gözlemler ve Biyolojik İmzalar", paragraph: "Bilim insanları şimdi teleskop zamanını daha verimli kullanarak Kepler-186f'nin atmosferini daha detaylı incelemeyi planlıyor. Önümüzdeki aylarda yapılacak gözlemlerle, metan ve oksijen gibi canlı organizmalar tarafından üretilebilecek gazların, yani 'biyolojik imzaların' varlığı araştırılacak." }
        ],
        quiz: {
            question: "Keşfedilen Kepler-186f gezezeninin atmosferinde hangi önemli ize rastlandı?",
            options: ["Oksijen", "Su buharı"],
            correctAnswerIndex: 1,
            bonusXp: 60
        }
    },
    {
        id: 4,
        imageUrl: 'https://picsum.photos/seed/news4/800/600',
        superTitle: 'SAĞLIK',
        title: 'EVRENSEL AŞI UMUDU',
        subtitle: 'Bilim insanları yeni evrensel aşı denemeleri konusunda iyimser',
        category: 'saglik',
        summary: "Tüm grip türlerine ve gelecekteki pandemilere karşı koruma sağlaması hedeflenen evrensel bir grip aşısı, insan denemelerinin son aşamasına geçti. Başarılı olursa, yıllık aşı ihtiyacı ortadan kalkabilir.",
        content: [
            { title: "Aşı Teknolojisinde Yeni Bir Çağ", paragraph: "Tıp dünyasında heyecanla beklenen bir gelişme yaşandı. Onlarca yıldır süren araştırmaların doruk noktası olarak kabul edilen evrensel bir grip aşısı adayı, insan denemelerinin son ve en kritik aşaması olan Faz 3'e geçti." },
            { title: "Virüsün Zayıf Noktasını Hedefleyen Tasarım", paragraph: "Geleneksel grip aşıları, virüsün her yıl değişen yüzey proteinlerine odaklandığı için etkinlikleri sınırlı kalabiliyor. Bu yeni aşı ise, virüsün 'hemagglutinin sapı' olarak bilinen ve mutasyon oranı çok düşük olan stabil bir bölümünü hedef alıyor." },
            { title: "Toplum Sağlığı Üzerindeki Potansiyel Etkileri", paragraph: "Eğer denemeler başarılı olursa, bu aşının halk sağlığı üzerindeki etkileri muazzam olacak. Her yıl tekrarlanan mevsimsel grip aşılarına olan ihtiyaç ortadan kalkabilir ve tek bir doz veya birkaç dozluk bir kür, yıllarca süren bir bağışıklık sağlayabilir." },
            { title: "Sonuçlar İçin Geri Sayım Başladı", paragraph: "Dünya genelinde 30.000 gönüllünün katıldığı Faz 3 denemeleri, aşının etkinliğini ve güvenliğini kesin olarak belirlemeyi amaçlıyor. Sağlık otoriteleri ve araştırmacılar, süreci temkinli bir iyimserlikle takip ediyor." }
        ],
        quiz: {
            question: "Yeni evrensel grip aşısı, virüsün hangi bölümünü hedef almaktadır?",
            options: ["Sürekli değişen yüzey proteinlerini", "Mutasyon oranı düşük iç kısımlarını"],
            correctAnswerIndex: 1,
            bonusXp: 55
        }
    },
];

export const featuredNews = [
    { id: 1, category: 'Teknoloji', summary: 'Yeni nesil yapay zeka modelleri, insan zekasını aşan yetenekler sergiliyor ve teknoloji dünyasında yeni bir çağ başlatıyor.' },
    { id: 2, category: 'Finans', summary: 'Beklenmedik faiz artırımı kararı sonrası piyasalarda dalgalanma yaşanırken, uzmanlar ekonominin geleceği hakkında ikiye bölündü.' },
    { id: 3, category: 'Bilim', summary: 'Gökbilimciler, Dünya\'ya benzerliğiyle heyecan yaratan ve yüzeyinde sıvı su bulundurma potansiyeli olan yeni bir gezegen keşfetti.' },
    { id: 4, category: 'Sağlık', summary: 'Evrensel grip aşısı denemeleri son aşamaya geçti. Başarılı olursa, yıllık aşı ihtiyacı ortadan kalkabilir ve salgınlara karşı koruma sağlayabilir.' },
];

// --- GAMIFICATION CONSTANTS ---
export const levelThresholds = [
  0, 100, 250, 500, 750, 1000, 1500, 2000, 2750, 3500, 4500, 5500, 7000, 8500, 10000, 12000, 14000, 16000, 18500, 21000, 24000, 27000, 30000, 34000, 38000, 42000
];

export const allAchievements = [
    {
        id: 'beginner_reader',
        name: 'İlk Adım',
        description: 'İlk haberini tamamla.',
        icon: React.createElement(LogoIcon),
        isCompleted: ({ readArticles }) => readArticles.length >= 1
    },
    {
        id: 'curious_mind',
        name: 'Meraklı Zihin',
        description: 'Tüm kategorilerden en az bir haber oku.',
        icon: React.createElement(BilimBadgeIcon),
        isCompleted: ({ badges }) => badges.length >= 4
    },
    {
        id: 'streak_starter',
        name: 'Ateşi Yaktın',
        description: '3 günlük okuma serisine ulaş.',
        icon: React.createElement(FlameIcon),
        isCompleted: ({ streak }) => streak >= 3
    },
    {
        id: 'xp_hoarder',
        name: 'Puan Avcısı',
        description: 'Toplamda 1000 XP kazan.',
        icon: React.createElement(EkonomiBadgeIcon),
        isCompleted: ({ totalXp }) => totalXp >= 1000
    },
];

export const leaderboardData = [
    { id: 1, name: 'Kripto Kaşifi', xp: 7850, level: 12 },
    { id: 2, name: 'Veri Vandalı', xp: 7600, level: 12 },
    { id: 3, name: 'Siber Sultan', xp: 7120, level: 11 },
    { id: 4, name: 'Sen', xp: 0, level: 1, isCurrentUser: true },
    { id: 5, name: 'Algoritma Avcısı', xp: 6540, level: 10 },
    { id: 6, name: 'Piksel Profesörü', xp: 6110, level: 10 },
    { id: 7, name: 'Kod Kaptanı', xp: 5890, level: 9 },
];

export const categoryColors = {
  teknoloji: '#3B82F6',
  ekonomi: '#10B981',
  bilim: '#8B5CF6',
  saglik: '#EF4444'
};

export const mockNews = [
  {
    id: 1,
    title: 'Yapay Zeka Teknolojisi Geleceği Şekillendiriyor',
    description: 'Yapay zeka teknolojilerindeki son gelişmeler, insan yaşamını köklü bir şekilde değiştirmeye devam ediyor. Uzmanlar, önümüzdeki 10 yıl içinde büyük dönüşümler bekleniyor.',
    category: 'teknoloji',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    publishedAt: '2024-01-15T10:30:00Z',
    source: 'TechNews'
  },
  {
    id: 2,
    title: 'Sporda Tarihi Başarı: Milli Takım Şampiyon',
    description: 'Milli takımımız uzun yıllar sonra uluslararası arenada büyük bir başarıya imza attı. Bu zafer, spor tarihimizde önemli bir dönüm noktası olarak kayıtlara geçti.',
    category: 'spor',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop',
    publishedAt: '2024-01-15T14:20:00Z',
    source: 'SportHaber'
  },
  {
    id: 3,
    title: 'Ekonomide Yeni Dönem: Büyük Yatırımlar Geliyor',
    description: 'Ülke ekonomisinde yeni bir dönem başlıyor. Büyük ölçekli yatırım projeleri ile birlikte istihdam oranlarında da önemli artışlar bekleniyor.',
    category: 'ekonomi',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    publishedAt: '2024-01-15T16:45:00Z',
    source: 'EkonoHaber'
  }
];
