export interface Question {
  id: number;
  text: string;
  difficulty: number;
  options: string[];
  correctAnswer?: number;
}
