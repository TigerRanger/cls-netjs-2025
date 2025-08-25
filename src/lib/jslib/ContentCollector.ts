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
        // check if this element has a parent with ANY data-content-type
          const parent = el.parentElement;
          if (parent===null || !parent.hasAttribute("data-content-type")) {
           this.results.push({ type, content , hasChildren: child_data.length > 0, children: child_data  });
          }
           break;

        case "div":
          content = el.innerHTML.trim();
          this.results.push({ type, content , hasChildren: child_data.length > 0, children: child_data  });
            break;

           default:
          //   content = el.innerHTML.trim();
          //  this.results.push({ type, content , hasChildren: child_data.length > 0, children: child_data  });
      }
    });


    return this.results;
  }

  public  processData(params: string , child_data: ContentItem[] ):  ContentItem[] {
    if (typeof params === "string") {
    // Decode escaped HTML
    const decodedHTML = this.decodeHTML(params);
    // Parse with jsdom
    const dom = new JSDOM(decodedHTML);
    const doc = dom.window.document;
    // ✅ Get the first div
    const firstDiv = doc.body.querySelector("div");
    if (!firstDiv) return child_data;
    // ✅ Get only its direct children with data-content-type
    const child_data_extract = Array.from(firstDiv.children) as HTMLElement[];
        child_data_extract.forEach((el) => {
            let type = el.getAttribute("data-content-type");
              let child_data2 = [] as ContentItem[];
              let content = "";
              switch (type) {


              case "html":
                content = el.innerHTML.trim();
                break;

              case "heading":
                let tagName = el.tagName.toLowerCase();
                  content =  "<"+ tagName +">"+ el.innerHTML.trim() + "</"+ tagName +">" || "";
                break;
              case "text":
                content =  el.innerHTML.trim() || "";
                break;
              case "column-group":
                content =  el.innerHTML.trim() || "";  
                 this.processData("<div>"+ content + "</div>" , child_data2);
                // console.log("processData child_data", child_data2);
                break;
              case "image":
          
                      const img = el.querySelector<HTMLImageElement>('img[data-element="desktop_image"]');
                      content = (
                        (img?.src || "CLS") + '#' +
                        (img?.alt || "CLS") + '#' +
                        (img?.title || "CLS")
                      );
                break;
              case "column-line":
                content =  el.innerHTML.trim() || "";  
                 this.processData("<div>"+ content + "</div>" , child_data2);
                // console.log("processData child_data", child_data2);
                break; 
             case "column":
                content =  el.innerHTML.trim() || "";  
                 this.processData("<div>"+ content + "</div>" , child_data2);
                // console.log("processData child_data", child_data2);
                break;  
                case "video":
                  // Try to find iframe inside the element
                  const iframe = el.querySelector<HTMLIFrameElement>('iframe[data-element="video"]');
                  content = iframe?.src || ""; // fallback to "video" if no iframe
                  break;
               case "null":
                content = el.innerHTML.trim();
                type = el.tagName.toLowerCase();
                break; 
                default:
                //console.log(`Unknown content type: ${type}`);
            }
            child_data.push({ type, content , hasChildren:child_data2.length > 0 , children: child_data2 });
        }
      )};

        return [] as ContentItem[];
}

}

