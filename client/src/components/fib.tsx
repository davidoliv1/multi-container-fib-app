import axios from 'axios';
import { useEffect, useState } from 'react';

type RedisObject = {
    [key: string]: number;
}

function Fib() {
    const [indexValues, setIndexValues] = useState<RedisObject>({});
    const [indexes, setIndexes] = useState([]);
    const [indexInput, setIndexInput] = useState('');


    const fetchValues = async () => {
        const values = await axios.get('/api/values/current');
        setIndexValues(values.data);
    }

    const fetchIndexes = async () => {
        const seenIndexes = await axios.get('/api/values/all');
        setIndexes(seenIndexes.data);
    }

    const renderIndexValues = () => {
        const entries = [];

        for (const key in indexValues) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {indexValues[key]}
                </div>
            );
        };

        return entries;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await axios.post('/api/values', {
            index: indexInput,
        });

        setIndexInput('');
    }

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, [])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Enter your index:</label>
                <input 
                    type="text" 
                    value={indexInput}
                    onChange={(e) => setIndexInput(e.target.value)} 
                />
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            <div>{indexes.map(({ number }) => number).join(', ')}</div>

            <h3>Calculated Values:</h3>
            <div>{renderIndexValues()}</div>
        </div>
    );
};

export { Fib };