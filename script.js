console.log("Adega Quatre Amis - Sistema de Gestão iniciado.");

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navMenu.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Wine inventory data
const wines = [
    {
        id: 1,
        name: "Château Margaux 2015",
        type: "tinto",
        price: "R$ 2.500,00",
        stock: 15,
        minStock: 5,
        location: "A-123",
        manufacturer: "Château Margaux",
        image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?auto=format&fit=crop&w=400&q=80",
        description: "Vinho tinto excepcional da região de Bordeaux.",
        lastUpdated: "2024-03-15"
    },
    {
        id: 2,
        name: "Dom Pérignon 2010",
        type: "espumante",
        price: "R$ 1.800,00",
        stock: 8,
        minStock: 3,
        location: "B-456",
        manufacturer: "Moët & Chandon",
        image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=400&q=80",
        description: "Champagne premium com notas cítricas e minerais.",
        lastUpdated: "2024-03-14"
    },
    {
        id: 3,
        name: "Cloudy Bay 2019",
        type: "branco",
        price: "R$ 350,00",
        stock: 25,
        minStock: 10,
        location: "C-789",
        manufacturer: "Cloudy Bay Vineyards",
        image: "https://images.unsplash.com/photo-1566275529824-cca6d008f3da?auto=format&fit=crop&w=400&q=80",
        description: "Sauvignon Blanc da Nova Zelândia com notas tropicais.",
        lastUpdated: "2024-03-13"
    },
    {
        id: 4,
        name: "Whispering Angel 2020",
        type: "rose",
        price: "R$ 280,00",
        stock: 12,
        minStock: 8,
        location: "D-012",
        manufacturer: "Château d'Esclans",
        image: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=400&q=80",
        description: "Rosé provençal elegante e refrescante.",
        lastUpdated: "2024-03-12"
    }
];

// Populate wine grid with inventory information
const wineGrid = document.getElementById('wineGrid');

function createWineCard(wine) {
    const stockStatus = wine.stock <= wine.minStock ? 'low-stock' : 'in-stock';
    return `
        <div class="wine-card" data-type="${wine.type}">
            <img src="${wine.image}" alt="${wine.name}" />
            <h3>${wine.name}</h3>
            <p>${wine.description}</p>
            <div class="stock-info">
                <span>Estoque: ${wine.stock} unidades</span>
                <span class="${stockStatus}-badge">${stockStatus === 'low-stock' ? 'Estoque Baixo' : 'Em Estoque'}</span>
            </div>
            <div class="wine-details">
                <span class="price">${wine.price}</span>
                <span class="location">Local: ${wine.location}</span>
            </div>
            <div class="actions">
                <button class="cta-button edit-btn" onclick="editWine(${wine.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="cta-button" onclick="updateStock(${wine.id})">
                    <i class="fas fa-sync-alt"></i> Atualizar
                </button>
            </div>
        </div>
    `;
}

// Search functionality
const searchWine = document.getElementById('searchWine');

searchWine.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredWines = wines.filter(wine => 
        wine.name.toLowerCase().includes(searchTerm) ||
        wine.description.toLowerCase().includes(searchTerm) ||
        wine.location.toLowerCase().includes(searchTerm)
    );
    displayWines('todos', filteredWines);
});

function displayWines(filter = 'todos', wineList = wines) {
    const filteredWines = filter === 'todos' 
        ? wineList 
        : wineList.filter(wine => wine.type === filter);
    
    wineGrid.innerHTML = filteredWines.map(createWineCard).join('');
}

// Initialize wine display
displayWines();

// Wine filters
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.getAttribute('data-filter');
        displayWines(filter);
    });
});

// Stock management functions
function editWine(wineId) {
    const wine = wines.find(w => w.id === wineId);
    if (!wine) return;
    
    // Here you would typically open a modal or form for editing
    console.log('Editing wine:', wine);
    alert('Funcionalidade de edição em desenvolvimento');
}

function updateStock(wineId) {
    const wine = wines.find(w => w.id === wineId);
    if (!wine) return;
    
    const newStock = prompt(`Atualizar estoque para ${wine.name}. Quantidade atual: ${wine.stock}`);
    if (newStock !== null && !isNaN(newStock)) {
        wine.stock = parseInt(newStock);
        wine.lastUpdated = new Date().toISOString().split('T')[0];
        displayWines();
        updateDashboard();
    }
}

// Dashboard updates
function updateDashboard() {
    const totalStock = wines.reduce((sum, wine) => sum + wine.stock, 0);
    const lowStock = wines.filter(wine => wine.stock <= wine.minStock).length;
    const pendingOrders = 8; // This would come from your orders database
    const manufacturers = [...new Set(wines.map(wine => wine.manufacturer))].length;

    // Update dashboard numbers
    document.querySelector('.dash-card:nth-child(1) .number').textContent = totalStock;
    document.querySelector('.dash-card:nth-child(2) .number').textContent = lowStock;
    document.querySelector('.dash-card:nth-child(3) .number').textContent = pendingOrders;
    document.querySelector('.dash-card:nth-child(4) .number').textContent = manufacturers;
}

// Initialize dashboard
updateDashboard();

// Add new wine button handler
document.querySelector('.add-wine-btn').addEventListener('click', () => {
    alert('Funcionalidade de adicionar novo vinho em desenvolvimento');
});

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
 
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
   
    console.log('Form submitted:', data);
    
  
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    contactForm.reset();
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature, .wine-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
