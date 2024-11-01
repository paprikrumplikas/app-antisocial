export const fetchUser = () => {
    // @learning getting userInfo from local storage. If user is undefined we clear it as that means sth went wrong, maybe user token expired

    const userInfo = localStorage.getItem('user');

    if (!userInfo || userInfo === 'undefined') {
        localStorage.clear();
        return null;
    }

    return JSON.parse(userInfo);
};