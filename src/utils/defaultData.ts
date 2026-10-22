import { LoveStory, MonthMemory, FutureMilestone } from '../types';

export const DEFAULT_MONTHS: MonthMemory[] = [
  {
    id: 'month-1',
    monthNumber: 1,
    monthLabel: 'Mes 1 · Octubre',
    title: 'El primer café y la mirada que lo cambió todo',
    date: '2023-10-18',
    location: 'Aquel rincón acogedor de la cafetería',
    story: 'Recuerdo como si fuera ayer los nervios de verte llegar. Una cita planeada para tomar un café rápido se convirtió en más de cuatro horas donde el reloj simplemente desapareció. Tu sonrisa, Dayana, tuvo la magia instantánea de hacerme sentir en paz, como si nos conociéramos de toda una vida.',
    anecdote: 'Cuando se te derramó un poquito de azúcar y te sonrojaste; en ese instante exacto supe que no quería estar en ningún otro lugar del mundo.',
    quote: '«Hay miradas que no duran segundos, se quedan a vivir en el alma para siempre.»',
    songRecommendation: 'Pachelbel Canon in D',
    presetStyle: 'cafe_date',
    likesCount: 24
  },
  {
    id: 'month-2',
    monthNumber: 2,
    monthLabel: 'Mes 2 · Noviembre',
    title: 'Noches interminables y confesiones bajo la luna',
    date: '2023-11-20',
    location: 'Nuestras charlas hasta las 3:00 AM',
    story: 'Noviembre trajo el frío del otoño, pero en tus mensajes y llamadas encontré el calor más reconfortante. Descubrir que compartíamos los mismos miedos, las mismas pasiones y un sentido del humor que nos hacía reír hasta que nos dolía el estómago. Cada día a tu lado confirmaba que esto era real.',
    anecdote: 'La primera vez que me mandaste un audio cantando bajito porque te daba vergüenza, y lo escuché mil veces antes de dormir.',
    quote: '«Y de repente alguien llega, te desordena los días y te ordena el corazón.»',
    songRecommendation: 'Until I Found You - Stephen Sanchez',
    presetStyle: 'stargazing',
    likesCount: 31
  },
  {
    id: 'month-3',
    monthNumber: 3,
    monthLabel: 'Mes 3 · Diciembre',
    title: 'Luces de medianoche y nuestro primer fin de año',
    date: '2023-12-31',
    location: 'El mirador iluminado por la fiesta',
    story: 'Despedir el año mirándote a los ojos fue el momento más conmovedor. Mientras todos miraban los fuegos artificiales estallar en el cielo, yo solo podía mirarte a ti, agradeciendo al destino por haber puesto a Dayana Estefania en mi camino. El mejor regalo de Navidad ya estaba a mi lado.',
    anecdote: 'Ese abrazo apretado justo cuando el reloj marcó las 00:00 y me susurraste al oído: "feliz año nuevo, mi amor".',
    quote: '«No pedí nada a las doce de la noche, porque todo lo que soñaba ya me sostenía la mano.»',
    songRecommendation: 'Snowman - Sia',
    presetStyle: 'celebration_wine',
    likesCount: 42
  },
  {
    id: 'month-4',
    monthNumber: 4,
    monthLabel: 'Mes 4 · Enero',
    title: 'Comenzar el nuevo año con paso firme y promesas',
    date: '2024-01-15',
    location: 'Caminatas al atardecer por la ciudad',
    story: 'Enero empezó con una energía única. Empezamos a planear metas juntos, a soñar despiertos y a construir esa complicidad de ser un equipo inquebrantable. Salir a caminar abrigados de la mano, sintiendo tus dedos helados encajando perfectamente entre los míos.',
    anecdote: 'Tus manos buscando mis bolsillos de la chaqueta para calentarte mientras caminábamos riéndonos del viento.',
    quote: '«El amor no es solo mirarse el uno al otro, es caminar juntos mirando en la misma dirección.»',
    songRecommendation: 'Yellow - Coldplay',
    presetStyle: 'rose_sunset',
    likesCount: 28
  },
  {
    id: 'month-5',
    monthNumber: 5,
    monthLabel: 'Mes 5 · Febrero',
    title: 'Nuestro primer San Valentín: El amor en lo cotidiano',
    date: '2024-02-14',
    location: 'Una cena especial preparada con amor',
    story: 'Febrero fue la prueba de que no necesitamos días especiales en el calendario para celebrar lo que sentimos, porque contigo cada día común se transforma en una fiesta. Compartir una cena hecha en casa, con velas improvisadas y conversaciones que tocaban lo más hondo de nuestras almas.',
    anecdote: 'La carta con notas que me dejaste escondida entre mis cosas y que encontré al día siguiente.',
    quote: '«Te amo no por quien eres, sino por quien soy cuando estoy contigo, Dayana.»',
    songRecommendation: 'Can\'t Help Falling in Love',
    presetStyle: 'sweet_moments',
    likesCount: 50
  },
  {
    id: 'month-6',
    monthNumber: 6,
    monthLabel: 'Mes 6 · Marzo',
    title: 'Medio año juntos: Encontré mi hogar en ti',
    date: '2024-03-18',
    location: 'Nuestra tarde favorita de desconexión',
    story: '¡Llegamos a los 6 meses! Medio año de historia, de aprender a conocernos en nuestros mejores días y también en los días grises. Marzo me demostró que el amor madura, se fortalece y se vuelve ese refugio seguro donde siempre deseo volver después de un día difícil.',
    anecdote: 'Cuando me quedé dormido sobre tu regazo mientras me acariciabas el cabello en silencio.',
    quote: '«El hogar no es una casa de cuatro paredes; mi verdadero hogar es tu abrazo.»',
    songRecommendation: 'Photograph - Ed Sheeran',
    presetStyle: 'cozy_home',
    likesCount: 37
  },
  {
    id: 'month-7',
    monthNumber: 7,
    monthLabel: 'Mes 7 · Abril',
    title: 'Nuestra primera gran escapada y aire fresco',
    date: '2024-04-22',
    location: 'Playa Serena y senderos verdes',
    story: 'Abril nos regaló una escapada inolvidable. Salir de la rutina, respirar el aroma a mar y tierra mojada, caminar descalzos y sacarnos decenas de fotos desprevenidas donde tu risa genuina era el espectáculo principal. Verte tan feliz y libre es una de las cosas más bellas que he presenciado.',
    anecdote: 'Esa ola sorpresa que nos empapó los pantalones y nos hizo soltar una carcajada que resonó en toda la orilla.',
    quote: '«Contigo la aventura no es el destino, el viaje eres tú.»',
    songRecommendation: 'Riptide - Vance Joy',
    presetStyle: 'beach_walk',
    likesCount: 45
  },
  {
    id: 'month-8',
    monthNumber: 8,
    monthLabel: 'Mes 8 · Mayo',
    title: 'Superando tormentas: La fuerza incondicional de ser dos',
    date: '2024-05-19',
    location: 'Apoyándonos con el corazón',
    story: 'En mayo no todo fueron días soleados; hubo retos y preocupaciones personales, pero fue precisamente allí donde me di cuenta de la mujer tan maravillosa y valiosa que eres. Tu empatía, tu paciencia y ese "aquí estoy contigo pase lo que pase" soldaron nuestro vínculo para siempre.',
    anecdote: 'Ese café con leche caliente que me trajiste sin que te lo pidiera, solo porque sabías que lo necesitaba.',
    quote: '«Un amor real no es el que nunca tiene tormentas, sino el que sabe bailar bajo la lluvia sin soltarse.»',
    songRecommendation: 'Fix You - Coldplay',
    presetStyle: 'deep_talks',
    likesCount: 39
  },
  {
    id: 'month-9',
    monthNumber: 9,
    monthLabel: 'Mes 9 · Junio',
    title: 'Tardes de lluvia, cobijas y películas infinitas',
    date: '2024-06-25',
    location: 'Nido acogedor en casa',
    story: 'Las tardes de lluvia de junio fueron la excusa perfecta para quedarnos resguardados, tapados con una cobija tibia, compartiendo palomitas y viendo maratones de películas mientras afuera las gotas golpeaban la ventana. Esos silencios cómodos donde nada hace falta porque estamos completos.',
    anecdote: 'Discutir amigablemente por 20 minutos qué película poner, para que al final te quedaras dormida en los primeros diez minutos.',
    quote: '«Hay placeres sencillos que valen más que todo el oro del mundo, y uno de ellos es tu compañía en un día lluvioso.»',
    songRecommendation: 'Banana Pancakes - Jack Johnson',
    presetStyle: 'rainy_day',
    likesCount: 48
  },
  {
    id: 'month-10',
    monthNumber: 10,
    monthLabel: 'Mes 10 · Julio',
    title: 'Complicidad pura: Miradas que no necesitan palabras',
    date: '2024-07-28',
    location: 'En medio de una reunión con amigos',
    story: 'En julio llegamos a esa maravillosa etapa donde basta una mirada cómplice a través de una habitación llena de gente para saber exactamente qué está pensando el otro. Esa conexión secreta, esos chistes internos y la alegría sincera de tenerte como mi mejor amiga y el gran amor de mi vida.',
    anecdote: 'Mirarnos de reojo en la mesa y tener que taparnos la boca para no estallar de la risa por algo que solo nosotros entendíamos.',
    quote: '«Qué bonito es encontrar en una misma persona a tu confidente, tu paz y tu mayor locura.»',
    songRecommendation: 'Just the Way You Are - Bruno Mars',
    presetStyle: 'adventure',
    likesCount: 52
  },
  {
    id: 'month-11',
    monthNumber: 11,
    monthLabel: 'Mes 11 · Agosto',
    title: 'A un paso del aniversario: Mirar atrás con orgullo',
    date: '2024-08-18',
    location: 'El atardecer dorado en el parque',
    story: 'A punto de cumplir un año entero. Sentados en el césped viendo caer el sol dorado de agosto, recordando cada mes transcurrido, cada anécdota, cada aprendizaje. Darme cuenta de lo mucho que hemos crecido juntos y de lo orgulloso que me siento de la persona que eres, Dayana Estefania.',
    anecdote: 'Escribir nuestras iniciales juntas y hacer una promesa silenciosa de que este era solo el primer capítulo de un libro eterno.',
    quote: '«El tiempo a tu lado no corre, vuela; pero cada segundo queda grabado a fuego en mi corazón.»',
    songRecommendation: 'Golden Hour - JVKE',
    presetStyle: 'rose_sunset',
    likesCount: 55
  },
  {
    id: 'month-12',
    monthNumber: 12,
    monthLabel: 'Mes 12 · Septiembre / Octubre',
    title: '365 días a tu lado: 1 año de amor absoluto',
    date: '2024-10-18',
    location: 'Nuestra cena de aniversario inolvidable',
    story: '¡12 meses! ¡365 días amándote, Dayana Estefania Cuascota Cuascota! Doce meses llenos de risas, caricias, aprendizajes y ternura infinita. Este año ha sido el más hermoso y luminoso de mi vida entera gracias a ti. Brindo por este primer año y por todos los que el destino nos tiene preparados.',
    anecdote: 'Brindar con nuestras copas, mirarte a los ojos y decirte desde lo más hondo de mi ser: gracias por ser mi amor, mi princesa y mi vida entera.',
    quote: '«Si tuviera que vivir mi vida de nuevo, te buscaría antes para poder amarte más tiempo.»',
    songRecommendation: 'All of Me - John Legend',
    presetStyle: 'celebration_wine',
    likesCount: 68
  }
];

export const DEFAULT_FUTURE_MILESTONES: FutureMilestone[] = [
  {
    id: 'fut-1',
    year: 2025,
    month: 'Junio',
    targetDate: '2025-06-20',
    title: 'Nuestra primera gran escapada al mar y atardecer soñado',
    location: 'Playa cálida al atardecer',
    story: 'Caminar descalzos por la orilla sintiendo la brisa suave, viéndote reír mientras el sol se tiñe de tonos dorados y violetas. Prometo mirarte igual que en nuestro primer café y recordarte cuánto te amo con el sonido del oleaje de fondo.',
    quote: '«El mar es inmenso, pero mi amor por ti no cabe en ningún océano.»',
    category: 'viaje',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fut-2',
    year: 2025,
    month: 'Diciembre',
    targetDate: '2025-12-24',
    title: 'Nuestra segunda Navidad y la promesa de un amor eterno',
    location: 'Nuestra acogedora tradición navideña',
    story: 'Un chocolate caliente en nuestras tazas favoritas, luces titilando en la ventana y ese abrazo a medianoche donde el mundo entero se apaga y solo quedamos tú y yo celebrando la vida.',
    quote: '«Tú eres el mejor regalo que el destino me pudo haber concedido.»',
    category: 'celebracion',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1543258103-a62bd961302b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fut-3',
    year: 2026,
    month: 'Mayo',
    targetDate: '2026-05-15',
    title: 'El viaje soñado: Nuevos horizontes y recuerdos infinitos',
    location: 'Aquel rincón del mundo que tanto soñamos',
    story: 'Hacer las maletas juntos, tomarnos de las manos al despegar y perdernos por calles adoquinadas, descubriendo miradores y coleccionando instantes que contaremos con ternura cuando seamos viejitos.',
    quote: '«Cualquier lugar del mapa es perfecto si tus pasos van junto a los míos.»',
    category: 'viaje',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-forest-42861-large.mp4'
  },
  {
    id: 'fut-4',
    year: 2027,
    month: 'Febrero',
    targetDate: '2027-02-14',
    title: 'Las llaves de nuestro propio nido y hogar de paz',
    location: 'Nuestro propio hogar',
    story: 'Abrir la puerta de nuestro propio espacio, decorar cada rincón a nuestro gusto, preparar café un domingo por la mañana y saber que ese refugio es testimonio de todo lo que construimos con paciencia y amor.',
    quote: '«Hogar no es un lugar físico; hogar es mirarte a los ojos y sentirme en paz.»',
    category: 'hogar',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fut-5',
    year: 2028,
    month: 'Octubre',
    targetDate: '2028-10-18',
    title: '5 Años Juntos: Una alianza que el tiempo solo hace más fuerte',
    location: 'Cena especial bajo las estrellas',
    story: 'Media década de complicidad, de aprender juntos, de abrazar nuestras diferencias y celebrar nuestras victorias. Brindar por cada lágrima convertida en sonrisa y por cada sueño que se hizo realidad.',
    quote: '«Si tuviera que vivir mi vida de nuevo, te buscaría mucho antes.»',
    category: 'amor',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-couple-holding-each-other-softly-42873-large.mp4'
  },
  {
    id: 'fut-6',
    year: 2030,
    month: 'Diciembre',
    targetDate: '2030-12-31',
    title: 'El porvenir que seguimos tejiendo sin final',
    location: 'Donde el destino nos encuentre juntos',
    story: 'Años después, sentarnos juntos a recordar este primer libro que empezó todo. Sentir el mismo cosquilleo de emoción y confirmar que amarte es la decisión más hermosa y fácil de cada uno de mis días.',
    quote: '«En este futuro y en todos los que existan, mi corazón siempre te pertenecerá.»',
    category: 'metas',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80'
  }
];

export const DEFAULT_LOVE_STORY: LoveStory = {
  senderName: 'Tu Amor Eterno',
  receiverName: 'Dayana Estefania Cuascota Cuascota',
  anniversaryDate: '2023-10-18T19:30',
  heroKicker: 'Un año escribiendo la historia más hermosa de nuestras vidas',
  heroHeadline: 'Dayana, cada día a tu lado es mi lugar favorito en el mundo',
  heroNote: 'Para Dayana Estefania Cuascota Cuascota · Con todo mi amor eterno',
  months: DEFAULT_MONTHS,
  letter: {
    title: 'Para el Gran Amor de Mi Vida, Dayana',
    paragraphs: [
      'Si hace un año me hubieran dicho que existiría alguien capaz de transformar mis días con una sola sonrisa, jamás habría imaginado la magnitud de lo que hoy siento por ti.',
      'A tu lado, Dayana Estefania, comprendí que el amor verdadero no es una meta a la que se llega, sino un sendero lleno de ternura que se construye paso a paso con cada caricia, cada risa compartida y cada conversación hasta el amanecer.',
      'Gracias por ser mi paz cuando hay tormenta, mi inspiración para ser mejor y el hogar donde mi alma descansa. Prometo amarte, respetarte y cuidarte hoy, mañana y en cada uno de los años que nos regale el destino.',
      'Con todo el amor que existe en mi corazón,'
    ],
    signature: 'Siempre tuyo, por y para siempre.',
    waxColor: 'burgundy'
  },
  memories: [
    {
      id: 'mem-1',
      date: '2023-10-18',
      title: 'El día en que todo cobró sentido',
      description: 'Nuestra primera cita que duró horas. Mirarte a los ojos y sentir que el mundo se detenía por completo.',
      location: 'Nuestra cafetería especial',
      presetStyle: 'cafe_date'
    },
    {
      id: 'mem-2',
      date: '2023-12-31',
      title: 'Bajo el cielo de medianoche',
      description: 'Dando la bienvenida al nuevo año abrazados, prometiéndonos que este sería el inicio de una vida juntos.',
      location: 'El mirador iluminado',
      presetStyle: 'stargazing'
    },
    {
      id: 'mem-3',
      date: '2024-06-15',
      title: 'Tardes de risas infinitas',
      description: 'Caminar juntos sin rumbo, comiendo helado y riéndonos de cualquier cosa como si nada más importara.',
      location: 'El parque de los cerezos',
      presetStyle: 'beach_walk'
    }
  ],
  reasons: [
    {
      id: 'reas-1',
      title: 'Tu sonrisa ilumina mi mundo',
      description: 'Tienes esa chispa única y genuina que convierte cualquier día gris en una tarde radiante llena de ilusión.'
    },
    {
      id: 'reas-2',
      title: 'Tu corazón noble y bondadoso',
      description: 'La forma tan tierna y empática en la que tratas a quienes te rodean me enamora más con cada segundo que pasa.'
    },
    {
      id: 'reas-3',
      title: 'La calma de tus abrazos',
      description: 'No importa qué tan ruidoso esté el mundo afuera; cuando estoy entre tus brazos, todo encuentra sentido y calma.'
    },
    {
      id: 'reas-4',
      title: 'Nuestras charlas y risas tontas',
      description: 'Poder hablar de todo y de nada a la vez, haciéndonos reír con complicidad y sin máscaras.'
    },
    {
      id: 'reas-5',
      title: 'Tu fuerza y tenacidad admirable',
      description: 'La determinación con la que enfrentas tus metas e inspiras a ser una mejor versión de mí mismo.'
    },
    {
      id: 'reas-6',
      title: 'Tus pequeños detalles de amor',
      description: 'Cuando te acuerdas de mí, tus miradas tiernas inesperadas y el calor de tu mano buscando la mía.'
    }
  ],
  coupons: [
    {
      id: 'coup-1',
      title: 'Cena romántica hecha en casa para Dayana',
      description: 'Válido por tu platillo favorito cocinado con dedicación, velas aromáticas y postre especial.',
      iconName: 'UtensilsCrossed',
      redeemed: false
    },
    {
      id: 'coup-2',
      title: 'Sesión de masajes y mimos relajantes',
      description: 'Válido por 30 minutos de masajes en hombros y espalda con aceites aromáticos y música suave.',
      iconName: 'Sparkles',
      redeemed: false
    },
    {
      id: 'coup-3',
      title: 'Tarde de películas, cobijas y snacks ilimitados',
      description: 'Tú eliges todas las series o películas, y todos los antojos van por mi cuenta.',
      iconName: 'Film',
      redeemed: false
    },
    {
      id: 'coup-4',
      title: 'Día de paseo o escapada sorpresa',
      description: 'Un viaje o salida inesperada a un rincón bonito sin prisas ni estrés.',
      iconName: 'Compass',
      redeemed: false
    },
    {
      id: 'coup-5',
      title: 'Pase libre para consentirte todo el día',
      description: 'Válido para pedir cualquier capricho o deseo durante 24 horas continuas con total devoción.',
      iconName: 'HeartHandshake',
      redeemed: false
    }
  ],
  futureMilestones: DEFAULT_FUTURE_MILESTONES,
  soundtrack: {
    enabled: false,
    tune: 'canon',
    volume: 0.6
  }
};
