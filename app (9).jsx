import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Star, CheckCircle, ChevronRight, ChevronLeft, 
  X, ArrowRight, Trash2, Plus, Minus, Copy, QrCode, 
  AlertTriangle, ShieldAlert, ArrowLeft, User, Search
} from 'lucide-react';

// --- COMPONENTE DE PÁGINA DE PRODUTO (Otimizado fora do App) ---
const ProductPage = ({ product, onBack, onAddToCart, activeImageIndex, setActiveImageIndex }) => {
  if (!product) return null;
  
  return (
    <div className="py-20 px-4 max-w-5xl mx-auto animate-in fade-in duration-500">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-blue-900 font-bold hover:underline">
        <ArrowLeft size={20} /> Voltar para a Loja
      </button>
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row mb-12">
        <div className="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-inner group">
            <img src={product.images[activeImageIndex]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : product.images.length - 1))} className="p-2 bg-white rounded-full shadow-lg text-blue-900"><ChevronLeft size={24} /></button>
                <button onClick={() => setActiveImageIndex(prev => (prev < product.images.length - 1 ? prev + 1 : 0))} className="p-2 bg-white rounded-full shadow-lg text-blue-900"><ChevronRight size={24} /></button>
                 </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex justify-center gap-3">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} onClick={() => setActiveImageIndex(idx)} className={`w-20 h-20 rounded-xl cursor-pointer object-cover border-2 transition-all ${activeImageIndex === idx ? 'border-blue-900 scale-110' : 'border-transparent opacity-70'}`} alt="Thumbnail" />
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">{product.category}</span>
          <h2 className="text-3xl font-black text-slate-800 mb-4">{product.name}</h2>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-black text-blue-900">R$ {product.price.toFixed(2)}</span>
            <span className="text-xl text-slate-400 line-through">R$ {product.oldPrice.toFixed(2)}</span>
            </div>
          <p className="text-slate-600 leading-relaxed mb-8 text-lg">{product.description}</p>
          <div className="space-y-3 mb-8">
            {product.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-700 font-medium"><CheckCircle size={18} className="text-green-500" /> {f}</div>
            ))}
            </div>
          <button onClick={() => onAddToCart(product)} className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-800 transition-all shadow-xl flex items-center justify-center gap-3">
            <ShoppingCart size={24} /> ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto mt-16">
        <div className="flex items-center gap-3 mb-8">
          <Star className="text-yellow-400 fill-yellow-400" size={28} />
          <h3 className="text-2xl font-black text-blue-900 uppercase">Avaliações de Clientes</h3>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.reviews.map((rev, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold"><User size={20} /></div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{rev.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{rev.city}</p>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-400">
                {[...Array(rev.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 italic text-sm leading-relaxed">"{rev.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // --- ESTADOS ---
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('reino_brinquedos_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '', document: '' });
  const [copied, setCopied] = useState(false);
  const [checkoutTimer, setCheckoutTimer] = useState(600);
  const [searchQuery, setSearchQuery] = useState('');

  // --- BANCO DE DADOS ---
  const products = [
    {
      id: 1,
      name: "Banco Imobiliário Estrela",
      category: "Jogos de Tabuleiro",
      collection: "Premium",
      price: 59.90,
      oldPrice: 104.24,
      discount: "43%",
      images: ["https://i.imgur.com/IqHTW3L.png", "https://i.imgur.com/gMEstCN.png", "https://i.imgur.com/MATw8LZ.png"],
      description: "O clássico jogo de compra e venda de propriedades. Edição especial com localizações brasileiras, ideal para reunir a família.",
      features: ["Edição Estrela Original", "Manual Completo Incluso", "Diversão Garantida"],
      reviews: [
        { name: "Carlos Eduardo", city: "São Paulo - SP", text: "Chegou super rápido via SEDEX! O jogo é original.", rating: 5 },
        { name: "Mariana Souza", city: "Belo Horizonte - MG", text: "Melhor preço que encontrei. Recomendo!", rating: 5 },
      ]
    },
    {
      id: 2,
      name: "Bicicleta de Equilíbrio BUBA com Som",
      category: "Bicicleta de equilíbrio",
      collection: "Mais Desejados",
      price: 89.90,
      oldPrice: 159.90,
      discount: "44%",
      images: ["https://i.imgur.com/iVlIDPG.png", "https://i.imgur.com/MGcylpd.jpeg", "https://i.imgur.com/jb7oeH7.jpeg"],
      description: "Projetada para oferecer uma experiência segura, focada no desenvolvimento do equilíbrio e coordenação motora.",
      features: ["Rodas Duplas Estáveis", "Desenvolve Coordenação Motora", "Sistema de Som Divertido"],
      reviews: [{ name: "Ana Paula", city: "Campinas - SP", text: "Meu filho amou! Aprendeu a se equilibrar rápido.", rating: 5 }]
    },
    {
      id: 3,
      name: "Bicicleta Infantil Nathor Aro 12 Rosa Flower",
      category: "Bicicletas Infantis",
      collection: "Premium",
      price: 119.90,
      oldPrice: 199.90,
      discount: "40%",
      images: ["https://i.imgur.com/gdFQjj6.png", "https://i.imgur.com/DbCPuhV.png", "https://i.imgur.com/QYGqML4.png"],
      description: "Indicada para crianças a partir de 3 anos. Equipada com os melhores itens de segurança e conforto.",
      features: ["Certificada de Segurança", "Postura Ergonômica", "Design Flower Exclusivo"],
      reviews: [{ name: "Letícia S.", city: "Recife - PE", text: "Linda demais! Minha filha amou.", rating: 5 }]
    },
    {
      id: 4,
      name: "Boneca Gabbys Dollhouse Orelhas de Gato",
      category: "Bonecos e Bonecas",
      collection: "Mais Desejados",
      price: 55.90,
      oldPrice: 86.90,
      discount: "35%",
      images: ["https://i.imgur.com/7GaK7Ty.png", "https://i.imgur.com/MJ0sdVE.png", "https://i.imgur.com/RiuAr0Z.png"],
      description: "Inspirada na popular série de animação, a Gabby Girl de 20cm vem com sua tiara de orelhas de gato.",
      features: ["Tamanho 20cm", "Tiara de Orelhas de Gato", "Material de Alta Qualidade"],
      reviews: [{ name: "Beatriz F.", city: "Salvador - BA", text: "Boneca linda e bem feita.", rating: 5 }]
    },
    {
      id: 5,
      name: "Boneca Little Baby Minha Primeira Oração",
      category: "Bonecos e Bonecas",
      collection: "Ofertas Relâmpago",
      price: 25.90,
      oldPrice: 59.99,
      discount: "57%",
      images: ["https://i.imgur.com/XueMHIK.png", "https://i.imgur.com/Ngcov3i.png", "https://i.imgur.com/dRdjToT.png"],
      description: "Uma companheira encantadora que proporciona momentos de carinho e interação familiar.",
      features: ["Interação Afetiva", "Material Macio e Seguro", "Estímulo ao Cuidado"],
      reviews: [{ name: "Maria Eduarda", city: "Fortaleza - CE", text: "Presente perfeito, muito fofa!", rating: 5 }]
    },
    {
      id: 6,
      name: "Bonecos Galinha Pintadinha (Kit Família)",
      category: "Bonecos e Bonecas",
      collection: "Premium",
      price: 69.90,
      oldPrice: 107.44,
      discount: "35%",
      images: ["https://i.imgur.com/U8cidvU.png", "https://i.imgur.com/nlJc31E.png", "https://i.imgur.com/jdwiD0Z.png"],
      description: "Kit completo com Pintinho Amarelinho, Galo Carijó e Galinha Pintadinha em vinil macio.",
      features: ["Kit com 3 Bonecos", "Vinil Macio e Atóxico", "Alta Durabilidade"],
      reviews: [{ name: "Roberto J.", city: "Vitória - ES", text: "Meus filhos amam! Muito resistentes.", rating: 5 }]
    },
    {
      id: 7,
      name: "Caminhão Dinossauro 3 em 1 com Pista",
      category: "Pistas",
      collection: "Premium",
      price: 69.90,
      oldPrice: 149.50,
      discount: "53%",
      images: ["https://i.imgur.com/ikvDFMo.png", "https://i.imgur.com/EBY1UWM.png", "https://i.imgur.com/rutXERX.png"],
      description: "Conjunto épico com 6 carrinhos, pista lançadora e dinossauro com dois níveis de altura.",
      features: ["6 Carrinhos Inclusos", "Pista com Lançador", "Dois Níveis de Altura"],
      reviews: [{ name: "Gustavo M.", city: "Natal - RN", text: "O melhor brinquedo que já comprei. Horas de diversão!", rating: 5 }]
    },
    {
      id: 8,
      name: "Carrinho Elétrico Mini Range Rover Evoque",
      category: "Carrinho elétrico infantil",
      collection: "Premium",
      price: 899.00,
      oldPrice: 1514.32,
      discount: "41%",
      images: ["https://i.imgur.com/y2frJ31.png", "https://i.imgur.com/IAMMned.png", "https://i.imgur.com/LETjO6L.png"],
      description: "Modelo completo com realismo impressionante. Possui painel equipado com luzes, sons, MP3, USB e Bluetooth.",
      features: ["Conectividade Bluetooth/USB", "Painel Digital Realista", "Suporta até 30kg"],
      reviews: [{ name: "André L.", city: "São Paulo - SP", text: "Luxo total! O carrinho é lindo e a bateria dura bem.", rating: 5 }]
    },
    {
      id: 9,
      name: "Carrinho RC Quick Run 360 Drift 4x4",
      category: "Veículos de controle remoto",
      collection: "Ofertas Relâmpago",
      price: 44.90,
      oldPrice: 78.99,
      discount: "43%",
      images: ["https://i.imgur.com/jO6P5z7.png", "https://i.imgur.com/5ttTBah.png", "https://i.imgur.com/WxwVtJu.png"],
      description: "Projeto durável com pneus resistentes a colisões e tecnologia de 2.4 GHz para evitar interferências.",
      features: ["Tração 4x4 Drift", "Frequência 2.4 GHz", "Alcance de 40 Metros"],
      reviews: [{ name: "Thiago S.", city: "Belém - PA", text: "Muito rápido e faz curvas incríveis!", rating: 5 }]
    },
    {
      id: 10,
      name: "Cozinha Infantil Princess Kitchen",
      category: "Cozinha de brinquedo",
      collection: "Premium",
      price: 76.90,
      oldPrice: 130.05,
      discount: "41%",
      images: ["https://i.imgur.com/hvwQpc4.png", "https://i.imgur.com/Nb46tIS.png"],
      description: "Experiência mágica com efeitos de som e luzes. Acompanha acessórios coloridos em maleta compacta.",
      features: ["Efeitos de Som e Luz", "Acessórios Inclusos", "Formato Maleta Portátil"],
      reviews: [{ name: "Camila G.", city: "Cuiabá - MT", text: "Minha filha ama brincar de chef!", rating: 5 }]
    },
    {
      id: 11,
      name: "Squeezy Dumpling – Brinquedos Surpresa",
      category: "Squishies",
      collection: "Premium",
      price: 22.90,
      oldPrice: 49.90,
      discount: "54%",
      images: ["https://i.imgur.com/CiHWeDf.png", "https://i.imgur.com/tNstmko.png", "https://i.imgur.com/cjI9vMI.jpeg"],
      description: "Combine fofura, surpresa e brilho! Cada caixinha esconde um Dumpling macio para colecionar.",
      features: ["Experiência Sensorial", "Modelos Brilhantes", "Material Ultra Macio"],
      reviews: [{ name: "Isabela R.", city: "Londrina - PR", text: "Muito fofinho e relaxante!", rating: 5 }]
    },
    {
      id: 12,
      name: "Boneco Homem Aranha Articulado",
      category: "Bonecos e Bonecas",
      collection: "Ofertas Relâmpago",
      price: 29.90,
      oldPrice: 49.90,
      discount: "40%",
      images: ["https://i.imgur.com/CxhW9dH.png", "https://i.imgur.com/JFedtmm.png", "https://i.imgur.com/KKQUwak.png"],
      description: "Leve o herói da Marvel para casa! Com diversos pontos de articulação para poses dinâmicas.",
      features: ["Múltiplos Pontos de Articulação", "Design Detalhado", "Material Resistente"],
      reviews: [{ name: "Gabriel H.", city: "Teresina - PI", text: "Qualidade ótima, articulações firmes.", rating: 5 }]
    },
    {
      id: 13,
      name: "Jogo de mesa CARA A CARA COM APLICATIVO – ESTRELA",
      category: "Jogos de tabuleiro",
      collection: "Ofertas Relâmpago",
      price: 39.90,
      oldPrice: 57.90,
      discount: "31%",
      images: ["https://i.imgur.com/wvch0KW.png", "https://i.imgur.com/pCILX00.png", "https://i.imgur.com/qbXXnZE.png"],
      description: "O clássico Cara a Cara ficou ainda mais divertido! Agora você pode incrementar a brincadeira tradicional com um aplicativo inovador.",
      features: ["Integração com Aplicativo", "Clássico da Estrela", "Ideal para Família"],
      reviews: [{ name: "Ricardo M.", city: "Curitiba - PR", text: "O app deixa o jogo muito mais dinâmico!", rating: 5 }]
    },
    {
      id: 14,
      name: "SUPER KIT AREIA CINÉTICA COM 25 POTES + FORMINHA",
      category: "Massinha",
      collection: "Ofertas Relâmpago",
      price: 48.90,
      oldPrice: 96.90,
      discount: "50%",
      images: ["https://i.imgur.com/f8rs2tm.png", "https://i.imgur.com/zm7kLDN.png", "https://i.imgur.com/Q711AVn.png"],
      description: "As crianças vão adorar brincar com este super kit de areia mágica! São 25 potinhos coloridos.",
      features: ["25 Potes de 60g", "Acompanha Forminha", "Cores Vibrantes"],
      reviews: [{ name: "Sônia L.", city: "Manaus - AM", text: "Kit gigante, as crianças não param de brincar.", rating: 5 }]
    },
    {
      id: 15,
      name: "KIT 9 CARROS E PERSONAGENS PATRULHA CANINA COM FRICÇÃO",
      category: "Veículos de Brinquedo",
      collection: "Ofertas Relâmpago",
      price: 37.90,
      oldPrice: 67.90,
      discount: "44%",
      images: ["https://i.imgur.com/vEjZDwx.png", "https://i.imgur.com/R7MHJMe.jpeg", "https://i.imgur.com/U4XjYOI.png"],
      description: "Leve a diversão da Patrulha Canina com este incrível kit composto por 9 carrinhos e 9 personagens colecionáveis!",
      features: ["9 Veículos com Fricção", "9 Personagens Inclusos", "Alta Durabilidade"],
      reviews: [{ name: "Marcos V.", city: "Porto Alegre - RS", text: "Ótimo custo benefício, veio tudo certinho.", rating: 5 }]
    },
    {
      id: 16,
      name: "KIT LUVAS E LANÇADORES DE TEIA DO HOMEM-ARANHA + MÁSCARA",
      category: "Fantasia",
      collection: "Mais Desejados",
      price: 19.90,
      oldPrice: 36.70,
      discount: "46%",
      images: ["https://i.imgur.com/27drWkR.png", "https://i.imgur.com/e4NmYqm.png", "https://i.imgur.com/g8MYG5O.png"],
      description: "Com o Lançador de Teias do Homem-Aranha, você pode viver as aventuras de Peter e defender o mundo dos vilões.",
      features: ["Lançador de Teias", "Máscara Inclusa", "Kit Completo Herói"],
      reviews: [{ name: "Felipe A.", city: "Goiânia - GO", text: "Meu filho não tira a máscara do rosto!", rating: 5 }]
    },
    {
      id: 17,
      name: "LEGO - Fórmula 1 Ferrari SF-24",
      category: "Brinquedos de Montar",
      collection: "Mais Desejados",
      price: 119.90,
      oldPrice: 199.90,
      discount: "40%",
      images: ["https://i.imgur.com/ZPFVsDG.png", "https://i.imgur.com/muYVwKQ.png", "https://i.imgur.com/8lQNSmJ.png"],
      description: "Sinta toda a emoção da Fórmula 1® com o LEGO® Speed Champions Ferrari SF-24 F1 Race Car.",
      features: ["275 Peças Originais", "Minifigura Piloto Ferrari", "Detalhes Autênticos"],
      reviews: [{ name: "André S.", city: "São Paulo - SP", text: "Peças perfeitas, montagem deliciosa.", rating: 5 }]
    },
    {
      id: 18,
      name: "KIT MASSINHA PATRULHA CANINA – 6 POTES",
      category: "Massinha",
      collection: "Ofertas Relâmpago",
      price: 37.90,
      oldPrice: 50.33,
      discount: "25%",
      images: ["https://i.imgur.com/4Ov2lZq.png", "https://i.imgur.com/os8n1L6.png", "https://i.imgur.com/19ZJJKV.png"],
      description: "O Kit Massinha Patrulha Canina é uma opção divertida e criativa para as crianças.",
      features: ["6 Potes de Massinha", "Cores Vibrantes", "Acessórios de Modelagem"],
      reviews: [{ name: "Juliana P.", city: "Florianópolis - SC", text: "Cores lindas e não gruda tanto.", rating: 5 }]
    },
    {
      id: 19,
      name: "LANÇADOR DE DARDOS NERF ELITE 2.0 COMMANDER RD6",
      category: "Nerf",
      collection: "Mais Desejados",
      price: 79.80,
      oldPrice: 95.94,
      discount: "17%",
      images: ["https://i.imgur.com/m8j38Ny.png", "https://i.imgur.com/EseV2vI.png", "https://i.imgur.com/qxB0oYc.png"],
      description: "O Lançador de Dardos Nerf Elite 2.0 Commander RD6 proporciona muita diversão e aventura.",
      features: ["Tambor de 6 Dardos", "12 Dardos Inclusos", "Alta Precisão"],
      reviews: [{ name: "Lucas T.", city: "Brasília - DF", text: "Potência excelente, diversão garantida.", rating: 5 }]
    },
    {
      id: 20,
      name: "KIT OFICINA MECÂNICA INFANTIL – FERRAMENTAS COM BANCADA",
      category: "Oficina de ferramentas",
      collection: "Premium",
      price: 109.90,
      oldPrice: 183.90,
      discount: "40%",
      images: ["https://i.imgur.com/g6tl1M6.png", "https://i.imgur.com/aL6vEXn.png", "https://i.imgur.com/u7zrgdo.png"],
      description: "Transforme a brincadeira em uma verdadeira oficina infantil com a Bancada de Ferramentas 2 em 1.",
      features: ["Bancada 2 em 1", "Furadeira Inclusa", "Maleta Organizadora"],
      reviews: [{ name: "Paulo R.", city: "Campinas - SP", text: "Muito robusto, meu filho ama montar tudo.", rating: 5 }]
    },
    {
      id: 21,
      name: "PATRULHA CANINA – ROCKY CAMINHÃO-CAÇAMBA",
      category: "Bonecos e Bonecas",
      collection: "Mais Desejados",
      price: 49.90,
      oldPrice: 94.99,
      discount: "47%",
      images: ["https://i.imgur.com/7Hwfz3q.png", "https://i.imgur.com/Iycu7Mm.png", "https://i.imgur.com/n3dMZjs.png"],
      description: "Conjunto composto por veículo terrestre e figura articulada do personagem Rocky.",
      features: ["Figura Articulada Rocky", "Veículo de Reciclagem", "Plástico de Alta Resistência"],
      reviews: [{ name: "Beatriz M.", city: " Maceió - AL", text: "Cor vibrante e material resistente.", rating: 5 }]
    },
    {
      id: 22,
      name: "PATRULHA CANINA – CHASE FIGURA E VEÍCULO BÁSICO",
      category: "Bonecos e Bonecas",
      collection: "Mais Desejados",
      price: 49.90,
      oldPrice: 72.99,
      discount: "32%",
      images: ["https://i.imgur.com/gBTcC9l.png", "https://i.imgur.com/wjZfuOv.png", "https://i.imgur.com/jYUYlc6.png"],
      description: "Com a Mini Figura e Veículo Básico Patrulha Canina da Sunny, a diversão é garantida.",
      features: ["Figura do Chase", "Veículo Policial", "Tamanho Ideal para Crianças"],
      reviews: [{ name: "Sérgio K.", city: "Natal - RN", text: "Chegou rápido e o brinquedo é ótimo.", rating: 5 }]
    },
    {
      id: 23,
      name: "PATRULHA CANINA – MARSHALL FIGURA E VEÍCULO BÁSICO",
      category: "Bonecos e Bonecas",
      collection: "Mais Desejados",
      price: 59.90,
      oldPrice: 96.99,
      discount: "38%",
      images: ["https://i.imgur.com/B85rYLw.png", "https://i.imgur.com/LuCeboI.png", "https://i.imgur.com/xJ85R12.png"],
      description: "O conjunto traz o Marshall, o divertido filhote bombeiro da Patrulha Canina, acompanhado de seu veículo.",
      features: ["Figura Articulada Marshall", "Veículo de Bombeiro", "Material Resistente"],
      reviews: [{ name: "André L.", city: "São Paulo - SP", text: "Meu filho ama o Marshall, chegou perfeito!", rating: 5 }]
    },
    {
      id: 24,
      name: "PATRULHA CANINA – SKYE FIGURA E VEÍCULO BÁSICO",
      category: "Bonecos e Bonecas",
      collection: "Mais Desejados",
      price: 49.90,
      oldPrice: 99.90,
      discount: "50%",
      images: ["https://i.imgur.com/ls85cPS.png", "https://i.imgur.com/dYNINk0.png", "https://i.imgur.com/GNSGQky.png"],
      description: "O conjunto traz a Skye, a adorável filhote piloto da Patrulha Canina, acompanhada de seu veículo.",
      features: ["Figura Articulada Skye", "Veículo de Voo", "Cores Vibrantes"],
      reviews: [{ name: "Mariana F.", city: "Rio de Janeiro - RJ", text: "Linda demais, a entrega foi super rápida.", rating: 5 }]
    },
    {
      id: 25,
      name: "PATRULHA CANINA – TRACKER FIGURA E VEÍCULO BÁSICO",
      category: "Bonecos e Bonecas",
      collection: "Mais Desejados",
      price: 49.90,
      oldPrice: 94.99,
      discount: "47%",
      images: ["https://i.imgur.com/zed5vkO.png", "https://i.imgur.com/iL4zbQo.png", "https://i.imgur.com/5DJBBjJ.png"],
      description: "O conjunto traz o Tracker, o corajoso filhote especialista em aventuras na floresta.",
      features: ["Figura Articulada Tracker", "Veículo de Selva", "Alta Durabilidade"],
      reviews: [{ name: "Carlos H.", city: "Curitiba - PR", text: "Excelente qualidade, recomendo!", rating: 5 }]
    },
    {
      id: 26,
      name: "PATRULHA CANINA – ZUMA FIGURA E VEÍCULO BÁSICO",
      category: "Bonecos e Bonecas",
      collection: "Ofertas Relâmpago",
      price: 39.90,
      oldPrice: 116.90,
      discount: "66%",
      images: ["https://i.imgur.com/KclGK4G.png", "https://i.imgur.com/caGcSzR.png", "https://i.imgur.com/gJeMmWl.png"],
      description: "O conjunto traz a Zuma, a divertida filhote especialista em missões aquáticas.",
      features: ["Figura Articulada Zuma", "Veículo Aquático", "Design Detalhado"],
      reviews: [{ name: "Sônia R.", city: "Salvador - BA", text: "Preço imbatível, chegou em 3 dias.", rating: 5 }]
    },
    {
      id: 27,
      name: "PELÚCIA EVEREST – PATRULHA CANINA",
      category: "Bonecos e Bonecas",
      collection: "Premium",
      price: 44.90,
      oldPrice: 81.79,
      discount: "45%",
      images: ["https://i.imgur.com/k4teS8R.png", "https://i.imgur.com/PFsVD65.png", "https://i.imgur.com/3ip8oNf.png"],
      description: "A personagem Everest é uma das integrantes mais queridas da Patrulha Canina e é perfeita para abraçar.",
      features: ["Material Ultra Macio", "Tamanho Ideal para Abraçar", "Original Spin Master"],
      reviews: [{ name: "Beatriz S.", city: "Belo Horizonte - MG", text: "Muito fofinha e macia, qualidade top.", rating: 5 }]
    },
    {
      id: 28,
      name: "PELÚCIA MARSHALL – PATRULHA CANINA",
      category: "Bonecos e Bonecas",
      collection: "Premium",
      price: 42.90,
      oldPrice: 65.32,
      discount: "34%",
      images: ["https://i.imgur.com/GeFC6nq.png", "https://i.imgur.com/rM75bRm.png", "https://i.imgur.com/CPVaGdu.png"],
      description: "O personagem Marshall é um dos integrantes mais queridos da Patrulha Canina e é perfeito para carinho.",
      features: ["Toque Aveludado", "Detalhes Bordados", "Original Spin Master"],
      reviews: [{ name: "Lucas M.", city: "Porto Alegre - RS", text: "Meu filho não solta mais a pelúcia!", rating: 5 }]
    },
    {
      id: 29,
      name: "PELÚCIA ROCKY – PATRULHA CANINA",
      category: "Bonecos e Bonecas",
      collection: "Ofertas Relâmpago",
      price: 34.90,
      oldPrice: 70.32,
      discount: "50%",
      images: ["https://i.imgur.com/DTvO5ES.png", "https://i.imgur.com/6z7yZdb.png", "https://i.imgur.com/KN20qEy.png"],
      description: "O Rocky é um dos integrantes mais queridos da Patrulha Canina e é perfeito para colecionar.",
      features: ["Material Antialérgico", "Acabamento Premium", "Original Spin Master"],
      reviews: [{ name: "Juliana T.", city: "Recife - PE", text: "Chegou super rápido, qualidade excelente.", rating: 5 }]
    },
  ];

  // --- LÓGICA ---
  useEffect(() => {
    localStorage.setItem('reino_brinquedos_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let timer;
    if (checkoutStep === 'form') {
      timer = setInterval(() => {
        setCheckoutTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCheckoutStep('cart');
            alert("Sua reserva de produtos expirou! Por favor, tente novamente.");
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [checkoutStep]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyPix = () => {
    const pixCode = "00020101021126580014br.gov.bcb.pix.reino-brinquedos-outlet-2026";
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateAndProceed = () => {
    if (!customerData.name || !customerData.phone || !customerData.document) {
      alert("Por favor, preencha todos os campos obrigatórios para gerar o pagamento!");
      return;
    }
    setCheckoutStep('payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-red-600 text-white py-2 text-center text-sm font-black uppercase animate-pulse">
        ⚠️ ATENÇÃO: Estoques de Outubro quase esgotados!
      </div>

      <nav className="sticky top-0 z-50 bg-blue-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="bg-yellow-400 p-2 rounded-lg"><ShoppingCart className="text-blue-900" size={24} /></div>
            <span className="text-2xl font-black tracking-tighter italic">REINO DOS <span className="text-yellow-400">BRINQUEDOS</span></span>
          </div>
          <div className="relative cursor-pointer p-2 hover:bg-blue-800 rounded-full transition-all" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={28} />
            {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-900">{totalItems}</span>}
          </div>
        </div>
      </nav>

      {currentPage === 'home' && (
        <>
          <section className="relative bg-blue-900 text-white py-16 md:py-24 text-center px-4">
            <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold uppercase mb-6 inline-block">🔥 Outlet de Brinquedos 2026</span>
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">A ALEGRIA DE SER CRIANÇA <br/><span className="text-yellow-400">COM PREÇO DE OUTLET!</span></h1>
            <a href="#catalogo" className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-2xl">
              GARANTIR MEU BRINQUEDO AGORA <ArrowRight size={20} />
               </a>
          </section>

          <section id="catalogo" className="py-20 bg-white px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 max-w-2xl mx-auto relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-slate-400" size={24} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar brinquedo ou categoria..." 
                    className="w-full p-5 pl-14 rounded-2xl border-2 border-slate-200 focus:border-blue-900 outline-none text-lg transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 p-1 hover:bg-slate-100 rounded-full text-slate-400">
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {['Mais Desejados', 'Ofertas Relâmpago', 'Premium'].map(col => (
                    <a 
                      key={col} 
                      href={`#col-${col.replace(/\s+/g, '-').toLowerCase()}`} 
                      className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-bold hover:bg-blue-900 hover:text-white transition-all border border-blue-200"
                    >
                      {col}
                    </a>
                  ))}
                </div>
              </div>

              {searchQuery === '' ? (
                ['Mais Desejados', 'Ofertas Relâmpago', 'Premium'].map(col => (
                  <div key={col} id={`col-${col.replace(/\s+/g, '-').toLowerCase()}`} className="mb-16 scroll-mt-24">
                    <h2 className="text-3xl font-black text-blue-900 uppercase mb-8">{col}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {products.filter(p => p.collection === col).map(product => (
                        <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-2xl transition-all cursor-pointer" onClick={() => { setSelectedProductId(product.id); setActiveImageIndex(0); setCurrentPage('product'); }}>
                          <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-100">
                            <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black">-{product.discount}</div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-blue-600 uppercase">{product.category}</span>
                            <h3 className="text-xl font-black text-slate-800">{product.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-black text-blue-900">R$ {product.price.toFixed(2)}</span>
                              <span className="text-sm text-slate-400 line-through">R$ {product.oldPrice.toFixed(2)}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full mt-4 bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2">
                              <ShoppingCart size={20} /> COMPRAR AGORA
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="mb-16">
                  <h2 className="text-3xl font-black text-blue-900 uppercase mb-8">Resultados para: <span className="text-blue-600">"{searchQuery}"</span></h2>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="group bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-2xl transition-all cursor-pointer" onClick={() => { setSelectedProductId(product.id); setActiveImageIndex(0); setCurrentPage('product'); }}>
                          <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-100">
                            <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black">-{product.discount}</div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-blue-600 uppercase">{product.category}</span>
                            <h3 className="text-xl font-black text-slate-800">{product.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-black text-blue-900">R$ {product.price.toFixed(2)}</span>
                              <span className="text-sm text-slate-400 line-through">R$ {product.oldPrice.toFixed(2)}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full mt-4 bg-blue-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2">
                              <ShoppingCart size={20} /> COMPRAR AGORA
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Search size={64} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-xl text-slate-500 font-bold">Nenhum brinquedo encontrado com esse nome.</p>
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-900 font-black underline">Limpar pesquisa</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {currentPage === 'product' && (
        <ProductPage 
          product={products.find(p => p.id === selectedProductId)} 
          onBack={() => setCurrentPage('home')} 
          onAddToCart={(p) => { addToCart(p); setIsCartOpen(true); }}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
        />
      )}

      <div className={`fixed inset-0 z-[110] transition-all ${isCartOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-blue-900/40 backdrop-blur-sm transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-6 border-b flex items-center justify-between bg-blue-900 text-white">
            <div className="flex items-center gap-2"><ShoppingCart size={24} className="text-yellow-400" /> <span className="text-xl font-black">CARRINHO</span></div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-blue-800 rounded-full transition-colors"><X size={24} /></button>
          </div>

          {checkoutStep === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 gap-4">
                    <ShoppingCart size={64} className="text-slate-300" />
                    <p className="text-slate-500 font-medium">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <img src={item.images[0]} className="w-20 h-20 rounded-xl object-cover" alt={item.name} />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-white border rounded-lg p-1">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1 text-slate-500"><Minus size={14} /></button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1 text-slate-500"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center text-2xl font-black text-blue-900">
                    <span>Total</span><span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={() => setCheckoutStep('form')} className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-600 flex items-center justify-center gap-3 shadow-lg">
                    <QrCode size={24} /> FINALIZAR COMPRA
                  </button>
                </div>
              )}
            </>
          )}

          {checkoutStep === 'form' && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              <div className="bg-red-50 p-3 rounded-xl mb-6 border border-red-100 flex items-center justify-between">
                <p className="text-red-800 text-xs font-bold flex items-center gap-2"><ShieldAlert size={14} /> Reservado por:</p>
                <span className="text-red-600 font-black">{formatTime(checkoutTimer)}</span>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Nome completo</label>
                  <input type="text" value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="Seu nome completo" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Telefone</label>
                  <input type="tel" value={customerData.phone} onChange={(e) => setCustomerData({...customerData, phone: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="(11) 99999-9999" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">CPF</label>
                  <input type="text" value={customerData.document} onChange={(e) => setCustomerData({...customerData, document: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="mt-auto pt-6 space-y-4">
                <button onClick={validateAndProceed} className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg">
                  GERAR PAGAMENTO PIX
                </button>
                <button onClick={() => setCheckoutStep('cart')} className="w-full text-slate-500 font-bold py-2">Voltar ao carrinho</button>
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                <AlertTriangle size={14} /> O código PIX expira em 30 min!
              </div>
              <div className="w-56 h-56 rounded-xl border border-slate-200 mb-4 flex items-center justify-center text-slate-400 text-sm p-4 bg-slate-50">
                QR Code Gerado
              </div>
              <button onClick={handleCopyPix} className={`w-full p-4 rounded-xl text-xs font-mono flex items-center justify-center gap-2 mb-6 transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 border-2 border-blue-900 animate-pulse'}`}>
                <Copy size={16} /> {copied ? 'Copiado!' : 'COPIAR CÓDIGO PIX'}
              </button>
              <p className="text-3xl font-black text-blue-900 mb-6">R$ {cartTotal.toFixed(2)}</p>
              <button onClick={() => {setCart([]); setIsCartOpen(false); setCheckoutStep('cart');}} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black">
                CONCLUIR E VOLTAR
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-blue-900 text-white pt-20 pb-10 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-yellow-400 p-2 rounded-lg"><ShoppingCart className="text-blue-900" size={24} /></div>
            <span className="text-2xl font-black tracking-tighter italic">REINO DOS <span className="text-yellow-400">BRINQUEDOS</span></span>
          </div>
          <p className="text-blue-200 max-w-md mx-auto mb-10">A maior outlet de brinquedos do Brasil. Qualidade e segurança.</p>
          <div className="pt-10 border-t border-blue-800 text-sm text-blue-300">
            © 2026 Reino dos Brinquedos. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;