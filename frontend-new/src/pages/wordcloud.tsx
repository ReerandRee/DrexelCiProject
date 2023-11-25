import { useEffect, useState } from 'react';
import ReactWordCloud, { Word } from 'react-wordcloud';
import axios from 'axios';
import { AutoComplete } from 'antd';

const WordCloud = () => {

    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [wordcloudData, setWordcloudData] = useState<Word[]>([]);

    useEffect(() => {
        axios.get('api/positionjobcount')
            .then((res) => {
                setOptions(res.data.map((city: any) => {
                    return {
                        value: city.position,
                        label: city.position
                    }
                }));
            });
        setIsLoading(false);
    }, []);

    const onSelect = (value: string) => {
        setIsLoading(true);
        axios.get(`/api/wordcloud?position=${value}`)
            .then((res) => {

                let words = '';
                for (let keywords of res.data) {
                    if (keywords.keywords) {
                        words += keywords.keywords;
                    }
                }

                let wordList = words.split(",");

                let wordCount: any = {};

                for (let word of wordList) {
                    word = word.trim();
                    if (wordCount[word]) {
                        wordCount[word] += 1;
                    } else {
                        wordCount[word] = 1;
                    }
                }

                let wordArray: Word[] = [];

                for (let word in wordCount) {
                    wordArray.push({
                        text: word as string,
                        value: wordCount[word] as number
                    })
                }

                console.log(wordArray);
                setWordcloudData(wordArray);
                setIsLoading(false);



            })
    }

    return (
        <div>

            <AutoComplete options={options}
                className="w-[400px]"
                allowClear={true}
                onSelect={onSelect}
                filterOption={(inputValue, option: any) => option!.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                placeholder="Select a position"
            />
            {isLoading ? <p>Loading...</p> : <ReactWordCloud words={wordcloudData} />}
        </div>
    )
}

export default WordCloud; 5