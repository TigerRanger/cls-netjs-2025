import client from '@/lib/Apollo/apolloClientToken';
import { gql } from "@apollo/client";
import  {GET_PRODUCT_PAGE}  from "@/lib/Query/MagentoSingleProduct"; // Import query


const fetchProductPage = async ({ productUrl  }: { productUrl : string }
) => {
    const GET_Magento_Product = gql`
      ${GET_PRODUCT_PAGE}
    `;

   try{ 
    const { data } = await client.query({ 
        query: GET_Magento_Product,
        variables: { productUrl  }   
     });
    return data;
    }
  catch{
    return null;
  
  }

}
  
  export default fetchProductPage;
  

