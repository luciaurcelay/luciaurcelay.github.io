export interface Publication {
  year: string
  title: string
  authors: string
  venue: string
  paperUrl: string
}

export const publications: Publication[] = [
  {
    year: '2025',
    title: 'Automatic Evaluation of Healthcare LLMs Beyond Question-Answering',
    authors:
      'Anna Arias-Duart, Pablo Agustin Martin-Torres, Daniel Hinjos, Pablo Bernabeu-Perez, Lucia Urcelay Ganzabal, Marta Gonzalez Mallo, Ashwin Kumar Gururajan, Enrique Lopez-Cuena, Sergio Alvarez-Napagao, Dario Garcia-Gasulla',
    venue:
      'North American Chapter of the Association for Computational Linguistics (NAACL), 2025',
    paperUrl: 'https://arxiv.org/abs/2502.06666',
  },
  {
    year: '2024',
    title: 'Aloe, A Family of Fine-tuned Open Healthcare LLMs',
    authors:
      'Ashwin Kumar Gururajan, Enrique Lopez-Cuena, Jordi Bayarri-Planas, Adrian Tormos, Daniel Hinjos, Pablo Bernabeu-Perez, Anna Arias-Duart, Pablo Agustin Martin-Torres, Lucia Urcelay-Ganzabal, Marta Gonzalez-Mallo, Sergio Alvarez-Napagao, Eduard Ayguadé-Parra, Ulises Cortés Dario Garcia-Gasulla',
    venue: 'Preprint, 2024',
    paperUrl: 'https://arxiv.org/abs/2405.01886',
  },
  {
    year: '2023',
    title: 'Exploring the Role of Explainability in AI-Assisted Embryo Selection',
    authors:
      'Lucia Urcelay, Daniel Hinjos, Pablo A. Martin-Torres, Marta Gonzalez, Marta Mendez, Salva Cívico, Sergio Alvarez-Napagao, Dario Garcia-Gasulla',
    venue:
      'International Congress of the Catalan Association for Artificial Intelligence (CCIA), 2023',
    paperUrl: 'https://arxiv.org/abs/2308.02534',
  },
]
