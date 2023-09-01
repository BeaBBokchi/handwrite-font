let userObj = {
    userData: null,
    setUserData: (data) => {
        userObj.userData = data;
    },
    initUserData: () => {
        userObj.userData = null;
    },
};

export default userObj;
