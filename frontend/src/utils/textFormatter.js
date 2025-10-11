// Metin formatlaması için utility fonksiyonları

/**
 * Ham haber metnini zenginleştirilmiş JSX/HTML formatına dönüştürür
 * @param {string} rawNewstext - Ham haber metni
 * @returns {string} - Formatlanmış JSX/HTML dizesi
 */
export const formatNewsForJSX = (rawNewstext) => {
  if (!rawNewstext) return '';

  // Kural P5: Resim etiketlerini temizle
  let textToProcess = rawNewstext.replace(/\[\/uploads\/userFiles.*?\]/g, '').trim();
  
  // Paragrafları ayır
  const paragraphs = textToProcess.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);
  
  const formattedOutput = [];
  let normalParagraphCount = 0;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const isQuote = paragraph.startsWith('>');
    
    // Kural P2: Blockquote (Alıntı) İşleme
    if (isQuote) {
      let content = paragraph.substring(1).trim();
      
      // Kural P3: Vurgulama (Blockquote içinde de)
      content = applyAdvancedEmphasis(content);
      
      formattedOutput.push(`<blockquote class="quote-box">${content}</blockquote>`);
    }
    // Standart Paragraf İşleme
    else {
      let pContent = paragraph;
      
      // Kural P3: Vurgulama
      pContent = applyAdvancedEmphasis(pContent);
      
      // Kural P1: Paragrafı sar
      formattedOutput.push(`<p class="news-paragraph">${pContent}</p>`);
      normalParagraphCount++;
      
      // Kural P4: Bölüm Ayırıcı (Her 2 normal paragrafta bir)
      if (normalParagraphCount % 2 === 0 && i < paragraphs.length - 1) {
        formattedOutput.push('<hr class="paragraph-divider" />');
      }
    }
  }
  
  return formattedOutput.join('');
};

/**
 * Gelişmiş vurgulama sistemi - Genişletilmiş anahtar kelime havuzu
 * @param {string} content - İçerik metni
 * @returns {string} - Vurgulanmış metin
 */
const applyAdvancedEmphasis = (content) => {
  // Kategorize edilmiş anahtar kelime havuzu
  const emphasisCategories = {
    // Kişiler/Makamlar
    people: [
      'Cumhurbaşkanı', 'Bakan', 'MİT Başkanı', 'Sadettin Saran', 'Emine Erdoğan', 
      'Numan Kurtulmuş', 'Trump', 'Netanyahu', 'Sisi', 'Barzani', 'Yılmaz', 
      'Uraloğlu', 'Fidan', 'Karahan', 'Kurum', 'Özbek', 'Çelik', 'Güler'
    ],
    // Kurum/Teşkilatlar
    institutions: [
      'TBMM', 'AFAD', 'Türk Kızılay', 'DMM', 'MİT', 'TFF', 'YSK', 'PTT', 'TÜİK',
      'IMF', 'Dünya Bankası', 'UEFA', 'Hamas', 'İsrail', 'AB', 'NATO', 
      'Türk Devletleri Teşkilatı', 'TDT', 'AK Parti', 'CHP', 'İBB'
    ],
    // Finans/Ekonomi
    finance: [
      'BIST 100', 'dolar', 'altın', 'reel getiri', 'enflasyon', 'faiz', 
      'ihracat', 'ithalat', 'milyar lira', 'milyon dolar', 'rekor', 'rezerv'
    ],
    // Olaylar/Kavramlar
    events: [
      'Gazze', 'ateşkes', 'soykırım', 'saldırı', 'Küresel Sumud Filosu', 
      'Özgürlük Filosu', 'deprem', 'kriz', 'Karadeniz', 'operasyon', 
      'YHT', '5G', 'yapay zeka', 'seçim', 'uluslararası', 'teknoloji'
    ]
  };
  
  let emphasizedContent = content;
  
  // Tüm kategorilerdeki kelimeleri vurgula
  Object.values(emphasisCategories).flat().forEach(word => {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    emphasizedContent = emphasizedContent.replace(regex, `<b>${word}</b>`);
  });
  
  return emphasizedContent;
};

/**
 * Eski vurgulama fonksiyonu (geriye dönük uyumluluk için)
 * @param {string} content - İçerik metni
 * @returns {string} - Vurgulanmış metin
 */
const applyEmphasis = (content) => {
  const emphasisWords = [
    'Cumhurbaşkanı', 'Bakan', 'FIFA', 'TCMB', 'Selahattin',
    'Başkan', 'Genel Müdür', 'Bakanlık', 'Kurum', 'Organizasyon',
    'Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa',
    'Ekonomi', 'Spor', 'Siyaset', 'Teknoloji', 'Sağlık'
  ];
  
  let emphasizedContent = content;
  
  emphasisWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    emphasizedContent = emphasizedContent.replace(regex, `<b>${word}</b>`);
  });
  
  return emphasizedContent;
};

/**
 * Metindeki özel karakterleri ve formatları tespit eder (Eski fonksiyon - geriye dönük uyumluluk için)
 * @param {string} text - Formatlanacak metin
 * @returns {Array} - Formatlanmış parçalar array'i
 */
export const formatNewsText = (text) => {
  if (!text) return [];

  const parts = [];
  let remainingText = text;
  let partIndex = 0;

  // Twitter linklerini tespit et
  const twitterLinkRegex = /(https?:\/\/t\.co\/[^\s]+|https?:\/\/twitter\.com\/[^\s]+|pic\.twitter\.com\/[^\s]+)/g;
  
  // Resim linklerini tespit et
  const imageLinkRegex = /(\[\/uploads\/[^\]]+\])/g;
  
  // Kategori başlıklarını tespit et (Ekonomi:, Diplomasi:, Spor: gibi)
  const categoryRegex = /^([A-Za-zçğıöşüÇĞIİÖŞÜ]+:)/gm;
  
  // Sayısal verileri tespit et (milyon, milyar, yıl, vs.)
  const numberRegex = /(\d+[\s]*[a-zA-ZçğıöşüÇĞIİÖŞÜ]+)/g;
  
  // Tırnak içindeki metinleri tespit et
  const quoteRegex = /("[^"]+")/g;
  
  // Özel karakterleri tespit et
  const specialCharRegex = /([@#][a-zA-Z0-9_]+)/g;

  // Metni parçalara ayır
  const allMatches = [];
  
  // Tüm regex'leri birleştir
  const combinedRegex = new RegExp([
    twitterLinkRegex.source,
    imageLinkRegex.source,
    categoryRegex.source,
    numberRegex.source,
    quoteRegex.source,
    specialCharRegex.source
  ].join('|'), 'g');

  let match;
  while ((match = combinedRegex.exec(remainingText)) !== null) {
    allMatches.push({
      type: 'match',
      content: match[0],
      start: match.index,
      end: match.index + match[0].length,
      matchType: getMatchType(match[0])
    });
  }

  // Matches'leri sırala
  allMatches.sort((a, b) => a.start - b.start);

  // Metni parçalara ayır
  let lastIndex = 0;
  
  for (const match of allMatches) {
    // Match öncesi metin
    if (match.start > lastIndex) {
      parts.push({
        type: 'text',
        content: remainingText.slice(lastIndex, match.start)
      });
    }
    
    // Match
    parts.push({
      type: match.matchType,
      content: match.content
    });
    
    lastIndex = match.end;
  }
  
  // Son kısım
  if (lastIndex < remainingText.length) {
    parts.push({
      type: 'text',
      content: remainingText.slice(lastIndex)
    });
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

/**
 * Match tipini belirler
 */
const getMatchType = (content) => {
  if (content.includes('t.co') || content.includes('twitter.com') || content.includes('pic.twitter.com')) {
    return 'twitter-link';
  }
  if (content.includes('/uploads/')) {
    return 'image-link';
  }
  if (content.match(/^[A-Za-zçğıöşüÇĞIİÖŞÜ]+:$/)) {
    return 'category';
  }
  if (content.match(/^\d+[\s]*[a-zA-ZçğıöşüÇĞIİÖŞÜ]+$/)) {
    return 'number';
  }
  if (content.startsWith('"') && content.endsWith('"')) {
    return 'quote';
  }
  if (content.startsWith('@') || content.startsWith('#')) {
    return 'special-char';
  }
  return 'text';
};

/**
 * Zengin formatlama için CSS stilleri - Oyunlaştırılmış Mizanpaj
 */
export const richTextStyles = {
  // Ana Metin Biçimlendirme
  '.news-paragraph': {
    marginBottom: '1.25rem', // Paragraflar arası biraz daha az boşluk
    textAlign: 'justify',
    lineHeight: 1.7,
    fontSize: '1.1rem',
    '& b': {
      color: 'primary.main',
      fontWeight: 'bold',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }
  },
  
  // Blockquote Stili (Dinamik Kutu)
  '.quote-box': {
    border: '1px solid #4CAF50', // Yeşil çerçeve
    borderRadius: '8px',
    padding: '15px 25px',
    margin: '1.5rem 0',
    backgroundColor: 'rgba(76, 175, 80, 0.15)', // Hafif yeşil arka plan
    fontStyle: 'italic',
    color: '#E0E0E0', // Açık renkli metin
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', // Hafif gölge
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '"❝"',
      position: 'absolute',
      top: '-10px',
      left: '10px',
      fontSize: '5rem',
      color: 'rgba(76, 175, 80, 0.3)',
      lineHeight: 0.5,
      zIndex: 0
    },
    '& b': {
      color: '#4CAF50',
      fontWeight: 'bold'
    }
  },
  
  // Bölüm Ayırıcı (Gölge efekti)
  '.paragraph-divider': {
    border: 0,
    height: '2px',
    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0), #FFD700, rgba(255, 255, 255, 0))', // Altın renkli akış
    margin: '2rem 0',
    opacity: 0.5
  }
};

/**
 * Stil objeleri (Eski sistem - geriye dönük uyumluluk için)
 */
export const textStyles = {
  'twitter-link': {
    display: 'inline-block',
    backgroundColor: 'rgba(29, 161, 242, 0.1)',
    color: '#1da1f2',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.85em',
    textDecoration: 'none',
    border: '1px solid rgba(29, 161, 242, 0.2)',
    margin: '0 2px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(29, 161, 242, 0.2)',
      textDecoration: 'underline'
    }
  },
  
  'image-link': {
    display: 'inline-block',
    backgroundColor: 'rgba(108, 117, 125, 0.1)',
    color: '#6c757d',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.85em',
    border: '1px solid rgba(108, 117, 125, 0.2)',
    margin: '0 2px',
    fontStyle: 'italic'
  },
  
  'category': {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    color: '#007bff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.9em',
    fontWeight: 'bold',
    border: '1px solid rgba(0, 123, 255, 0.3)',
    margin: '0 4px 0 0'
  },
  
  'number': {
    display: 'inline-block',
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    color: '#28a745',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.9em',
    fontWeight: '600',
    border: '1px solid rgba(40, 167, 69, 0.2)',
    margin: '0 2px'
  },
  
  'quote': {
    display: 'inline-block',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#ffc107',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.9em',
    fontStyle: 'italic',
    border: '1px solid rgba(255, 193, 7, 0.2)',
    margin: '0 2px'
  },
  
  'special-char': {
    display: 'inline-block',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    color: '#dc3545',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.85em',
    fontWeight: '500',
    border: '1px solid rgba(220, 53, 69, 0.2)',
    margin: '0 2px'
  }
};