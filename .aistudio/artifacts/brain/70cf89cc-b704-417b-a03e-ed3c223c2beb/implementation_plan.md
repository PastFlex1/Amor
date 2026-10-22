# Amour: Experiencia Interactiva de Amor y Dedicatoria Personalizada

Una aplicación web romántica de alta fidelidad pensada como un regalo digital inolvidable y emotivo para esa persona especial. Combina una presentación inmersiva con carta interactiva en sobre lacrado, contador de tiempo juntos en tiempo real (días, horas, minutos y segundos), cronología de recuerdos con fotografías y notas, reproductor musical ambiental, y un modo editor en vivo para personalizar nombres, fechas, mensajes y compartir el enlace directo con tu pareja.

## Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> Basado en tus respuestas, hemos alineado los tres pilares centrales de la experiencia:
> - **Formato Principal**: Viaje interactivo que combina carta interactiva con animación de apertura, contador dinámico de relación en vivo, línea de tiempo de momentos clave y reproductor de música ambiental.
> - **Modo Editor**: Panel intuitivo de edición en vivo donde puedes cambiar nombres, fecha de inicio, fotos, textos de la carta, momentos de la historia y generar un enlace compartible o guardar en el dispositivo.
> - **Estética Visual**: Romántica y distinguida con paleta de tonos rosa pétalo, vino tinto borgoña, marfil suave y destellos sutiles, con tipografía editorial de alto impacto.

---

### 1. Resumen y Concepto Central

- **Propósito**: Ofrecer una experiencia digital íntima, emotiva y personalizada que celebre una historia de amor real, permitiendo al creador personalizar cada detalle o al destinatario disfrutar de una experiencia guiada llena de sorpresas.
- **Audiencia Objetivo**: Parejas, aniversarios, declaraciones de amor, San Valentín o regalos conmemorativos.
- **Valor Diferencial**: No es una página estática simple, sino un recorrido narrativo y sensorial con música ambiental, animaciones suaves, efectos de pétalos y estrellas tenues, y un editor instantáneo que persiste cambios localmente y genera URLs compartibles codificadas.

---

### 2. Experiencia de Usuario y Diseño Visual

#### Flujo del Destinatario (Modo Regalo / Presentación):
1. **Pantalla de Bienvenida Romántica**: Portada delicada con los nombres de la pareja, música de fondo activable y un botón principal "Comenzar nuestro viaje".
2. **Contador de Amor en Tiempo Real**: Tarjeta destacada con el cálculo exacto de días, horas, minutos y segundos compartidos desde la fecha especial, junto con hitos memorables calculados.
3. **Sobre y Carta de Amor Interactiva**: Un sobre virtual elegante con sello de cera que se abre al tacto, revelando una carta romántica con tipografía manuscrita y efectos de lectura envolvente.
4. **Línea de Tiempo de Recuerdos ("Nuestra Historia")**: Galería interactiva en orden cronológico con tarjetas de momentos especiales, fotos polaroid, fechas y anécdotas conmovedoras.
5. **Cápsula de Razones ("Por qué te amo")**: Carrusel interactivo o tarjetas revelables con motivos especiales para amar a esa persona.
6. **Música y Ambiente**: Barra flotante discreta para reproducir melodías románticas instrumentales (con melodía de piano/cuerdas sintetizada vía Web Audio API y pistas precargadas seleccionables), control de volumen y botón para lluvia suave de corazones.

#### Flujo del Creador (Modo Editor en Vivo):
- Botón discreto "Personalizar este regalo":
  - Modificar nombres de la pareja (ej. "Valentina & Mateo").
  - Seleccionar fecha y hora de aniversario para el contador.
  - Editar la carta de amor con texto personalizado.
  - Añadir, editar o eliminar fotos y recuerdos con carga de imágenes o selector de imágenes románticas.
  - Personalizar la lista de "Razones por las que te amo".
  - Botón "Compartir": Copia un enlace con toda la configuración comprimida en URL o guarda en el navegador para que al abrirlo se vea en modo regalo puro.

#### Identidad Visual y Paleta de Colores:
- **Canvas Base (60%)**: Marfil crema suave (`#FAF6F0` / `#FFFDF9`) y fondo vino profundo en modo nocturno (`#1A0C13`).
- **Estructura y Superficies (30%)**: Rosa empolvado (`#F8E7E9`), blanco cálido con bordes sutiles burdeos y textura de papel pergamino suave.
- **Acentos Focales (10%)**: Borgoña profundo (`#881337`), carmín apasionado (`#E11D48`) y toques de oro rosa (`#D4A373`).
- **Tipografía**:
  - Títulos y citas: Serif editorial romántico (`Playfair Display` / `Fraunces`).
  - Cuerpo y controles: Sans-serif geométrica legible (`Plus Jakarta Sans`).

---

### 3. Decisiones de Producto y Arquitectura

1. **Gestión de Datos y Compartibilidad**:
   - *Solución*: Almacenamiento local mediante `localStorage` para persistencia en el dispositivo del usuario + compresión URL segura (Base64/URI encoded state) para que el remitente pueda copiar el enlace y enviárselo a su pareja directamente por WhatsApp o redes, abriéndose con todos los datos precargados sin necesidad de iniciar sesión obligatoria ni servidores externos lentos.
2. **Audio y Música Romántica**:
   - *Solución*: Motor Web Audio de piano/lullaby romántico sin dependencias externas bloqueadas por CORS, complementado con opción de reproducir melodías preconfiguradas y controles de silencio para respetar la interacción del navegador.
3. **Sensibilidad Visual y Animaciones**:
   - *Solución*: Animaciones fluidas con `motion` (framer-motion) para la apertura del sobre, transiciones entre secciones, y lluvia de pétalos y corazones interactiva.

---

### 4. Diagrama y Arquitectura Técnica

```
┌──────────────────────────────────────────────────────────────┐
│                      AMOUR APP ROOT                          │
│                                                              │
│  ┌────────────────────┐   ┌───────────────────────────────┐  │
│  │ RomanticAudioEngine│   │ State Store (Local + URL Sync)│  │
│  │ (Piano / WebAudio) │   │ (Names, Dates, Story, Letter) │  │
│  └──────────┬─────────┘   └───────────────┬───────────────┘  │
│             │                             │                  │
│             ▼                             ▼                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                     App Header Bar                     │  │
│  │  [Logo / Nombres] · [Música On/Off] · [Modo Editor]    │  │
│  └────────────────────────────────────────────────────────┘  │
│                               │                              │
│         ┌─────────────────────┴────────────────────┐         │
│         ▼                                          ▼         │
│  ┌─────────────────────────┐            ┌─────────────────┐  │
│  │    PRESENTATION VIEW    │            │   EDITOR MODAL  │  │
│  │                         │            │                 │  │
│  │ 1. Hero Cover & Welcome │            │ - Nombres       │  │
│  │ 2. Realtime Love Counter│ ◄───────── │ - Fecha Aniv.   │  │
│  │ 3. Interactive Letter   │  (Updates) │ - Carta de Amor │  │
│  │ 4. Memory Timeline      │            │ - Recuerdos/Foto│  │
│  │ 5. Reasons Why I Love U │            │ - Copiar Enlace │  │
│  │ 6. Interactive Wishes   │            └─────────────────┘  │
│  └─────────────────────────┘                                 │
└──────────────────────────────────────────────────────────────┘
```
