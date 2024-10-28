export const fetchUser = () => {
    // @learning getting userInfo from local storage. If user is undefined we clear it as that means sth went wrong, maybe user token expired
    const userInfo = localStorage.getItem('user') !== "undefined" ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    return userInfo;
}