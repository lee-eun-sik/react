import { useRef } from 'react';

const Ex8 = () => {
    const inputRef = useRef(null);

    return (
        <>
            <input type='text' ref={inputRef} />
            <button 
                type='button'
                onClick={() => inputRef.current.focus()}
            >
                포커스
            </button>
        </>
    );
}

export default Ex8;