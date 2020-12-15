const { isNull } = require("util");

const mainGame = function() {
    let gameData = null;

    class SFGame {
        isInitialized = false;
        isRunning = false;
        directory = null;
        accountButton = null;
        console = null;

        constructor() {
        }

        init(console) {

        }

        async start() {
            if (!this.isInitialized) {
                this.console.error("Cannot start system before it's been initialized.");
                return;
            }

            if (this.isRunning) {
                return;
            }

            this.isRunning = true;
            this.updateButtons();

            // Check if the game folder exists.
            if (!this.directory) {
                this.directory = new Directory(this.console);
            }

            gameData = await this.directory.initialize(gapi.client.drive, "CodenameSwordfish", [
                { name: "users", mimetype: "application/vnd.google-apps.spreadsheet", onopen: (fileMetadata) => { userFactory.onGetUserFile(fileMetadata); }}
            ]);
        }

        stop() {
            if (!this.isRunning) {
                this.warning("Game is not running.");
                return;
            }

            this.isRunning = false;
        }

        updateButtons() {
            this.accountButton.disabled = false;

            if (this.isRunning) {
                this.accountButton.innerText = "Log Out";
            } else {
                this.accountButton.innerText = "Log In";
            }
        }

        enableAPI() {
            if(this.isInitialized) {
                return;
            }

            this.accountButton = document.getElementById("accountButton");
            this.accountButton.onclick = event => {
                this.accountButton.disabled = true;

                if (this.isRunning) {
                    gapi.auth2.getAuthInstance().signOut();
                } else {
                    gapi.auth2.getAuthInstance().signIn();
                }
            };

            const initializer = {
                apiKey: "AIzaSyCO1ck__H7tKMtO9ljHZRm2OnPv36ATuzY",
                clientId: "692084636640-3cg9av2s5rrg8rftb33opid8i470i7ip.apps.googleusercontent.com",
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                scope: "https://www.googleapis.com/auth/drive"
            };

            const signedInFunction = isSignedIn => {
                if (isSignedIn) {
                    this.start();
                } else {
                    this.stop();
                }

                this.updateButtons();
            }

            gapi.load("client:auth2", () => {
                gapi.client.init(initializer).then(() => {
                    this.isInitialized = true;

                    gapi.auth2.getAuthInstance().isSignedIn.listen(signedInFunction);

                    // Setup initial state
                    signedInFunction(gapi.auth2.getAuthInstance().isSignedIn.get());               
                }, (error) => {
                    this.console.error("Error enabling Google API.", error);
                });
            });
        }
    }

    return new SFGame();
}();

function handleClientLoad() {
    const console = new Console("console");
    mainGame.init(console);
    userFactory.init(console);

    mainGame.enableAPI()
}