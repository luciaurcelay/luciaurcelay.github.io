export interface ReviewItem {
  venue: string
  role: string
  year: string
}

export interface SupervisionItem {
  student: string
  degree: string
  institution: string
  year: string
}

export const reviewItems: ReviewItem[] = [
  {
    venue: 'NeurIPS - AI4DD Workshop',
    role: 'Reviewer',
    year: '2026',
  },
  {
    venue: 'Nature Communications Biology',
    role: 'Reviewer',
    year: '2026',
  }  
]

export const supervisionItems: SupervisionItem[] = [
  {
    student: 'Romain Pastre',
    degree: 'MSc in Bioinformatics for Health Sciences',
    institution: 'Universitat Pompeu Fabra',
    year: '2026',
  },
  {
    student: 'Ruben Cuervo',
    degree: 'MSc in Artificial Intelligence',
    institution: 'Universitat Politècnica de Catalunya',
    year: '2024',
  },
]
