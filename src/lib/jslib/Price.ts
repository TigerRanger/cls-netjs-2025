export default class EcommercePrice {
    private price: number;

    constructor(price: number) {
        this.price = price;
    }


    public getFormattedPrice(): string {
        let temp = `${this.price.toFixed(2)} €`; // Format the price to two decimal places
            temp = temp.replace(".","#");
            temp = temp.replace(",",".");
            temp = temp.replace("#",",");
        return temp;
    }


    public static getEuroPrice(price:number , currency:string , Symbol:string ):string{
        // static fn canot get private value of class 
        
          if(currency==='EURO'){
            let temp = `${price.toFixed(2)}${Symbol}`; // Format the price to two decimal places
            temp = temp.replace(".","#");
            temp = temp.replace(",",".");
            temp = temp.replace("#",",");
            return temp;
        }
        else if(currency ==='USD'){
            return `${Symbol} ${price.toFixed(2)}`; // Format the price to two decimal places
        }
        return `${Symbol} ${price.toFixed(2)}`; // Format the price to two decimal places
    }


    public static generateStars = (rating: number): string[] => {
        const filledStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0; // Check if there's a half star
        const totalStars = 5;
      
        const stars = Array(filledStars).fill('filled'); // Filled stars
        if (halfStar) stars.push('half'); // Half star
        stars.push(...Array(totalStars - stars.length).fill('empty')); // Empty stars
      
        return stars;
      };
    

      public static calculate_review_percent = (percent: number): number => {
        const star = 5;
        return Math.round((percent * star) / 100);
      }    



      public static current_first_page = (current_page:number,page_size:number): number => {
        return ((current_page-1) * page_size ) + 1;
      }


      public static current_middle_page = (current:number,page_size: number,total:number,total_item:number): number => {
          
        if(current == total){
            return total_item;
        }
        else{
            return  current * page_size;
        }

      }


      public static format_date = (datevalue:string): string => {


        const originalDate = new Date(datevalue); // "17.10.2023" => ISO format
        // Step 3: Format the date as "Feb 24, 2025"
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = originalDate.toLocaleDateString('en-US', options as Intl.DateTimeFormatOptions);
        
       // console.log(formattedDate); // "Feb 24, 2025"
        return formattedDate;

      }



}