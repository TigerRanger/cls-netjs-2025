export default class PageBuilder {
    
    public static reove_css_tag(data:string):string{
        return data.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
        .replace(/<img[^>]*class="pagebuilder-mobile-only"[^>]*>/gi, '');
    }

    public static  truncateWords(text: string, wordLimit: number): string {
      const words = text.split(' '); // Split the text into words
      if (words.length <= wordLimit) {
        return text; // Return the original text if within the limit
      }
      return words.slice(0, wordLimit).join(' ') + '...'; // Join first `wordLimit` words and add ellipsis
    }

  

    public static fromatMetaData(data: string): string {
      // Helper: parse <meta> tags
      const parseMetaTags = (html: string) => {
        const metaRegex = /<meta\s+([^>]+)>/gi;
        const attrRegex = /(\w+)=["']([^"']*)["']/g;
        const metas: Array<{ type: string; attributes: Record<string, string> }> = [];

        let metaMatch;
        while ((metaMatch = metaRegex.exec(html)) !== null) {
          const attrString = metaMatch[1];
          const attrs: Record<string, string> = {};
          let attrMatch;
          while ((attrMatch = attrRegex.exec(attrString)) !== null) {
            attrs[attrMatch[1]] = attrMatch[2];
          }
          metas.push({ type: 'meta', attributes: attrs });
        }
        return metas;
      };

      // Helper: parse <script type="application/ld+json"> tags
      const parseLdJsonScripts = (html: string) => {
        const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
       const scripts: Array<{ type: string; content: Record<string, unknown> }> = [];

        let match;
        while ((match = scriptRegex.exec(html)) !== null) {
          try {
            const json = JSON.parse(match[1]);
            scripts.push({ type: 'script', content: json });
          } catch (e) {
            console.error("Failed to parse JSON in <script>:", e);
          }
        }
        return scripts;
      };

      const metas = parseMetaTags(data);
      const scripts = parseLdJsonScripts(data);

      const combined = [...metas, ...scripts];


      // Return as pretty JSON string (or just JSON.stringify(combined) if you want compact)
      return JSON.stringify(combined, null, 2);
    }
       
}

export const CMS_STYLES = {
    cms_content: {
      padding: '10px 0',
    },
  };


export function convertMagentoImage(rawHtml: string, magentoBaseUrl: string): string {
  const decoded = rawHtml.replace(/{{media url=(.*?)}}/g, (match, path) => {
    const cleanPath = path.trim().replace(/^['"]|['"]$/g, '');
    return `${magentoBaseUrl}/pub/media/${cleanPath}`;
  });
  return decoded;
}