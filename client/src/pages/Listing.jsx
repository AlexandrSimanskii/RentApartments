import { useParams } from "react-router-dom";

const Listing = () => {

const params = useParams()

    return (
        <div>
            {`Обьявление ${params.listingID}`}
        </div>
    );
};

export default Listing;