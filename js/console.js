class Console {
    _element = null;

    constructor(elementId) {
        this._element = document.getElementById(elementId);    
    }

    write(message, clazz = "") {
        if (this._element) {
            const div = document.createElement("div");
            div.className = "console-line " + clazz;
            div.innerText = message;

            this._element.appendChild(div);
        } else {
            if(clazz.includes("error")) {
                console.error(message);
            } else if (clazz.includes("warning")) {
                console.warn(message);
            } else {
                console.log(message);
            }
        }
    }

    writeLine(message, clazz = "") {
        this.write(message + "\n", clazz);
    }

    error(message, error) {
        let childError = "";
        if(error) {
            childError = `\n${error.error} - ${error.details}`
        }

        this.writeLine(`Error: ${message}${childError}`, "error");
    }

    warn(message) {
        this.writeLine(`Warning: ${message}`, "warning");
    }
}