// lib/jslib/ContentCollector.ts
import { JSDOM } from "jsdom";

export interface ContentItem {
    type: string | null;
    content: string;
    hasChildren?: boolean;
    children?: ContentItem[];
}

export default class ContentCollector {
  private elements: NodeListOf<HTMLElement> | null = null;
  private providedData: ContentItem[] | null = null;
  private results: ContentItem[] = [];
  constructor(input: string | ContentItem[] | null = null) {
    if (!input) return;
    if (typeof input === "string") {
      // Decode escaped HTML
      const decodedHTML = this.decodeHTML(input);
      // Parse with jsdom
      const dom = new JSDOM(decodedHTML);
      const doc = dom.window.document;
      // Select elements with data-content-type
      this.elements = doc.querySelectorAll<HTMLElement>("[data-content-type]");
      // If no elements found, treat the whole content as one HTML block
      if (this.elements.length === 0 && doc.body.innerHTML.trim() !== "") {
        this.providedData = [{ type: "html", content: doc.body.innerHTML }];
      }
    } else if (Array.isArray(input)) {
      this.providedData = input;
    }
  }

  private decodeHTML(html: string): string {
    const dom = new JSDOM();
    const txt = dom.window.document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  public collect(): ContentItem[] {
   
    if (this.providedData) return this.providedData;
    if (!this.elements) return [];

    this.elements.forEach((el) => {
      const type = el.getAttribute("data-content-type");
          let child_data = [] as ContentItem[];
      let content = "";
     switch (type) {
        case "row":
          content =  el.innerHTML.trim() || "";

          

              this.processData(content , child_data);
              // console.log("processData child_data", child_data);
               this.results.push({ type, content , hasChildren: child_data.length > 0, children: child_data  });
          break;
        case "html":
          content = el.innerHTML.trim();
           this.results.push({ type, content , hasChildren: child_data.length > 0, children: child_data  });
          break;
           //default:
           //console.log(`Unknown content type: ${type}`);
      }
   
     
    });

    console.log("ContentCollector results", this.results);
    return this.results;
  }

public processData(params: string, child_data: ContentItem[]): ContentItem[] {
  if (typeof params !== "string") return child_data;

  const decodedHTML = this.decodeHTML(params);
  const dom = new JSDOM(decodedHTML);
  const doc = dom.window.document;

  const firstDiv = doc.body.querySelector("div");
  if (!firstDiv) return child_data;

  // only direct children
  const child_data_extract = Array.from(firstDiv.children) as HTMLElement[];

  child_data_extract.forEach((el) => {
    let type = el.getAttribute("data-content-type");
    let content = el.innerHTML.trim();
    let child_data2: ContentItem[] = [];

    // Only recurse for column, column-group, column-line
    if (type === "column" || type === "column-group" || type === "column-line") {
      // Process **direct children** of this column
      const directChildren = Array.from(el.children).filter((c) =>
        (c as HTMLElement).hasAttribute("data-content-type")
      ) as HTMLElement[];

      directChildren.forEach((childEl) => {
        const childType = childEl.getAttribute("data-content-type") || childEl.tagName.toLowerCase();
        const childContent = childEl.innerHTML.trim();

        let subChildren: ContentItem[] = [];

        // For `text`, push `<p>` as children
        if (childType === "text") {
          const pElements = Array.from(childEl.children) as HTMLElement[];
          pElements.forEach((pEl) => {
            subChildren.push({
              type: pEl.tagName.toLowerCase(),
              content: pEl.innerHTML.trim(),
              hasChildren: false,
              children: [],
            });
          });
        }

        child_data2.push({
          type: childType,
          content: childContent,
          hasChildren: subChildren.length > 0,
          children: subChildren,
        });
      });
    }

    // fallback for elements without data-content-type
    if (!type) type = el.tagName.toLowerCase();

    child_data.push({
      type,
      content,
      hasChildren: child_data2.length > 0,
      children: child_data2,
    });
  });

  return child_data;
}




}

