import Question from "../dto/Question";

export default class QuestionService {

    QUESTIONS: Question[] = [
        {
            title: "Qui suis-je ?",
            detail: "J'aime la boue mais ma vie s’arrête dans une assiette.",
            responses: ["Cochon", "porc"],
            clues: [
                "Avant d'arriver dans l'assiette, je suis parfois découper en tranche",
                "Je suis un animal de couleur rose, souvent élevé dans de terrible conditions"
            ],
            responseDetails: "Je me présente, je m'appel Piggy.\n" +
                "Je serai ton compagnon dans cette mystérieuse aventure.\n" +
                "Mais avant-tout un peu d'histoire..."
        }, {
            title: "Qui est-il?",
            detail: "Selon la légende, mon maître fut le premier à mettre le pied en Amérique.",
            responses: ["Christophe Colomb"],
            clues: [
                "Je suis un navigateur Espagnol",
                "Mon nom est aussi celui d'un oiseau au masculin"
            ],
            responseDetails: null
        }, {
            title: "Qui étaient-ils?",
            detail: "Christophe et moi avons fait la découverte des premiers habitants des Antilles.",
            responses: ["arawak", "arawaks"],
            clues: [
                "Par abus de langage, ils sont souvent associés aux Caraïbes, mais ils sont par définition des Amérindiens des Antilles.",
            ],
            skippable: true,
            responseDetails: "Les Arawaks de leurs vrais noms, furent mis en esclavages puis massacrés par Christophe Colomb et son équipage, alors que ces premiers s'en allèrent à la nage pour nous rencontrer à notre arrivé sur l'île."
        }, {
            title: "Sais-tu oú?",
            detail: "Depuis, je me suis établi aux Antilles avec Christophe et même si je finis dans une assiette,\n" +
                "je suis aussi connu pour une destination où les gens viennent me voir.",
            responses: ["Bahamas"],
            clues: [
                "Ces gens viennent spécifiquement pour nager avec moi, dans une eau aussi clair qu'un cristal.",
            ],
            responseDetails: "Je suis peinard aux Bahamas, précisemment à Big Major Cay (plus connue sous le nom de 'Pig Beach'), une île habitée que par des cochons comme moi :D",
        }, {
            title: "Quelle est la capital ...?",
            detail: "Des Bahamas",
            responses: ["Nassau"],
            clues: [
                "Elle rhyme aussi avec 'cerceau'",
            ],
            responseDetails: ":D Bravo :D\n" +
                "Vas vite découvrir ce que tu as gagné dans l’email que je viens de t’envoyer\n",
        },
    ];

    findAll(): Question[] {
        return this.QUESTIONS;
    }

    isValidAnswer(response: string, question: Question): boolean {
        return response && question.responses.find(r => r.toLowerCase() === response.toLowerCase());
    }
}