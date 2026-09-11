const itinerarios = {
    "Linguagens e suas tecnologias": [
        "Português",
        "Inglês",
        "Espanhol"
    ],
    "Matemática e suas tecnologias": [
        "Matemática",
        "Estatística",
        "Geometria"
    ],
    "Ciências da natureza e suas tecnologias": [
        "Biologia",
        "Física",
        "Química"
    ],
    "Ciências humanas e sociais aplicadas": [
        "História",
        "Geografia",
        "Sociologia",
        "Filosofia"
    ],
    "Formação técnica e profissional": [
        "Lógica de Programação",
        "HTML, CSS e JavaScript",
        "Banco de Dados"
    ]
};

const materiasValidas = Object.values(itinerarios).flat();

module.exports = { itinerarios, materiasValidas };