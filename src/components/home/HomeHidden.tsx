import HiddenContent from './HiddenContent'; // Import the HiddenContent component
import '@/sass/HomeHidden.css'; // Import the external CSS file


interface HiddenInterface {
    visible_title: string;
    visible_content: string;
    hidden_content: string;
    }


const HomeHidden: React.FC<HiddenInterface> = ({visible_title,visible_content,hidden_content}) => {
  return (
    <section className="white-block hidden-block">
      <div className='container '>
        <div className='h-d-r'>
        <h2 className="visible-title" dangerouslySetInnerHTML={{ __html: visible_title }} />
        <div className="visible-container" dangerouslySetInnerHTML={{ __html: visible_content }} />
        <HiddenContent content={hidden_content} />
      </div>
      </div>
    </section>
  );
};

export default HomeHidden;
