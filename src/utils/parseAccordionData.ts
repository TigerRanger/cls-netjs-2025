// utils/parseAccordionData.ts

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * Converts `quelist` and `anslist` strings (ending with #)
 * into an array of { question, answer } objects.
 * Returns false if lengths don't match.
 */
export function parseAccordionData(
  quelist: string,
  anslist: string
): AccordionItem[] | false {
  if (!quelist || !anslist) return false;

  const questions = quelist.trim().split('#').filter(Boolean);
  const answers = anslist.trim().split('#').filter(Boolean);

  if (questions.length !== answers.length) return false;

  return questions.map((q, i) => ({
    question: q.trim(),
    answer: answers[i].trim(),
  }));
}
