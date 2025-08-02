type CatChild = {
    canonical_url: string;
    name: string;
    position: number;
  };
  
  interface CatChildProps {
    cats: CatChild[] | null; // Ensure this is an array of CatChild
  }
  
  const CategoryChild: React.FC<CatChildProps> = ({ cats }) => {
    // Ensure cats is defined and an array
    if (!Array.isArray(cats) || cats.length === 0) {
      return null; // Return null or an appropriate fallback if there are no categories
    }
  
    return (
      <div className="row cat_box_container">
        {cats.map((cat, index) => (
          <div className="cat-box-32 col-sm-6 col-md-4" key={index}>
            <a href={'/'+cat.canonical_url}>{cat.name}</a>
          </div>
        ))}
      </div>
    );
  };
  
  export default CategoryChild;
  