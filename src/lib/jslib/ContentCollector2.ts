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
            console.log("processData element Name", el.tagName);
            console.log("processData type", type);
            console.log("processData child_data", el.children);

          let child_data2 = [] as ContentItem[];

          let content = "";

          switch (type) {

              case "heading":
                content =  el.innerHTML.trim() || "";
                    // this.processData(content , child_data2);
                    // console.log("processData child_data", child_data2);
                break;

              case "text":
                content =  el.innerHTML.trim() || "";
                    // this.processData(content , child_data2);
                    // console.log("processData child_data", child_data2);
                break;


              case "column-group":
                content =  el.innerHTML.trim() || "";  
                 this.processData(content , child_data2);
                // console.log("processData child_data", child_data2);
                break;

              case "image":
                content =  el.innerHTML.trim() || "";  
                // this.processData(content , child_data2);
                // console.log("processData child_data", child_data2);
                break;  


             case "column":
                content =  el.innerHTML.trim() || "";  
                 this.processData(content , child_data2);
                // console.log("processData child_data", child_data2);
                break;  


              case "video":
                content = el.innerHTML.trim();
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
      // If no elements found, treat the whole content as one HTML block
      // if (child_data.length === 0 && doc.body.innerHTML.trim() !== "") {
      //   return [{ type: "html", content: doc.body.innerHTML }];
      // }

    // Default return value to satisfy the function signature
   // return [] as ContentItem[];
}



}

