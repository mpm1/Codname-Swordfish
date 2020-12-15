const userFactory = function(){
    const MASK_CLEAR = 0xFFFFFFF0;
    const MASK_NONE = 0x00;
    const MASK_TODO1 = 0x01;
    const MASK_BOT = 0x02;
    const MASK_HACKER = 0x04;
    const MASK_TODO2 = 0x08;
    const MASK_TODO3 = 0x0F;

    function generateUserName() {
        // Generate prefix and suffix and a trailing number
        return `${getNamePrefix()}${getNameSuffix}${Math.floor(Math.random() * 9999) + 1}`;
    }

    function generateUserId(index, propertyMask) {
        const timeString = (Date.now() & MASK_CLEAR) | propertyMask;
        const a = timeString.substr(timeString.length - 4);
        const b = timeString.substr(0, 4);
        const c = (index << 1).toString(16);
        const padding = Math.max(4 - index.length, 0);

        return `${a}-${b}-${Array(padding).join('A')}${c}`;
    }

    function generateBirthdate() {
        const daysMinus = Math.floor(((Math.random() * 62) + 18) * 365);
        const bday = new Date();
        bday.setDate(bday.getDate() - daysMinus);

        return bday;
    }

    function generateRandomUser(index, isHacker, isBot) {
        // NOTE: If user is both a bot and a hacker, we ignore the isBot bit. 
        const playerMask = (isHacker ? MASK_HACKER : MASK_NONE) | 
            (isBot ? MASK_BOT : MASK_NONE) |
            (Math.random() > 0.25 ? MASK_TODO1 : MASK_NONE) |
            (Math.random() > 0.5 ? MASK_TODO2 : MASK_NONE) |
            (Math.random() > 0.75 ? MASK_TODO3 : MASK_NONE); 

        return {
            id: generateUserId.call(this, index, propertyMask),
            username: generateUserName.call(this),
            birthDate: generateBirthdate.call(this)
        }
    }

    function createUserList(userCount, outputList = []) {
        for (let i = 0; i < userCount; ++i) {
            outputList.push(generateRandomUser.call(this, i));
        }

        return outputList;
    }

    class userFactory {
        console = null;
        directory = null;

        init(console) {
            this.console = console;
            this.directory = directory;
        }

        async onGetUserFile(fileMetaData) {
        }
    }

    return new userFactory();
}();