

export class CmUtil {

    // 입력값이 비어있는지 확인
    static isEmpty(val) {
        if (val === null || val === undefined) return true;
        if (typeof val === 'string' || Array.isArray(val)) return !(val.length > 0);
        if (typeof val === 'object') return !(Object.keys(val).length > 0);
        return false;
    }

    // 최소 길이 체크
    static minLength(value, length) {
        return value.length >= length;
    }

    // 최대 길이 체크
    static maxLength(value, length) {
        return value.length <= length;
    }

    // 숫자만 포함하는지 체크
    static isNumeric(value) {
        return /^[0-9]+$/.test(value);
    }

    // 이메일 형식 체크
    static isEmail(value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
    }

    // 아이디 강도 체크 (영문 + 숫자 + 특수문자 포함, 최소 8자 이상)
    static isStrongId(value) {
        var idPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return idPattern.test(value);
    }

    // 비밀번호 강도 체크 (영문 + 숫자 + 특수문자 포함, 최소 8자 이상)
    static isStrongPassword(value) {
        var passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return passwordPattern.test(value);
    }

    // 전화번호 형식 체크 (000-0000-0000 또는 000-000-0000)
    static isPhoneNumber(value) {
        var phonePattern = /^(\d{2,3})-(\d{3,4})-(\d{4})$/;
        return phonePattern.test(value);
    }

    // 날짜 포맷 체크 (YYYY-MM-DD)
    static isValidDate(value) {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
    }

    // 시작일이 종료일보다 빠른지 확인
    static isDateRangeValid(start, end) {
        if (!start || !end) return true;
        return new Date(start) <= new Date(end);
    }

     // 오늘 날짜 반환 (YYYY-MM-DD 형식)
     static getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 1월은 0부터 시작하므로 +1
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 날짜 계산 (년, 월, 일 단위로 계산)
    static addDate(date, { years = 0, months = 0, days = 0 }) {
        const newDate = new Date(date);
        
        // 년 단위 계산
        if (years) newDate.setFullYear(newDate.getFullYear() + years);
        
        // 월 단위 계산
        if (months) newDate.setMonth(newDate.getMonth() + months);
        
        // 일 단위 계산
        if (days) newDate.setDate(newDate.getDate() + days);
        
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    //미래 날짜 선택 방지
    static isDateFuture(date){
        if(!date) return false;
        const selectedDate = new Date(date);
        const today = new Date();

        //시간 초기화
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        return selectedDate > today;
    }
}
