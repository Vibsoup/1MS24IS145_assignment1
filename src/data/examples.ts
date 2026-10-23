import { ResearchTopicInput, LiteratureItem } from '../types/research';

export interface ResearchExample {
  id: string;
  label: string;
  badge: string;
  description: string;
  topicInput: ResearchTopicInput;
  samplePaper?: LiteratureItem;
}

export const RESEARCH_EXAMPLES: ResearchExample[] = [
  {
    id: 'example-1',
    label: 'Plant Disease Detection (ML)',
    badge: 'Benchmark Example 1',
    description: 'Undergraduate Computer Science project evaluating ML classifiers on leaf imagery.',
    topicInput: {
      topic: 'Plant disease detection using machine learning',
      discipline: 'Computer Science',
      researchLevel: 'Undergraduate',
      preferredMethodology: 'Empirical / Experimental',
      researchQuestion: '',
      sourceMaterial: 'Focus on evaluating computer vision approaches under real-world leaf background variability and field lighting conditions.',
    },
    samplePaper: {
      id: 'paper-plantvillage',
      title: 'Deep learning for image-based plant disease detection',
      authors: 'Mohanty, S. P., Hughes, D. P., & Salathé, M.',
      year: '2016',
      venue: 'Frontiers in Plant Science',
      doi: '10.3389/fpls.2016.01419',
      rawText: 'We trained deep convolutional neural networks to identify 14 crop species and 26 diseases (or absence thereof). The trained model achieves an accuracy of 99.35% on a held-out test set of 54,306 images from the PlantVillage dataset. However, when tested on a set of images taken under conditions different from the images used for training, the model accuracy decreases substantially to 31.4%. This highlights a critical limitation: standard benchmarks with uniform studio backgrounds fail to generalize to actual agricultural fields.',
    },
  },
  {
    id: 'example-2',
    label: 'AI in Healthcare (Early Disease Detection)',
    badge: 'Benchmark Example 2',
    description: 'Master\'s level inquiry analyzing the limitations, bias, and clinical validation of ML diagnostic tools.',
    topicInput: {
      topic: 'AI in healthcare',
      discipline: 'Biomedical Informatics / Medicine',
      researchLevel: "Master's",
      preferredMethodology: 'Systematic Literature Review & Critical Synthesis',
      researchQuestion: 'What are the limitations of machine-learning models used for early disease detection?',
      sourceMaterial: 'Key considerations include lack of external clinical validation, class imbalance in rare diseases, demographic bias in imaging datasets, and black-box interpretability concerns among clinicians.',
    },
    samplePaper: {
      id: 'paper-healthcare-bias',
      title: 'Dissecting racial bias in an algorithm used to manage the health of populations',
      authors: 'Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S.',
      year: '2019',
      venue: 'Science',
      doi: '10.1126/science.aax2342',
      rawText: 'We analyze an algorithm applied to roughly 200,000 patients that relies on health care costs as a proxy for illness severity. Because less money is spent on Black patients who have the same degree of illness, the algorithm falsely concludes that Black patients are healthier than equally sick White patients. Correcting this bias dramatically increases the percentage of Black patients eligible for specialized care programs from 17.7% to 46.5%. The study demonstrates how commercial algorithms trained on healthcare cost proxies inadvertently reproduce systemic inequities.',
    },
  },
  {
    id: 'example-3',
    label: 'Literature Excerpt Extraction',
    badge: 'Benchmark Example 3',
    description: 'Raw excerpt testing: model extracts dataset, reported accuracy, and methodology without hallucinating metadata.',
    topicInput: {
      topic: 'Transformer architectures for clinical text summarization',
      discipline: 'Natural Language Processing',
      researchLevel: 'Doctoral / Ph.D.',
      preferredMethodology: 'Computational / Benchmarking',
      researchQuestion: 'How reliably do pre-trained clinical transformers preserve diagnostic facts during EHR note summarization?',
      sourceMaterial: 'Extracting factual consistency metrics and hallucination rates in medical text generation.',
    },
    samplePaper: {
      id: 'paper-excerpt-test',
      title: 'Clinical-Longformer: Excerpt on Medical Record Summarization',
      authors: 'Unspecified in excerpt',
      year: 'Unspecified',
      venue: 'Anonymous Excerpt Archive',
      doi: '',
      rawText: 'We evaluate a 512-token sliding window transformer against long-context sparse attention on a cohort of 12,450 de-identified intensive care discharge summaries. On the primary clinical entity recall benchmark, the model achieves a ROUGE-L score of 42.8% and a factual consistency precision of 91.2% evaluated via blinded physician annotations. The primary observed failure mode was omission of negative diagnostic findings (e.g., patient denies chest pain) in 6.4% of generated summaries.',
    },
  },
];
