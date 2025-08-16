// utils/ContentCollector.ts
export interface ContentItem {
  type: string | null;
  content: string;
}

export default class ContentCollector {
  private elements: NodeListOf<HTMLElement>;

  constructor(selector: string = '[data-content-type]') {
    this.elements = document.querySelectorAll<HTMLElement>(selector);
  }

  public getAllData(): ContentItem[] {
    const data: ContentItem[] = [];
    this.elements.forEach((el) => {
      data.push({
        type: el.getAttribute('data-content-type'),
        content: el.innerHTML.trim(),
      });
    });
    return data;
  }

  public printAllData(): void {
    this.getAllData().forEach((item, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(` Type: ${item.type}`);
      console.log(` Content: ${item.content}`);
    });
  }
}
