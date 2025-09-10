import { pageTemplates } from "@/lib/page-templates";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log(`Début du seeding ...`)

    const welcomeTemplate = pageTemplates.find(t => t.name === 'Page d\'Accueil');
    if (!welcomeTemplate) {
        console.error("Modèle de page d'accueil non trouvé !");
        return;
    }

    await prisma.page.upsert({
        create: {
            name: 'Page d\'Accueil',
            systemPageType: 'WELCOME',
            blocks: {
                create: welcomeTemplate.blocks.map(block => ({
                    content: block.content as any,
                    order: block.order,
                    type: block.type,
                }))
            }
        },
    });

    console.log(`Seeding terminé.`)
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); })