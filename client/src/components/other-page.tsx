import { Link } from 'react-router-dom';

function OtherPage() {
    return (
        <div>
            Im some other page!
            <div><Link to="/">Home</Link></div>
        </div>
    );
};

export { OtherPage };