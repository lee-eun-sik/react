import { useParams, useSearchParams } from 'react-router-dom';

const Ex5 = () => {
    const { id, pw } = useParams(); // URL 파라미터 (경로 기반)
    const [searchParams] = useSearchParams(); // 쿼리 스트링
    const id2 = searchParams.get('id'); // ?id=xxx 형식에서 값 추출

    return (
        <>
            파라미터 넘기는 예제 id: {id} pw: {pw} id2: {id2}
        </>
    );
};

export default Ex5;