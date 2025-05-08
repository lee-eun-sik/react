import { useReducer } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'p':
            return { count: state.count + 1 };
        case 'm':
            return { count: state.count - 1 };
        case 'r':
            return { count: 0 };
        default:
            return state;
    }
}

const Ex7 = () => {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <>
            카운트: {state.count} <br />
            <button onClick={() => dispatch({ type: 'p' })}>증가</button><br />
            <button onClick={() => dispatch({ type: 'm' })}>감소</button><br />
            <button onClick={() => dispatch({ type: 'r' })}>리셋</button><br />
        </>
    );
};

export default Ex7;