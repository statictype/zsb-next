import './_load-env'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join, resolve } from 'node:path'
import { createClient } from '@sanity/client'
import sharp from 'sharp'

const dryRun = process.argv.includes('--dry')

const SOURCE_ROOT = '../galeria beller/Artisti'
const SKIP_DIRS = new Set(['Documente artist'])
const MAX_EDGE = 2560

interface Locale {
  ro: string
  en: string
}

interface ArtistSource {
  id: string
  name: string
  dir: string
  portrait?: string
  bio: { ro: string[]; en: string[] }
}

interface WorkSource {
  key: number
  artist: string
  title: Locale
  material?: Locale
  dimensions?: string
  year?: string
  description: { ro: string[]; en: string[] }
}

const ARTISTS: ArtistSource[] = [
  {
    id: 'artist-darie-dup',
    name: 'Darie Dup',
    dir: '2.Darie Dup',
    bio: {
      ro: [
        'Alunecând pe rampa avangardei, arta lui Darie Dup se dezvoltă în jurul obiectului, atât cel „readymade”, cât și cel creat de artist. Complexitatea vine din faptul că Dup nu doar reciclează, exploatând obiectele per se, ci și investighează, recontextualizează și le atribuie obiectelor funcții noi. Capete de păpușă supradimensionate, urechi roșii surde, degete multicolore în dialog pe skateboard-uri, roboți de veghe, elemente de compoziție care amintesc de street art și graffiti, toate confirmă prezentul continuu al artistului aflat în permanentă mișcare inversă; cu cât înaintează în cariera sa, cu atât mai proaspete, mai surprinzătoare și mai libere sunt lucrările sale.',
        'Darie Dup (n. 1959, Zlatna) este sculptor și profesor la Universitatea Națională de Arte București, unde a condus ani la rând Departamentul de Sculptură. A expus la Expoziția Mondială de la Sevilla (1992), la Bienala de la Veneția (1995), la MNAC și în galerii și muzee din Europa. Lucrează cu lemn, piatră, metal și rășină, de la fragmentul anatomic la instalația site-specific. Premiul Național „Brâncuși” (2016), membru al Royal Society of British Sculptors.',
      ],
      en: [
        'Moving along the trajectory of the avant-garde, Darie Dup’s art revolves around the object, whether readymade or created by the artist himself. Its complexity lies in the fact that Dup does more than recycle or exploit objects as such: he investigates them, recontextualises them, and assigns them new functions. Oversized doll heads, deaf red ears, multicoloured fingers engaged in dialogue on skateboards, watchful robots, and compositional elements reminiscent of street art and graffiti all confirm the artist’s continuous present, marked by a constant reverse motion: the further he advances in his career, the fresher, more surprising, and freer his works become.',
        'Darie Dup (b. 1959, Zlatna) is a sculptor and professor at the National University of Arts Bucharest, where he headed the Sculpture Department for many years. He exhibited at the Seville World Expo (1992), the Venice Biennale (1995), MNAC, and galleries and museums across Europe. He works with wood, stone, metal, and resin, ranging from anatomical fragments to site-specific installations. He received the National “Brâncuși” Award in 2016 and is a member of the Royal Society of British Sculptors.',
      ],
    },
  },
  {
    id: 'artist-alin-carpen',
    name: 'Alin Carpen',
    dir: '1.Alin Carpen',
    portrait: 'Alin Carpen - Close-up photo.jpg',
    bio: {
      ro: [
        'Un arhitect convertit la sculptură, absolvent al Universității de Arhitectură „Ion Mincu” (2000), apoi al Universității Naționale de Arte, secția de sculptură, în clasa profesorului Aurel Vlad (2015). Este un artist neconvențional care folosește oglinzile pentru a crea instalații cinetice care învăluie în mister realitatea care ne înconjoară. Tema care o străbate este urma pe care fiecare om o lasă în timp.',
        'Pe parcursul carierei artistice, Alin Carpen (n. 1970, Mizil) a fost distins cu mai multe premii, printre care Premiul I „Arte în București” (2016) și Premiul II la Bienala „Gheorghe Petrașcu” (2018).',
      ],
      en: [
        'An architect turned sculptor, Alin Carpen graduated from the “Ion Mincu” University of Architecture and Urban Planning (2000) and later from the National University of Arts, Department of Sculpture, in Professor Aurel Vlad’s class (2015). He is an unconventional artist who uses mirrors to create kinetic installations that envelop the surrounding reality in mystery. A recurring theme in his work is the trace each person leaves behind over time.',
        'Throughout his artistic career, Alin Carpen (b. 1970, Mizil) has received several awards, including First Prize at Arts in Bucharest (2016) and Second Prize at the Gheorghe Petrașcu Biennial (2018).',
      ],
    },
  },
  {
    id: 'artist-alexandru-ranga',
    name: 'Alexandru Ranga',
    dir: '5.Alexandru Ranga',
    portrait: 'Alexandru Ranga_1.jpg',
    bio: {
      ro: [
        'Alexandru Ranga este un tânăr artist vizual din București, remarcat pentru practica sa sculpturală dezvoltată în jurul metalului sudat și pentru universul figurativ construit prin forme teriomorfe și instalații de mari dimensiuni. Activitatea sa artistică explorează teme sociale, comportamente colective și relația dintre instinct, tensiune și identitate, dezvoltând un limbaj vizual recognoscibil pe scena artei contemporane din România.',
        'Alexandru Ranga (n. 1995) a absolvit Liceul de Arte Plastice „Nicolae Tonitza” și Universitatea Națională de Arte București, secția Sculptură (licență 2018, master 2020). A primit Premiul Grigore Bradea (2024), Premiul UAP pentru Tineret, Premiul Sculptor Emergent (2024) și Premiul RAD (2025).',
      ],
      en: [
        'Alexandru Ranga is a young visual artist based in Bucharest, known for a sculptural practice centred on welded metal and for a figurative universe shaped through theriomorphic forms and large-scale installations. His work explores social themes, collective behaviours, and the relationship between instinct, tension, and identity, developing a distinctive visual language within the Romanian contemporary art scene.',
        'Alexandru Ranga (b. 1995) graduated from the “Nicolae Tonitza” High School of Fine Arts and the Sculpture Department of the National University of Arts Bucharest (BA, 2018; MA, 2020). He has received the Grigore Bradea Award (2024), the UAP Youth Award, the Emerging Sculptor Award (2024), and the RAD Award (2025).',
      ],
    },
  },
  {
    id: 'artist-elena-scutaru',
    name: 'Elena Scutaru',
    dir: '6.Elena Scutaru',
    portrait: 'Elena Scutaru, in atelier  2019  .jpg',
    bio: {
      ro: [
        'Pornind de la propria imagine, prin mulaj și modelare, Elena Scutaru multiplică personaje, chipuri și corpuri, până la abstractizare, având o practică artistică extinsă pe mai multe perioade, încă din anii 90. Oamenii sintetici ai Elenei Scutaru aparțin unui viitor în care esteticul este irelevant și, în egală măsură, unui trecut care merge până în antichitate, în care imaginea omului, verticală și fără echivoc, este centrală.',
        'Elena Scutaru (n. 1964, Galați) este sculptoriță și profesoară la Universitatea Națională de Arte București, doctor în arte vizuale din 2009. Lucrează la intersecția dintre sculptură, instalație, obiect și asamblaj, cu materiale naturale apropiate de arte povera și cu o deschidere spre suprarealism. Expoziții personale recente: MNAC (2022), Muzeul de Artă Arad (2023), Muzeul Național Cotroceni (2026). Premiul UAP pentru sculptură pe 2019.',
      ],
      en: [
        'Starting from her own image, through casting and modelling, Elena Scutaru multiplies figures, faces, and bodies to the point of abstraction, in an artistic practice spanning several periods since the 1990s. Scutaru’s synthetic humans belong equally to a future in which aesthetics has become irrelevant and to a past reaching back to antiquity, where the upright, unequivocal image of the human figure occupies a central place.',
        'Elena Scutaru (b. 1964, Galați) is a sculptor and professor at the National University of Arts Bucharest, holding a PhD in Visual Arts since 2009. Her practice lies at the intersection of sculpture, installation, object, and assemblage, using natural materials associated with Arte Povera and showing an openness toward Surrealism. Recent solo exhibitions include MNAC (2022), Arad Art Museum (2023), and Cotroceni National Museum (2026). She received the UAP Sculpture Award for 2019.',
      ],
    },
  },
  {
    id: 'artist-alexandru-marinete',
    name: 'Alexandru Marinete',
    dir: '3.Alexandru Marinete',
    portrait: 'MARINETE/Al Mar.jpg',
    bio: {
      ro: [
        'Alexandru Marinete (n. 1980, București) a absolvit Universitatea Națională de Arte din București, la secția de Sculptură, după o formare începută la Colegiul Național de Arte „Nicolae Tonitza”. A intrat în contact cu sculptura la vârsta de 8 ani, în atelierul tatălui său, sculptorul Constantin Marinete, unde a descoperit lucrul direct cu piatra și și-a format primele repere artistice.',
        'Lucrează în special cu marmură, piatră și granit, explorând contrastul dintre duritatea materialului și modul în care acesta poate sugera fragilitate, sensibilitate și mișcare. Stilul său se află între figurativ și abstract, folosind forme simple și esențiale, construite în jurul unor teme precum libertatea, ascensiunea, vulnerabilitatea și legătura dintre materie și lumea interioară. Un aspect important al muncii sale este relația dintre meșteșug și memorie, dintre transmiterea unei tradiții de la tată la fiu și crearea unui limbaj artistic propriu. Lucrările sale au fost expuse, printre altele, în Pavilionul României la Expo 2020 Dubai și la MoBU – International Art Fair of Bucharest. În 2023, a câștigat May Challenge în cadrul proiectului NNC Gallery London.',
      ],
      en: [],
    },
  },
  {
    id: 'artist-alexandru-papuc',
    name: 'Alexandru Papuc',
    dir: '4.Alexandru Papuc',
    portrait: 'Alexandru Papuc.HEIC',
    bio: {
      ro: [
        'Alexandru Papuc este un artist vizual român a cărui practică artistică se centrează pe sculptură și instalație, explorând relația dintre formă, memorie, corp și lumină. Lucrările sale se dezvoltă între figurativ și abstract, investigând fragmentarea corporalității și transformarea materiei printr-un limbaj sculptural contemporan. În seria „Întrupări fasciculare”, artistul utilizează plexiglasul și proiecția laser pentru a construi structuri optice și forme spectrale aflate între prezență și absență.',
        'Alexandru Papuc (n. 1971, București) a absolvit Departamentul de Sculptură al Universității Naționale de Arte București, la clasa profesorului Vasile Gorduz. De-a lungul carierei, a fost distins cu numeroase premii, printre care Premiul UAPR la Salonul de Artă Contemporană (2024), Premiul I la concursul „Ecvestra - subiect în arta contemporană”, Fundația Art Encounters (2016) și Bursa UAPR pentru sculptură (2000). A semnat lucrări de for public în București, printre care Ivan Patzaichin, Constantin Brâncoveanu și Maria Tănase.',
      ],
      en: [
        'Alexandru Papuc is a Romanian visual artist whose practice focuses on sculpture and installation, exploring the relationship between form, memory, the body, and light. His works move between the figurative and the abstract, investigating the fragmentation of corporeality and the transformation of matter through a contemporary sculptural language. In the Fascicular Embodiments series, the artist uses plexiglass and laser projection to construct optical structures and spectral forms suspended between presence and absence.',
        'Alexandru Papuc (b. 1971, Bucharest) graduated from the Sculpture Department of the National University of Arts Bucharest, where he studied under Professor Vasile Gorduz. Throughout his career, he has received numerous awards, including the UAPR Award at the Contemporary Art Salon (2024), First Prize in the competition Equestrian – A Subject in Contemporary Art, organised by the Art Encounters Foundation (2016), and the UAPR Sculpture Scholarship (2000). He has also created several public monuments in Bucharest, including works dedicated to Ivan Patzaichin, Constantin Brâncoveanu, and Maria Tănase.',
      ],
    },
  },
  {
    id: 'artist-ovidiu-toader',
    name: 'Ovidiu Toader',
    dir: '7.Ovidiu Toader',
    bio: {
      ro: [
        'Ovidiu Toader lucrează cu sculptura, desenul, fotografia analogică și materiale naturale (precum apa și piatra) pentru a reexamina istoria umanității, explorând temporalități alternative și imaginând posibilele viitoruri ale acesteia. Abordând evenimente globale contemporane și raportându-se la narațiuni antropologice, el trece cu naturalețe de la explorări poetice la demersuri conceptuale și observații științifice. Concepute ca experiențe imersive și în relație directă cu contextul în care sunt prezentate, instalațiile sale funcționează după propriile reguli și temporalități, transformând și cuprinzând integral spațiile fizice în care sunt realizate. Lucrările lui Toader au fost expuse în cadrul Art Encounters Foundation și au intrat în Colecția Maramotti. Artistul este reprezentat de Galeria Catinca Tabacaru.',
        'Ovidiu Toader (n. 1991) a absolvit în 2014 studiile de licență la Facultatea de Arte Decorative și Design a Universității Naționale de Arte din București, iar în 2016 a finalizat un master în Arte Plastice, la Facultatea de Sculptură a aceleiași universități.',
      ],
      en: [
        'Ovidiu Toader works in sculpture, drawing, analogue photography, and natural materials (i.e., water, stones) to revisit human history, explore alternative temporalities, and write humanity’s potential futures. Touching on current global events and engaging with anthropological narratives, he moves with ease between poetic meanderings, conceptual approaches, and scientific observations. Conceived as immersive, context-responsive exhibitions, his installations operate according to their own rules and temporal laws, enveloping physical spaces entirely. Toader’s works have been exhibited by the Art Encounters Foundation and acquired into the Maramotti Collection. He is represented by Galeria Catinca Tabacaru.',
        'Ovidiu Toader (b. 1991) graduated in 2014 with a Bachelor’s degree from the Faculty of Decorative Arts and Design at the National University of Arts Bucharest, and in 2016 completed a Master’s degree in Fine Arts at the Faculty of Sculpture of the same university.',
      ],
    },
  },
  {
    id: 'artist-victoria-zidaru',
    name: 'Victoria Zidaru',
    dir: '8.Victoria Zidaru',
    bio: {
      ro: [
        'Cariera artistică a Victoriei Zidaru a început cu sculptura în bronz, în anii 1980, concentrându-se pe forma umană izolată, expresivă și pe materiale dure și durabile. În anii 1990, practica ei artistică s-a mutat treptat către fibre naturale și forme organice, în instalații din ce în ce mai moi, nepermanente. Începând cu anii 2000, opera ei este dedicată efemerului, lucrările sale fiind construite exclusiv din materie vegetală precum frunze, fân, crenguțe și pânză țesută manual. Din anii 1980 până astăzi, munca ei este dedicată unei căutări spirituale, bazată pe o abordare mistică a vindecării personale și sociale. Instalații de artă, ritualuri, imnuri, un cod vestimentar special și gastronomie arhaică, alături de vechiul ei interes pentru puterea vindecătoare a plantelor și prezența lor olfactivă, definesc ansamblul vast al producției sale artistice.',
        'Victoria Zidaru (n. 1956, Liteni, Suceava) a absolvit sculptura la Institutul de Arte Plastice „Nicolae Grigorescu” din București în 1983. A expus la MNAC, Muzeul MARe, Galeria Nicodim, la Veneția și la Artissima Torino.',
      ],
      en: [
        'Victoria Zidaru’s artistic career began with bronze sculpture in the 1980s, focusing on the isolated, expressive human figure and on hard, durable materials. During the 1990s, her practice gradually shifted towards natural fibres and organic forms, creating increasingly soft and impermanent installations. Since the 2000s, her work has been dedicated to the ephemeral, with pieces constructed exclusively from plant matter such as leaves, hay, twigs, and handwoven cloth. From the 1980s to the present, her practice has pursued a spiritual quest grounded in a mystical approach to personal and social healing. Art installations, rituals, hymns, a distinctive dress code, and archaic gastronomy, together with her long-standing interest in the healing power of plants and their olfactory presence, define the broad scope of her artistic practice.',
        'Victoria Zidaru (b. 1956, Liteni, Suceava) graduated in Sculpture from the “Nicolae Grigorescu” Institute of Fine Arts in Bucharest in 1983. Her work has been exhibited at MNAC, MARe Museum, Nicodim Gallery, in Venice, and at Artissima Turin.',
      ],
    },
  },
]

const WOOD: Locale = { ro: 'Lemn', en: 'Wood' }
const RESIN: Locale = { ro: 'Rășină', en: 'Resin' }
const IRON: Locale = { ro: 'Fier', en: 'Iron' }
const STONE: Locale = { ro: 'Piatră', en: 'Stone' }
const STEEL: Locale = { ro: 'Inox', en: 'Stainless steel' }
const IRON_HAY: Locale = { ro: 'Fier, fân', en: 'Iron, hay' }

const WORKS: WorkSource[] = [
  {
    key: 1,
    artist: 'artist-darie-dup',
    title: { ro: 'Cerc 1', en: 'Circle 1' },
    material: WOOD,
    dimensions: '220 × 220 × 220 cm',
    year: '2017',
    description: {
      ro: [
        'Discul amintește de secțiunea unui trunchi, redusă la un semn pur geometric. Tăiat în segmente care ies din plan și rămân legate doar prin cabluri tensionate, cercul se deschide ca o rană ținută sub control. Lucrarea aparține proiectului DE ARBORIBUS, despre defrișările abuzive, în care artistul a ales un limbaj minimal și impersonal. Nu forma frumoasă contează aici, ci starea de fapt pe care o împărtășim cu toții.',
      ],
      en: [
        'The disc recalls the cross-section of a tree trunk, reduced to a pure geometric sign. Cut into segments that protrude from the plane and remain connected only by tensioned cables, the circle opens like a wound held under control. The work is part of the DE ARBORIBUS project, focused on abusive deforestation, in which the artist adopted a minimal and impersonal visual language. What matters here is not the beauty of the form, but the reality we all share.',
      ],
    },
  },
  {
    key: 2,
    artist: 'artist-darie-dup',
    title: { ro: 'Cerc 2', en: 'Circle 2' },
    material: WOOD,
    dimensions: '220 × 220 × 220 cm',
    description: {
      ro: [
        'Al doilea cerc provine din ciclul AXIS MUNDI, prezentat între 2014 și 2016 la Palatele Brâncovenești, Muzeul Brukenthal, Muzeul Județean Gorj și Muzeul Țăranului Român. Forma întreagă se descompune în planuri care se rotesc unele față de altele, iar echilibrul lor depinde de tensiunea cablurilor. Scos din muzeu și așezat în stradă, cercul aduce în mijlocul orașului o întrebare despre pădure și despre ce pierdem odată cu ea.',
      ],
      en: [
        'The second circle comes from the AXIS MUNDI cycle, presented between 2014 and 2016 at the Brâncoveanu Palaces, the Brukenthal Museum, the Gorj County Museum, and the National Museum of the Romanian Peasant. The complete form breaks down into planes that rotate in relation to one another, while their balance depends on the tension of the cables. Removed from the museum and placed in the street, the circle brings into the heart of the city a question about the forest and about what we lose along with it.',
      ],
    },
  },
  {
    key: 3,
    artist: 'artist-darie-dup',
    title: { ro: 'Cal 1', en: 'Horse 1' },
    material: WOOD,
    dimensions: '120 × 50 × 100 cm',
    year: '2017–2026',
    description: {
      ro: [
        'Calul, unul dintre cele mai vechi motive ale sculpturii, apare secționat transversal și golit pe dinăuntru. Trunchiul devine recipient, copaie, iesle, în timp ce picioarele păstrează anatomia precisă a animalului. Întregul lipsește. Pentru Darie Dup, fragmentul nu e o ruină, ci o formă nouă: o figură cunoscută, reprezentată parțial, își schimbă sensul și ne obligă să ne oprim și să ne întrebăm.',
      ],
      en: [
        'The horse, one of sculpture’s oldest motifs, appears cross-sectioned and hollowed out. Its torso becomes a container, trough, or manger, while the legs retain the animal’s precise anatomy. The whole is absent. For Darie Dup, the fragment is not a ruin but a new form: a familiar figure, only partially represented, changes its meaning and compels us to stop and question it.',
      ],
    },
  },
  {
    key: 4,
    artist: 'artist-darie-dup',
    title: { ro: 'Cal 2', en: 'Horse 2' },
    material: RESIN,
    dimensions: '120 × 50 × 100 cm',
    year: '2017–2026',
    description: {
      ro: [
        'Seria CAI pornește de la ceea ce artistul numește arta fragmentului. În rășină, calul secționat pierde căldura și fibra lemnului și capătă o suprafață rece, de obiect. Alăturate, fragmentele alcătuiesc o herghelie imposibilă, care ne atrage prin frumusețea subiectului hipic și ne neliniștește prin absența întregului. Un tragicism hilar, la limita suprarealului.',
      ],
      en: [
        'The HORSES series begins with what the artist calls the art of the fragment. Rendered in resin, the sectioned horse loses the warmth and grain of wood and acquires the cold surface of an object. Placed together, the fragments form an impossible herd that draws us in with the beauty of the equestrian subject while unsettling us with the absence of the whole. A comic tragicism on the edge of the surreal.',
      ],
    },
  },
  {
    key: 5,
    artist: 'artist-darie-dup',
    title: { ro: 'Cal 3', en: 'Horse 3' },
    material: RESIN,
    dimensions: '120 × 50 × 100 cm',
    year: '2017–2026',
    description: {
      ro: [
        'Transformat în iesle, calul pare să se hrănească din propriul corp: în cuvintele artistului, „calul se consumă pe sine însuși”. Lucrarea oscilează între obiect util și sculptură, între recipient și animal. Pe Beller, printre trecători și terase, fragmentul hipic lasă întrebarea deschisă: ce rămâne dintr-o formă atunci când îi lipsește întregul?',
      ],
      en: [
        'Transformed into a manger, the horse seems to feed on its own body: in the artist’s words, “the horse consumes itself.” The work oscillates between functional object and sculpture, between container and animal. On Beller Street, among passers-by and café terraces, the equestrian fragment leaves an open question: what remains of a form when the whole is missing?',
      ],
    },
  },
  {
    key: 6,
    artist: 'artist-alin-carpen',
    title: { ro: 'Cal troian', en: 'Trojan Horse' },
    material: { ro: 'Fier, lucrare cinetică', en: 'Iron, kinetic work' },
    dimensions: '250 × 170 × 70 cm',
    year: '2018',
    description: {
      ro: [
        'Un volum geometric din fier, ridicat pe doi piloni, din care se desprinde o formă triunghiulară: calul redus la esență. Din exterior, construcția pare solidă și închisă. Deschiderea din cap dezvăluie un interior de oglinzi, în care o formă întunecată se multiplică. Asemenea personajelor din „Așteptându-l pe Godot”, care așteaptă pe cineva care nu vine niciodată, lucrarea promite un sens și ascunde un gol: fragilitate, neliniște, moarte.',
      ],
      en: [
        'A geometric iron volume raised on two pillars, from which a triangular form extends: the horse reduced to its essence. From outside, the construction looks solid and closed. The opening in the head reveals a mirrored interior where a dark form multiplies. Like the characters in “Waiting for Godot”, waiting for someone who never comes, it promises meaning and hides a void: fragility, unease, death.',
      ],
    },
  },
  {
    key: 7,
    artist: 'artist-alin-carpen',
    title: { ro: 'Coloana', en: 'Column' },
    material: IRON,
    dimensions: '230 × 70 × 50 cm',
    year: '2022',
    description: {
      ro: [
        'O coloană din fier din care materia iese în afară. De-a lungul muchiei, plăci triunghiulare se desprind din corp și se ridică una peste alta, ca dinții unei lame. Nimic nu este adăugat, totul este tăiat din aceeași masă. La fel lucrează timpul: taie din noi, lasă urmele la vedere și nu întoarce nimic din ce a luat.',
      ],
      en: [
        'An iron column from which the matter pushes outwards. Along the edge, triangular plates come away from the body and rise one above the other, like the teeth of a blade. Nothing is added; everything is cut from the same mass. Time works in the same way: it cuts into us, leaves the marks visible and returns nothing of what it has taken.',
      ],
    },
  },
  {
    key: 8,
    artist: 'artist-alin-carpen',
    title: { ro: 'Coloana II', en: 'Column II' },
    material: IRON,
    dimensions: '230 × 50 × 70 cm',
    year: '2022',
    description: {
      ro: [
        'O coloană din fier, străbătută pe toată înălțimea de o deschidere cu margini zimțate. Golul urcă prin materie ca o mușcătură continuă. Lucrarea vorbește despre timp ca forță care consumă: fiecare clipă trecută ia ceva ce nu mai poate fi întors. Timpul nu așteaptă și nu avertizează. Înghite secundă după secundă și, odată cu ele, ne înghite și pe noi.',
      ],
      en: [
        'An iron column crossed along its full height by an opening with jagged edges. The void rises through the matter like a continuous bite. The work speaks of time as a consuming force: every passing moment takes something that cannot be returned. Time does not wait or warn. It swallows second after second and, with them, it swallows us.',
      ],
    },
  },
  {
    key: 9,
    artist: 'artist-alin-carpen',
    title: { ro: 'Memorie', en: 'Memory' },
    material: IRON,
    dimensions: '180 × 70 × 50 cm',
    year: '2024',
    description: {
      ro: [
        'O cutie de fier ridicată pe un cadru metalic, ca o vitrină a trecutului. Prin deschiderile circulare se văd fotografii-portret vechi, adunate laolaltă. Pentru artist, portretul unui om care nu mai trăiește devine mai mult decât o imagine: este dovada că acel om a existat, a privit lumea, a iubit, a sperat și a lăsat ceva în urmă. Lucrarea păstrează aceste urme mărunte împotriva uitării.',
      ],
      en: [
        'An iron box raised on a metal frame, like a display case of the past. Through the circular openings, one sees old portrait photographs gathered together. For the artist, the portrait of someone no longer alive becomes more than an image: it proves this person existed, looked at the world, loved, hoped, and left something behind. The work keeps these small traces from being forgotten.',
      ],
    },
  },
  {
    key: 10,
    artist: 'artist-alexandru-ranga',
    title: { ro: 'Fulger', en: 'Lightning' },
    material: IRON,
    dimensions: '250 × 10 × 30 cm',
    year: '2026',
    description: {
      ro: [
        'Fulger face parte din seria Fulgere. Ramificațiile de metal traversează spațiul ca un traseu de energie prins cu o clipă înainte să dispară. Forma trimite la fulgurit, tubul de sticlă pe care trăsnetul îl lasă în nisip când lovește. Sculptura nu imită fenomenul, ci fixează pe loc o energie care, altfel, ar trece neobservată. Suspendată deasupra străzii, lucrarea nu decorează spațiul, ci i se întâmplă.',
        '*Text adaptat după Cristian Cojanu',
      ],
      en: [
        'Lightning belongs to the Lightnings series. Its metal branches cross the space like a path of energy caught an instant before it vanishes. The form recalls fulgurite, the glass tube lightning leaves in sand when it strikes. The sculpture does not imitate the phenomenon; it fixes, in one spot, an energy that would otherwise pass unnoticed. Suspended above the street, the work does not decorate the space. It happens to it.',
        '*Adapted from a text by Cristian Cojanu.',
      ],
    },
  },
  {
    key: 11,
    artist: 'artist-elena-scutaru',
    title: { ro: 'Cariatida', en: 'Caryatid' },
    material: {
      ro: 'Rășini acrilice, carton, pigmenți; dimensiuni naturale',
      en: 'Acrylic resin, cardboard, pigments; life-size',
    },
    year: '2015',
    description: {
      ro: [
        'Figura verticală, frontală, reia motivul cariatidei antice, corpul care susține arhitectura și devine el însuși arhitectură. Cartonul ondulat, fixat în rășină, construiește umerii și veșmântul ca pe niște coloane. Chipul, închis într-un disc, pare o mască aplicată pe structură: arhetipul străvechi se întâlnește cu imaginarul postuman al hibridului.',
      ],
      en: [
        'The upright, frontal figure revisits the motif of the ancient caryatid, the body that supports architecture and itself becomes architecture. Corrugated cardboard, fixed in resin, constructs the shoulders and garment like columns. The face, enclosed within a disc, appears as a mask applied to the structure: an ancient archetype meets the posthuman imaginary of the hybrid.',
      ],
    },
  },
  {
    key: 12,
    artist: 'artist-elena-scutaru',
    title: { ro: 'Avatar II', en: 'Avatar II' },
    material: {
      ro: 'Tehnică mixtă: rășini acrilice, hârtie, lemn, spumă poliuretanică',
      en: 'Mixed media: acrylic resins, paper, wood, polyurethane foam',
    },
    dimensions: '180 × 70 × 50 cm',
    year: '2019',
    description: {
      ro: [
        'Brațele deschise și corpul învelit în straturi de hârtie și rășină dau figurii un gest ambiguu, între ofrandă și chemare. Suprafața pare o piele încă în formare. Seria explorează hibridul ca arhetip: o ființă compozită, cu identitate fluidă, între zeitățile antropo-zoomorfe ale mitologiei și clona epocii tehnologice.',
      ],
      en: [
        'The open arms and body wrapped in layers of paper and resin give the figure an ambiguous gesture, suspended between offering and invocation. The surface resembles skin still in the process of forming. The series explores the hybrid as an archetype: a composite being with a fluid identity, situated between the anthropo-zoomorphic deities of mythology and the clone of the technological age.',
      ],
    },
  },
  {
    key: 13,
    artist: 'artist-elena-scutaru',
    title: { ro: 'Avatar III', en: 'Avatar III' },
    material: {
      ro: 'Rășini acrilice, textil, structură metalică, ready-made',
      en: 'Acrylic resins, textile, metal structure, ready-made',
    },
    dimensions: '220 × 70 × 70 cm',
    year: '2019–2025',
    description: {
      ro: [
        'Două figuri se privesc de aproape, înălțate pe structuri metalice. Chipurile aproape identice trimit la multiplicare și clonare, iar textilul și obiectele găsite fac corpurile să pară încă în construcție. Seria Avatar crește în etape succesive, cu straturi adăugate în timp: identitatea apare ca proces deschis, nu ca formă încheiată.',
      ],
      en: [
        'Two figures face each other at close range, elevated on metal structures. Their nearly identical faces evoke multiplication and cloning, while the textile and found objects make the bodies appear still under construction. The Avatar series develops in successive stages, with layers added over time: identity emerges as an open-ended process rather than a finished form.',
      ],
    },
  },
  ...(
    [
      [
        14,
        '2022–2026',
        'În această lucrare, piatra este folosită ca material de bază și punct de plecare. Legătura cu materialul, formată încă din copilărie în atelierul tatălui său, Constantin Marinete, se regăsește în toată activitatea sculptorului. Compoziția deschide seria prin accentul pus pe materie: greutate, densitate și formă redusă la elementele esențiale.',
      ],
      [
        15,
        undefined,
        'Relația dintre generații este una dintre temele care apar frecvent în lucrările lui Alexandru Marinete. Meșteșugul învățat în atelierul tatălui său devine aici o cheie de interpretare a formei: continuitate, memorie și transmitere. Sculptura nu ilustrează direct această relație, ci o exprimă prin limbajul durabil al pietrei.',
      ],
      [
        16,
        undefined,
        'În lucrările lui Marinete, duritatea pietrei este mereu pusă în contrast cu fragilitatea și expresivitatea formei. Această compoziție explorează tensiunea dintre rezistența materialului și modul în care sculptura poate sugera sensibilitate. Greutatea nu anulează emoția, ci îi dă substanță, densitate și permanență.',
      ],
      [
        17,
        undefined,
        'Cioplirea implică un proces de reducere în care forma apare prin îndepărtarea treptată a materiei. În această compoziție, relația dintre volum și material este esențială. Intervenția sculptorului nu ascunde natura pietrei, ci lucrează cu densitatea și rezistența ei, căutând o formă concentrată, fără detalii inutile.',
      ],
      [
        18,
        undefined,
        'Relația dintre volume apare des în sculptura lui Alexandru Marinete, de la formele stilizate din seria Muse până la lucrările sale nonfigurative. În această compoziție, sensul se creează prin raportul dintre elemente: apropiere, separare, sprijin sau tensiune. Fiecare element poate fi privit separat, dar funcționează mai ales prin legăturile dintre ele.',
      ],
      [
        19,
        undefined,
        'Simplificarea figurativului permite formei să fie deschisă la mai multe interpretări. Această abordare apare și în alte lucrări ale lui Marinete, unde corpul, pasărea sau elementul natural sunt reduse până la limita dintre ceea ce este recognoscibil și ceea ce este abstract. Compoziția continuă această explorare, punând accent pe siluetă, proporții și prezența materială.',
      ],
      [
        20,
        undefined,
        'Sculptura lui Marinete nu spune mereu o poveste clară. Forma rămâne deschisă, iar sensul se construiește și prin experiența privitorului. În această compoziție, piatra nu este doar un suport pentru o imagine, ci devine un mediu pentru relația dintre material, formă, memorie și percepție.',
      ],
      [
        21,
        undefined,
        'Greutatea și dorința de mișcare apar adesea în lucrările lui Alexandru Marinete. În alte serii, această tensiune se vede în contrastul dintre piatră și zbor, dintre stabilitate și ascensiune. Ultima compoziție poate încheia seria în același spirit: materia rămâne grea și concretă, dar forma încearcă să schimbe percepția și să o desprindă de simpla masă minerală.',
      ],
    ] as const
  ).map(
    ([key, year, ro]): WorkSource => ({
      key,
      artist: 'artist-alexandru-marinete',
      title: { ro: `Compoziție ${key - 13}`, en: `Composition ${key - 13}` },
      material: STONE,
      dimensions: '120 × 40 × 50 cm',
      ...(year ? { year } : {}),
      description: { ro: [ro], en: [] },
    }),
  ),
  {
    key: 22,
    artist: 'artist-alexandru-papuc',
    title: { ro: 'Ființă spectrală I', en: 'Spectral Being I' },
    material: { ro: 'Rășină, laser', en: 'Resin, laser' },
    dimensions: '120 × 40 × 50 cm',
    year: '2026',
    description: {
      ro: [
        'Ecorșeu 1 propune un model al prezenței care nu se sprijină pe carne sau pe greutate, ci pe lumină. Suspendată, forma își pierde masa și rămâne schelet, traseu, refracție. Lumina devine materie sculpturală: arhivează, refractă, multiplică. Din golul ridicat la rang de anatomie apare o prezență spectrală, care continuă să existe dincolo de organic.',
      ],
      en: [
        'The work proposes a model of presence that rests not on flesh or weight, but on light. Suspended, the form loses its mass and remains a skeleton, a trace, a refraction. Light becomes sculptural matter: it archives, refracts, multiplies. Raised from the void to the rank of anatomy, a presence appears and continues beyond the organic.',
      ],
    },
  },
  {
    key: 23,
    artist: 'artist-alexandru-papuc',
    title: { ro: 'Ființă spectrală II', en: 'Spectral Being II' },
    material: { ro: 'Rășină, laser', en: 'Resin, laser' },
    dimensions: '120 × 40 × 50 cm',
    year: '2026',
    description: {
      ro: [
        'Ecorșeu 2 reia interogația asupra corpului redus la structură. Anatomia nu mai descrie un organism, ci un traseu de lumină prin care materia se arată și se retrage. Fragilitatea devine principiu constructiv, iar absența capătă substanță. Corpul rămâne o poezie alcătuită din lumină, o prezență care persistă după retragerea materiei.',
      ],
      en: [
        'The work returns to the body reduced to structure. Anatomy no longer describes an organism, but a path of light through which matter shows itself and withdraws. Fragility becomes a constructive principle and absence acquires substance. The body remains a poem made of light.',
      ],
    },
  },
  {
    key: 24,
    artist: 'artist-ovidiu-toader',
    title: { ro: 'Colector I', en: 'Collector I' },
    material: STEEL,
    dimensions: '300 × 80 × 100 cm',
    year: '2026',
    description: {
      ro: [
        'Lucrarea pornește de la nevoia continuă de a studia și de a documenta lumea din jur. Volumele de oțel, umflate și sudate pe contur, cresc unele din altele ca un organism care își adună propriile fragmente. Forma verticală funcționează ca o arhivă vie, în care colectarea devine un mod de a exista. Face parte din seria Laborator, începută în 2023.',
      ],
      en: [
        'The work stems from an ongoing need to study and document the world around us. The steel volumes, inflated and welded along their contours, grow out of one another like an organism gathering its own fragments. The vertical form functions as a living archive, in which collecting becomes a way of existing. It is part of the Laboratory series, begun in 2023.',
      ],
    },
  },
  {
    key: 25,
    artist: 'artist-ovidiu-toader',
    title: { ro: 'Colector II', en: 'Collector II' },
    material: STEEL,
    dimensions: '140 × 60 × 70 cm',
    year: '2026',
    description: {
      ro: [
        'Structura se arcuiește peste o formă așezată la bază, iar partea superioară se apleacă spre ea, într-un gest de observație atentă. Ca într-un laborator, obiectul adunat devine subiect de analiză. Oțelul lustruit reflectă strada și îi include pe trecători în scena studiului. Face parte din seria Laborator, începută în 2023.',
      ],
      en: [
        'The structure arches over a form placed at its base, while the upper section bends toward it in a gesture of close observation. As in a laboratory, the collected object becomes a subject of analysis. The polished steel reflects the street and incorporates passers-by into the scene of observation. It is part of the Laboratory series, begun in 2023.',
      ],
    },
  },
  {
    key: 26,
    artist: 'artist-victoria-zidaru',
    title: { ro: 'Coloana', en: 'Column' },
    material: IRON_HAY,
    dimensions: '240 × 100 × 100 cm',
    year: '2026',
    description: {
      ro: [
        'Cordoanele de fân se răsucesc în spirală pe o structură de inele metalice și urcă pe verticală, ca o creștere vegetală. Coloana, formă arhetipală a sculpturii, este realizată din cea mai modestă materie: iarba uscată, strânsă și împletită manual. Volumul pare masiv, dar rămâne permeabil, lasă să treacă aerul și lumina și păstrează mirosul câmpului din care vine.',
      ],
      en: [
        'Cords of hay twist spirally around a structure of metal rings and rise vertically, like organic growth. The column, an archetypal sculptural form, is made from the humblest of materials: dried grass, gathered and braided by hand. The volume appears massive yet remains permeable, allowing air and light to pass through while retaining the scent of the field from which it came.',
      ],
    },
  },
  {
    key: 27,
    artist: 'artist-victoria-zidaru',
    title: { ro: 'Cuib', en: 'Nest' },
    material: { ro: 'Textil, fier', en: 'Textile, iron' },
    dimensions: '100 × 100 × 100 cm',
    year: '2026',
    description: {
      ro: [
        'Cordoane moi, răsucite și suprapuse pe o armătură de fier, se strâng spre interior și formează un gol ocrotit. Cuibul este una dintre formele constante ale artistei: o construcție care nu se opune lumii, ci o adăpostește. Gestul repetat al împletirii, preluat din lucrul manual tradițional, devine un ritual lent de grijă, așezat în mijlocul străzii.',
      ],
      en: [
        'Soft cords, twisted and layered over an iron framework, gather inward to form a protected void. The nest is one of the artist’s recurring forms: a structure that does not resist the world but offers it shelter. The repeated gesture of weaving, drawn from traditional handcraft, becomes a slow ritual of care, placed in the middle of the street.',
      ],
    },
  },
  {
    key: 28,
    artist: 'artist-victoria-zidaru',
    title: { ro: 'Cub', en: 'Cube' },
    material: IRON_HAY,
    dimensions: '100 × 100 × 100 cm',
    year: '2026',
    description: {
      ro: [
        'Un cadru geometric rigid este traversat de cordoane de fân care trec prin ochiurile lui și se revarsă în exterior. Ordinea construită și creșterea vegetală ocupă același volum, fără ca una să o anuleze pe cealaltă. Printre fibre sunt prinse mici suluri cu cuvinte scrise de mână, ca niște mesaje lăsate în interiorul structurii.',
      ],
      en: [
        'A rigid geometric frame is crossed by cords of hay that pass through its openings and spill outward. Constructed order and organic growth inhabit the same volume without either cancelling out the other. Small scrolls bearing handwritten words are tucked among the fibres, like messages left inside the structure.',
      ],
    },
  },
]

let keySeq = 0
const nextKey = () => `k${(keySeq++).toString(36).padStart(4, '0')}`

function blocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: nextKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
  }))
}

function localeBlock(value: { ro: string[]; en: string[] }) {
  return {
    _type: 'localeBlock',
    ro: blocks(value.ro),
    ...(value.en.length ? { en: blocks(value.en) } : {}),
  }
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return SKIP_DIRS.has(name) ? [] : walk(path)
    return [path]
  })
}

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.heic'])

function imagesByKey(): Map<number, string[]> {
  const byKey = new Map<number, string[]>()
  for (const artist of ARTISTS) {
    for (const path of walk(resolve(SOURCE_ROOT, artist.dir))) {
      if (!IMAGE_EXT.has(extname(path).toLowerCase())) continue
      const match = /^(\d+)[._ ]/.exec(path.split('/').at(-1) ?? '')
      if (!match?.[1]) continue
      const key = Number(match[1])
      if (!WORKS.some((w) => w.key === key && w.artist === artist.id)) continue
      byKey.set(key, [...(byKey.get(key) ?? []), path])
    }
  }
  for (const list of byKey.values())
    list.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  return byKey
}

async function toJpeg(path: string, scratch: string): Promise<Buffer> {
  let input = path
  if (extname(path).toLowerCase() === '.heic') {
    input = join(scratch, `${keySeq++}.jpg`)
    execFileSync('sips', ['-s', 'format', 'jpeg', path, '--out', input], { stdio: 'ignore' })
  }
  return sharp(readFileSync(input))
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer()
}

async function main() {
  const images = imagesByKey()

  if (dryRun) {
    for (const artist of ARTISTS) {
      console.log(
        `${artist.id}  portrait=${artist.portrait ?? '-'}  bio ro=${artist.bio.ro.length}p en=${artist.bio.en.length}p`,
      )
    }
    for (const work of WORKS) {
      const files = images.get(work.key) ?? []
      console.log(
        [
          String(work.key).padStart(2),
          work.artist.replace('artist-', '').padEnd(18),
          `${work.title.ro} / ${work.title.en}`.padEnd(40),
          (work.material ? `${work.material.ro} / ${work.material.en}` : '-').padEnd(40),
          (work.dimensions ?? '-').padEnd(18),
          (work.year ?? '-').padEnd(10),
          `desc ro=${work.description.ro.length} en=${work.description.en.length}`,
          `img=${files.length}`,
        ].join('  '),
      )
    }
    return
  }

  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set')
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '',
    token,
    useCdn: false,
  })

  const scratch = mkdtempSync(join(tmpdir(), 'galeria-beller-'))
  try {
    const upload = async (path: string) => {
      const asset = await client.assets.upload('image', await toJpeg(path, scratch), {
        filename: `${path
          .split('/')
          .at(-1)
          ?.replace(/\.[^.]+$/, '')}.jpg`,
      })
      return { _type: 'reference' as const, _ref: asset._id }
    }

    for (const artist of ARTISTS) {
      const set: Record<string, unknown> = { bio: localeBlock(artist.bio) }
      if (artist.portrait) {
        set.portrait = {
          _type: 'image',
          asset: await upload(resolve(SOURCE_ROOT, artist.dir, artist.portrait)),
          alt: `Portrait of ${artist.name}`,
        }
      }
      await client.patch(artist.id).set(set).commit()
      console.log(`patched ${artist.id}`)
    }

    for (const work of WORKS) {
      const artist = ARTISTS.find((a) => a.id === work.artist)
      const files = images.get(work.key) ?? []
      const workImages = []
      for (const [i, path] of files.entries()) {
        const alt =
          files.length > 1
            ? `${work.title.en} by ${artist?.name}, photo ${i + 1} of ${files.length}`
            : `${work.title.en} by ${artist?.name}`
        workImages.push({ _type: 'image', _key: nextKey(), asset: await upload(path), alt })
      }
      await client.createOrReplace({
        _id: `work-${work.key}`,
        _type: 'work',
        key: work.key,
        artist: { _type: 'reference', _ref: work.artist },
        title: { _type: 'localeString', ...work.title },
        ...(work.material ? { material: { _type: 'localeString', ...work.material } } : {}),
        ...(work.dimensions ? { dimensions: work.dimensions } : {}),
        ...(work.year ? { year: work.year } : {}),
        description: localeBlock(work.description),
        images: workImages,
      })
      console.log(`wrote work-${work.key} (${workImages.length} images)`)
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
