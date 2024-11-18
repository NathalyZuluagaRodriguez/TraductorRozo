import {dictionary} from "../scripts/dictionary.js"


// Función para crear una tarjeta de palabra
const makeWordCard = (word, category) => {
    const container = document.createElement('div');
    container.className = 'word-card'; // Asignar clase directamente

    const englishTitle = document.createElement('h2');
    englishTitle.textContent = word.english;

    const spanishTitle = document.createElement('h3');
    spanishTitle.textContent = word.spanish;

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = category;

    // Agregar los elementos al contenedor
    container.appendChild(englishTitle);
    container.appendChild(spanishTitle);
    container.appendChild(categoryTag);

    // Agregar un evento simple al contenedor
    container.addEventListener('mouseenter', function () {
        const englishWord = englishTitle.textContent;
        const foundWord = dictionary.categories[category].find(word => word.english === englishWord);

        if (foundWord) {
            const translationResult = document.getElementById('translation-result');
            translationResult.children[1].textContent = `${foundWord.english} - ${foundWord.spanish}`;
            translationResult.children[2].textContent = foundWord.example;
        }
    });

    return container;
};

// Función para renderizar las palabras
const renderWords = (categoryFilter = 'all') => {
    const container = document.getElementById('dictionary-container');
    container.innerHTML = ''; // Limpiar el contenedor

    // Iterar sobre todas las categorías
    for (const category in dictionary.categories) {
        const words = dictionary.categories[category];

        // Verificar si la categoría debe mostrarse
        if (categoryFilter === 'all' || categoryFilter === category) {
            for (let i = 0; i < words.length; i++) {
                const wordCard = makeWordCard(words[i], category);
                container.appendChild(wordCard);
            }
        }
    }
};

// Función para traducir
const translateWord = () => {
    const searchWord = document.getElementById('search-word').value.trim();
    const direction = document.getElementById('translation-direction').value;
    const translationResult = document.getElementById('translation-result');
    let foundWord = null;

    // Buscar en todas las categorías
    for (const category in dictionary.categories) {
        const words = dictionary.categories[category];
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const searchField = direction === 'en-es' ? 'english' : 'spanish';
            if (word[searchField].toLowerCase() === searchWord.toLowerCase()) {
                foundWord = word;
                break;
            }
        }
        if (foundWord) break;
    }

    // Mostrar el resultado de la búsqueda
    if (foundWord) {
        const translatedWord = direction === 'en-es' ? foundWord.spanish : foundWord.english;
        translationResult.children[1].textContent = translatedWord;
        translationResult.children[2].textContent = foundWord.example;
    } else {
        translationResult.children[1].textContent = 'Palabra no encontrada';
        translationResult.children[2].textContent = '-';
    }
};

// Event Listeners
const init = () => {
    // Listener para el botón de traducción
    const translateBtn = document.getElementById('translate-btn');
    translateBtn.addEventListener('click', translateWord);

    // Listener para el filtro de categorías
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.addEventListener('change', function () {
        renderWords(categoryFilter.value);
    });

    // Listener para el campo de búsqueda
    const searchWord = document.getElementById('search-word');
    searchWord.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            translateWord();
        }
    });

    // Renderizar las palabras al cargar
    renderWords();
};

// Inicializar cuando el DOM esté cargado
window.addEventListener('DOMContentLoaded', init);