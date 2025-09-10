export const pageTemplates = [
    {
        name: "Page d'accueil",
        description: "La page d'accueil par défaut avec tous ses éléments.",
        blocks: [
            {
                content: {
                    alignment: "end",
                },
                order: 1,
                type: 'languageSwitcher',
            },
            {
                content: {
                    imageUrl: "/images/background.jpg",
                    subtitle: "Cliquez pour commander",
                    title: "Bienvenue",
                },
                order: 2,
                type: "hero",
            },
            {
                content: {},
                order: 3,
                type: 'adminTrigger',
            },
            {
                content: {
                    alignment: 'center',
                    link: '/order-type',
                    text: 'Démarrer la commande',
                },
            },
        ],
    },
    {
        name: "Menu Principal",
        description: "La page principale avec les filtres de catégories et la grille des produits.",
        blocks: [
            {
                content: {},
                order: 1,
                type: "productGrid",
            },
        ],
    },
];